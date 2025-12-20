CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

CREATE TABLE IF NOT EXISTS
    public.profiles
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    first_name  TEXT NOT NULL,
    role        app_role NOT NULL,

    CONSTRAINT unique_user_profile UNIQUE (user_id)
)
