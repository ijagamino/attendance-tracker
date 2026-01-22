import { TypographyH1, TypographyH2 } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/app/providers/auth-provider";

export default function SettingsPage() {
  const { firstName, lastName } = useAuth()

  return (
    <>
      <TypographyH1>
        Account Settings
      </TypographyH1>

      <Separator className="my-4" />

      <TypographyH2>
        Personal information
      </TypographyH2 >

      <FieldGroup className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>First Name</FieldLabel>
          <Input defaultValue={firstName} />
        </Field>

        <Field>
          <FieldLabel>Last Name</FieldLabel>
          <Input defaultValue={lastName} />
        </Field>
      </FieldGroup>

      {/* <Separator className="my-4" /> */}

      {/* <TypographyH2> */}
      {/*   Login Information */}
      {/* </TypographyH2 > */}
    </>
  )
}
