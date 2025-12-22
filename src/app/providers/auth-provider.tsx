import { signInWithEmail } from '@/supabase/auth.ts'
import { supabase } from '@/supabase/client.ts'
import type { Role } from '@/supabase/global.types'
import type { Session } from '@supabase/supabase-js'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

type AuthProviderProps = {
  children: ReactNode
}

type AuthProviderState = {
  userId: string | undefined
  role: Role | null
  isLoading: boolean
  isAuth: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const initialState: AuthProviderState = {
  userId: undefined,
  role: null,
  isLoading: true,
  isAuth: false,
  login: async () => { },
  logout: async () => { },
}

const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true)
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true)

  const isLoading = isSessionLoading || isRoleLoading

  const isAuth = !!session
  const userId = session?.user.id

  async function login(email: string, password: string) {
    const { session } = await signInWithEmail(email, password)
    setSession(session)
    return
  }

  async function logout() {
    await supabase.auth.signOut()
    setSession(null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSessionLoading(false)
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSessionLoading(false)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function fetchRole() {
      if (!session?.user) {
        setRole(null)
        setIsRoleLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (!error) setRole(data?.role ?? null)

      setIsRoleLoading(false)
    }

    fetchRole()
  }, [session])

  return (
    <AuthProviderContext.Provider
      value={{
        userId,
        role,
        isLoading,
        isAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  )
}

export const useAuth = () => {
  const auth = useContext(AuthProviderContext)

  if (auth === undefined)
    throw new Error('useAuth must be used within a AuthProvider')

  return auth
}
