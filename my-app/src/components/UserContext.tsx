// UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userFromLocalStorage = JSON.parse(localStorage.getItem("UsuarioSesion"));
    if (userFromLocalStorage) {
      setUser(userFromLocalStorage);
    }
  }, []);

  const login = (usuario) => {
    setUser(usuario);
    localStorage.setItem("UsuarioSesion", JSON.stringify(usuario));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("UsuarioSesion");
    cookies.remove("id", { path: "/" });
    cookies.remove("correo", { path: "/" });
    cookies.remove("rol", { path: "/" });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
