
import { useAuth } from "@/app/providers/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import useFieldErrors from "@/hooks/use-field-errors"
import { cn } from "@/lib/utils"
import { loginSchema } from "@/shared/schemas/auth.schema"
import { isAuthApiError, type Provider } from "@supabase/supabase-js"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { fieldErrors, handleSetFieldErrors, emptyFieldErrors } = useFieldErrors()
  const { loginWithPassword, loginWithOAuth } = useAuth()

  const [passwordInputType, setPasswordInputType] = useState<
    'text' | 'password'
  >('password')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  async function handleLoginWithPassword() {
    emptyFieldErrors()
    setIsLoading(true)
    try {
      const validate = loginSchema.safeParse({ email, password })
      if (!validate.success) return handleSetFieldErrors(validate.error)
      await loginWithPassword(email, password)
    } catch (error) {
      if (isAuthApiError(error)) {
        toast.error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLoginWithOAuth(provider: Provider) {
    try {
      await loginWithOAuth(provider)
    } catch (error) {
      if (isAuthApiError(error)) toast.error(error.message)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>Login to your account</h1>
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FieldError errors={fieldErrors.email} />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <NavLink
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    to="/forgot-password">
                    Forgot your password?
                  </NavLink>
                </div>

                <InputGroup>
                  <InputGroupInput
                    id="password"
                    className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                    type={passwordInputType}
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
                    }}>
                    {passwordInputType === 'password' ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroup>
                <FieldError errors={fieldErrors.password} />
              </Field>

              <Button onClick={() => { handleLoginWithPassword() }}>
                {isLoading && <Spinner />}
                Login
              </Button>

              <FieldSeparator>Or</FieldSeparator>

              <Button
                variant="outline"
                onClick={
                  () => { handleLoginWithOAuth('google') }
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
              <FieldDescription className="text-center">
                Don't have an account? <NavLink to={'/register'}>Register</NavLink>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
