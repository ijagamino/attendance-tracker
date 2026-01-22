import { TypographyH1 } from '@/components/ui/typography'
import { LoginForm } from './ui/form'

export default function LoginPage() {
  return (
    <>
      <TypographyH1>Attendance Tracking System</TypographyH1>
      <LoginForm className='mt-4' />
    </>
  )
}
