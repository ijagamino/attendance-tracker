
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateUserPassword } from "@/supabase/auth"
import { CustomAuthError, isAuthApiError } from "@supabase/supabase-js"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { EyeOffIcon, EyeIcon } from "lucide-react"
import { useNavigate } from "react-router"

export default function UpdatePasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordInputType, setPasswordInputType] = useState<
    'text' | 'password'
  >('password')
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState<
    'text' | 'password'
  >('password')

  async function handleUpdatePassword() {
    try {
      if (password !== confirmPassword) return toast.error('Passwords do not match')
      await updateUserPassword(password)
      navigate('/')
    } catch (error) {
      if (isAuthApiError(error)) {
        toast.error(`${error.message}`)
      } else if
        (error instanceof CustomAuthError) {
        toast.error(error.message)
      }
    }
  }

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">
                  Enter new password
                </FieldLabel>
                <InputGroup>
                  <Input
                    id="password"
                    type={passwordInputType}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <InputGroupButton
                    onClick={() => {
                      setPasswordInputType(() => {
                        if (passwordInputType === 'password') {
                          return 'text'
                        } else {
                          return 'password'
                        }
                      })
                    }}
                  >
                    {passwordInputType === 'password' ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm_password">
                  Confirm new password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="confirm_password"
                    type={confirmPasswordInputType}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputGroupButton
                    onClick={() => {
                      setConfirmPasswordInputType(() => {
                        if (confirmPasswordInputType === 'password') {
                          return 'text'
                        } else {
                          return 'password'
                        }
                      })
                    }}
                  >
                    {passwordInputType === 'password' ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroup>
              </Field>

              <Field>
                <Button onClick={() => { handleUpdatePassword() }}>Update password</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
