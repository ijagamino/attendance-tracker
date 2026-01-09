import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {

  return (
    <>
      <TypographyH1>
        Account Settings
      </TypographyH1>

      <Separator className="my-4" />

      <TypographyH2>
        Personal information
      </TypographyH2 >

      <Field>
        <FieldLabel>First Name</FieldLabel>
        <Input />
      </Field>

      <Separator className="my-4" />

      <TypographyH2>
        Login Information
      </TypographyH2 >
    </>
  )
}
