import { createContext, useState, useContext, useEffect } from "react";

const SalesContext = createContext();

export function SalesProvider({ children }) {
  // pega do localStorage ou inicia vazio
  const [sales, setSales] = useState(() => {
    const stored = localStorage.getItem("sales");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  return (
    <SalesContext.Provider value={{ sales, setSales }}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  return useContext(SalesContext);
}
