// UserContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost/tcc/API/GET/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((dataUser) => {
        if (dataUser.success) {
          console.log("Usuário logado:", dataUser.user);
          setUser(dataUser.user);
        } else {
          console.log("Erro usuário:", dataUser);
        }
      })
      .catch((err) => console.error("Erro API user:", err));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
