import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("usuario");

      if(token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error al parsear el usuario del localStorage:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      setUser({...usuario});
      return {ok: true, data: response.data};
    } catch (error) {
      const message = error.response?.data?.error || "Error al iniciar sesión";
      return { ok: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
  };

  return (<AuthContext.Provider value={{user, isAuthenticated: !!user, loading, login, logout}}> {children} </AuthContext.Provider>);
};