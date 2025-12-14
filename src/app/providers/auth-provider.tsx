import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from 'react'
import { useApiFetch } from '@/hooks/use-api-fetch.ts'
import { apiClient } from '@/lib/api/api-client.ts'

type AuthProviderProps = {
  children: ReactNode
}

export type AccessToken = string | null

type AuthProviderState = {
  accessToken: AccessToken
  setAccessToken: (token: AccessToken) => void
  isLoading: boolean
  isAuth: boolean
  login: ({ username, password }: LoginRequestBody) => Promise<AccessToken>
  logout: () => void
}

interface LoginRequestBody {
  username: string
  password: string
}

const initialState: AuthProviderState = {
  accessToken: null,
  setAccessToken: () => {},
  isLoading: true,
  isAuth: false,
  login: async () => null,
  logout: async () => {},
}

const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({ children }: AuthProviderProps) {
  const apiFetch = useApiFetch()
  const [accessToken, setAccessToken] = useState<AccessToken>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const isAuth = !!accessToken

  async function login({ username, password }: LoginRequestBody) {
    const data: string = await apiFetch('auth/login', 'POST', {
      body: JSON.stringify({
        username,
        password,
      }),
    })
    setAccessToken(data)
    return data
  }

  async function logout() {
    setAccessToken(null)
    return await apiFetch('auth/logout', 'DELETE', {
      credentials: 'include',
    })
  }

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await apiClient('auth/refresh', 'POST')

        if (!res.ok) return

        const data = await res.json()
        setAccessToken(data.accessToken)
      } catch (err) {
        console.error(err)
        setAccessToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchToken()
  }, [])

  return (
    <AuthProviderContext.Provider
      value={{ accessToken, setAccessToken, isLoading, isAuth, login, logout }}
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
