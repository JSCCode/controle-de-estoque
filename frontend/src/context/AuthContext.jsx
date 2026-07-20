import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  function login(novoToken) {
    setToken(novoToken);
  }

  function logout() {
    setToken(null);
  }

  const estaLogado = token !== null;

  return (
    <AuthContext.Provider value={{ token, login, logout, estaLogado }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}