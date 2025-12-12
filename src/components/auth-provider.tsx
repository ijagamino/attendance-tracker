import { createContext, useContext, useState } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthProviderState = {
  isAuth: boolean;
  login: () => void;
  logout: () => void;
};

const initialState: AuthProviderState = {
  isAuth: false,
  login: () => null,
  logout: () => null,
};

const AuthProviderContext = createContext<AuthProviderState>(initialState);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const login = () => setIsAuth(true);
  const logout = () => setIsAuth(false);

  return (
    <AuthProviderContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const auth = useContext(AuthProviderContext);

  if (auth === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return auth;
};
