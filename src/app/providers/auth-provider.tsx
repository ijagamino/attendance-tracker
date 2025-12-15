import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useApiFetch } from '@/hooks/use-api-fetch.ts'
import type {
  AccessToken,
  LoginResponse,
  ApiResponse,
  UserRole,
  LoginRequestBody,
} from 'shared/types/api'

type AuthProviderProps = {
  children: ReactNode
}

type AuthProviderState = {
  accessToken: AccessToken
  setAccessToken: (token: AccessToken) => void
  userRole: UserRole
  isLoading: boolean
  isAuth: boolean
  login: ({
    username,
    password,
  }: LoginRequestBody) => Promise<ApiResponse<LoginResponse>>
  logout: () => void
}

const initialState: AuthProviderState = {
  accessToken: null,
  setAccessToken: () => {},
  userRole: null,
  isLoading: true,
  isAuth: false,
  login: async (): Promise<ApiResponse<LoginResponse>> => ({
    data: {
      accessToken: null,
      user: { id: 0, role: 'user' },
    },
  }),
  logout: async () => {},
}

const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({ children }: AuthProviderProps) {
  const apiFetch = useApiFetch()
  const [accessToken, setAccessToken] = useState<AccessToken>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [userRole, setUserRole] = useState<UserRole>(null)

  const isAuth = !!accessToken

  async function login({ username, password }: LoginRequestBody) {
    const response = await apiFetch<ApiResponse<LoginResponse>>(
      'auth/login',
      'POST',
      {
        body: JSON.stringify({
          username,
          password,
        }),
      }
    )
    setAccessToken(response.data.accessToken)
    setUserRole(response.data.user.role)
    return response
  }

  async function logout() {
    setAccessToken(null)
    setUserRole(null)
    return await apiFetch('auth/logout', 'DELETE')
  }

  useEffect(() => {
    function fetchToken() {
      apiFetch<ApiResponse<LoginResponse>>('auth/refresh', 'POST', {}, false)
        .then((response) => {
          setAccessToken(response.data.accessToken)
          setUserRole(response.data.user.role)
        })
        .catch((error) => {
          console.error(error)
          setAccessToken(null)
          setUserRole(null)
        })
        .finally(() => setIsLoading(false))
    }

    fetchToken()
  }, [apiFetch])

  return (
    <AuthProviderContext.Provider
      value={{
        accessToken,
        setAccessToken,
        userRole,
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
