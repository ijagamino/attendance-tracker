import { createContext, useContext, useState, ReactNode } from 'react'

type AuthProviderProps = {
  children: ReactNode
}

type AccessToken = string | null

type AuthProviderState = {
  accessToken: AccessToken
}

// const initialState: AuthProviderState = {
//   isAuth: false,
//   login: () => null,
//   logout: () => null,
// };

const AuthProviderContext = createContext<AuthProviderState | null>(null)

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<AccessToken>(null)

  const isAuth = !!accessToken

  function logout() {
    setAccessToken(null)
    fetch('auth/logout', {
      method: 'DELETE',
      credentials: 'include',
    })
  }

  return (
    <AuthProviderContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthProviderContext.Provider>
  )
}

export const useAuth = () => {
  const auth = useContext(AuthProviderContext)

  if (auth === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return auth
}
