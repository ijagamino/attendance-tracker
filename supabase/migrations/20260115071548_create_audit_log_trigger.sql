CREATE TABLE IF NOT EXISTS public.logged_actions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  schema_name TEXT NOT NULL,
  table_name TEXT NOT NULL,
  action_type TEXT NOT NULL 
  CHECK (action_type IN ('INSERT', 'UPDATE', 'DELETE')),
  row_data JSONB,
  changed_fields JSONB,
  action_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  transaction_id xid8 DEFAULT pg_current_xact_id(),
  statement_only TEXT,       
  additional_info JSONB
);

CREATE FUNCTION public.if_modified_func()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  v_old_data JSONB;
  v_new_data JSONB;
  v_changed_fields JSONB;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := NULL;
    v_changed_fields := NULL;
  ELSIF (TG_OP = 'INSERT') THEN
    v_old_data := NULL;
    v_new_data := to_jsonb(NEW);
    v_changed_fields := v_new_data;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_old_data := to_jsonb(OLD) - 'password_hash' - 'reset_token';
    v_new_data := to_jsonb(NEW);
    SELECT jsonb_object_agg(key, value)
    INTO v_changed_fields
    FROM (
      SELECT key, value
      FROM jsonb_each(v_new_data)
      WHERE v_new_data->>key IS DISTINCT FROM v_old_data->>key
    ) AS changed;
    
    IF v_changed_fields IS NULL OR v_changed_fields = '{}'::jsonb THEN
      RETURN NEW;
    END IF;
  END IF;

  BEGIN
    INSERT INTO public.logged_actions (
      schema_name, table_name, user_id, 
      action_type, row_data, changed_fields,
      action_timestamp, transaction_id, statement_only
    ) VALUES (
      TG_TABLE_SCHEMA, TG_TABLE_NAME, auth.uid(), 
      TG_OP, v_old_data, v_changed_fields,
      CURRENT_TIMESTAMP, pg_current_xact_id(), current_query()
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Audit log insertion failed: %', SQLERRM;
  END;

  IF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;

EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Audit trigger failed: %', SQLERRM;
  IF (TG_OP = 'DELETE') THEN RETURN OLD;
  ELSE RETURN NEW;
  END IF;
END;
$function$;

-- Helper function for bulk trigger application
CREATE OR REPLACE FUNCTION public.audit_table(
    target_schema TEXT,
    target_table TEXT
) RETURNS VOID AS $$
DECLARE
    trigger_name TEXT;
BEGIN
    trigger_name := 'audit_trigger_' || target_table;
    
    -- Idempotent: drop if exists
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I.%I',
        trigger_name, target_schema, target_table);
    
    -- Create audit trigger
    EXECUTE format('CREATE TRIGGER %I
        AFTER INSERT OR UPDATE OR DELETE ON %I.%I
        FOR EACH ROW
        EXECUTE FUNCTION public.if_modified_func()',
        trigger_name, target_schema, target_table);
    
    RAISE NOTICE 'Audit enabled on %.%', target_schema, target_table;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to audit %.%: %', 
        target_schema, target_table, SQLERRM;
    RAISE;
END;
$$ LANGUAGE plpgsql;

SELECT public.audit_table('public', 'attendance_records');
SELECT public.audit_table('public', 'profiles');
