import { AuthProvider } from '@/app/providers/auth-provider'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import type { ReactNode } from 'react'

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        {children}
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}
