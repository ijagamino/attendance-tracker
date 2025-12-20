import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group.tsx'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { toast } from 'sonner'
import { signUpWithEmail } from '@/supabase/auth'
import { ApiError } from '@/lib/error/api-error.ts'
import { type FormEvent, useState } from 'react'
import { isAuthApiError } from '@supabase/supabase-js'

export default function RegisterPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [passwordInputType, setPasswordInputType] = useState<
    'text' | 'password'
  >('password')

  async function handleSubmit(e: FormEvent) {
    console.log(e)
    e.preventDefault()

    try {
      const userData = await signUpWithEmail(email, password)
    } catch (error) {
      if (isAuthApiError(error)) {
        toast.error(`${error.status}: ${error.message}`)
      }
    }
  }

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>

        <hr />

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                className="px-2 py-1 border-2 rounded border-teal-600/20 focus:border-teal-600 focus:outline-none"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
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
                  {passwordInputType === 'password' ? <EyeOff /> : <Eye />}
                </InputGroupButton>
              </InputGroup>
            </div>
          </CardContent>

          <CardFooter className="grid grid-cols-1">
            <Button className="w-full">Register</Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}
