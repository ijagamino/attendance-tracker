import { Button } from '@/components/ui/button.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { signUpWithEmail } from '@/supabase/auth'
import { CustomAuthError, isAuthApiError } from '@supabase/supabase-js'
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from 'react'
import { NavLink } from "react-router"
import { toast } from 'sonner'

export default function RegisterForm() {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [passwordInputType, setPasswordInputType] = useState<
    'text' | 'password'
  >('password')
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState<
    'text' | 'password'
  >('password')

  async function handleRegister() {
    try {
      if (password !== confirmPassword) return toast.error('Passwords do not match')
      await signUpWithEmail({ email, password, firstName, lastName })
    } catch (error) {
      if (isAuthApiError(error)) {
        toast.error(`${error.status}: ${error.message}`)
      } else if
        (error instanceof CustomAuthError) {
        toast.error(error.message)
      }
    }
  }
  return (

    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Enter your email and password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          {/* personal details */}
          <FieldGroup>
            <div className='flex flex-row gap-4'>
              <Field>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Field>
            </div>

            <hr />

            {/* authentication details */}
            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field>
              <Label htmlFor="password">Password</Label>
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
                  }}
                >
                  {passwordInputType === 'password' ? <EyeOffIcon /> : <EyeIcon />}
                </InputGroupButton>
              </InputGroup>
            </Field>

            <Field>
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <InputGroup>
                <InputGroupInput
                  id="confirm_password"
                  className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                  type={confirmPasswordInputType}
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
                  {confirmPasswordInputType === 'password' ? <EyeOffIcon /> : <EyeIcon />}
                </InputGroupButton>
              </InputGroup>
            </Field>

            <Field>
              <Button type="submit" onClick={() => { handleRegister() }}>Register</Button>
              <FieldDescription className="text-center">
                Already have an account? <NavLink to={'/login'}>Log in</NavLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
