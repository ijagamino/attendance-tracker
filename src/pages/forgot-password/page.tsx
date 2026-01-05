import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { resetPasswordForEmail } from "@/supabase/auth"
import { CustomAuthError, isAuthApiError } from "@supabase/supabase-js"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('')
  const [isEmailed, setIsEmailed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleForgotPassword() {
    setIsLoading(true)
    try {
      await resetPasswordForEmail(email)
      setIsEmailed(true)
    } catch (error) {
      if (isAuthApiError(error)) toast.error(error.message)
      if (error instanceof CustomAuthError) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <>
        <Card>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">
                    Enter your email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field>
                  <Button
                    onClick={() => { handleForgotPassword() }}
                    disabled={isEmailed}
                  >
                    {isLoading && <Spinner />}
                    {isEmailed ? 'Email sent' : 'Reset password'}
                  </Button>
                  <FieldDescription className="text-center">
                    <NavLink to={'/'}>Go back</NavLink>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </>
    </>
  )
}
