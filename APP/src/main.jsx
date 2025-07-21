import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Venda from "./pages/venda/Venda.jsx";
import Pesquisa from "./pages/pesquisa/Pesquisa.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import Login from "./pages/Login/Login.jsx";
import ContaPessoal from "./pages/ContaPessoal/ContaPessoal.jsx";
import ContaVendedor from "./pages/ContaVendedor/ContaVendedor.jsx";
import CadastrarCep from "./pages/CadastrarCep/CadastrarCep.jsx";
import PaginaVendedor from "./pages/PaginaVendedor/PaginaVendedor.jsx";
import MyPurchases from "./pages/MyPurchases/MyPurchases.jsx";
import Track from "./pages/MyPurchases/Track/Track.jsx";
import PurchasesStatus from "./pages/MyPurchases/PurchasesStatus/PurchasesStatus.jsx";
import Details from "./pages/MyPurchases/Details/Details.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/venda",
    element: <Venda />,
    errorElement: <NotFound />,
  },
  {
    path: "/pesquisa",
    element: <Pesquisa />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/contapessoal",
    element: <ContaPessoal />,
    errorElement: <NotFound />,
  },
  {
    path: "/contavendedor",
    element: <ContaVendedor />,
    errorElement: <NotFound />,
  },
  {
    path: "/cadastrarcep",
    element: <CadastrarCep />,
    errorElement: <NotFound />,
  },
  {
    path: "/paginavendedor",
    element: <PaginaVendedor />,
    errorElement: <NotFound />,
  },
  {
    path: "/minhas-compras",
    element: <MyPurchases />,
    errorElement: <NotFound />,
  },
  {
    path: "/minhas-compras/rastrear",
    element: <Track />,
    errorElement: <NotFound />,
  },
  {
    path: "/minhas-compras/status",
    element: <PurchasesStatus />,
    errorElement: <NotFound />,
  },
  {
    path: "/minhas-compras/detalhes",
    element: <Details />,
    errorElement: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
