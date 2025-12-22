import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useAuth } from '@/app/providers/auth-provider.tsx'
import { useNavigate } from 'react-router'
import { type FormEvent, useState } from 'react'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group.tsx'
import { Eye, EyeOff } from 'lucide-react'
import { isAuthApiError } from '@supabase/supabase-js'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [passwordInputType, setPasswordInputType] = useState<
    'text' | 'password'
  >('password')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      if (isAuthApiError(error)) {
        toast.error(error.message)
      }
    }
  }

  return (
    <>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardAction>
            No account yet?{' '}
            <span
              className="underline cursor-pointer"
              onClick={() => {
                navigate('/register')
              }}
            >
              Register
            </span>
          </CardAction>
          <CardDescription>
            Enter your email and password to login
          </CardDescription>
        </CardHeader>

        <hr />

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
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
            <Button className="w-full">Log In</Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}
