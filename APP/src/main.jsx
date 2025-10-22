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
import EditSeller from "./pages/PaginaVendedor/EditSeller/EditSeller.jsx";
import AddProduct from "./pages/PaginaVendedor/AddProduct/AddProduct.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import UpdateProfile from "./pages/ProfilePage/UpdateProfile/UpdateProfile.jsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage .jsx";
import SalesManagement from "./pages/SalesManagement/SalesManagement.jsx";
import MyHistory from "./pages/MyHistory/MyHistory.jsx";
import { SalesProvider } from "./context/SalesContext.jsx";
import UserAgreement from "./pages/UserAgreement/UserAgreement.jsx";
import AdicionarPromocao from "./pages/AdicionarPromocao/AdicionarPromocao.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/contrato-usuario",
    element: <UserAgreement />,
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
    path: "/minhaconta",
    element: <ProfilePage />,
    errorElement: <NotFound />,
  },
  {
    path: "/minhaconta/editar-perfil",
    element: <UpdateProfile />,
    errorElement: <NotFound />,
  },
  {
    path: "/paginavendedor",
    element: <PaginaVendedor />,
    errorElement: <NotFound />,
  },
  {
    path: "/paginavendedor/editar-perfil",
    element: <EditSeller />,
    errorElement: <NotFound />,
  },
  {
    path: "/paginavendedor/adicionar-produto",
    element: <AddProduct />,
    errorElement: <NotFound />,
  },
  {
    path: "/paginavendedor/editar-produto",
    element: <AddProduct />,
    errorElement: <NotFound />,
  },
  {
    path: "/paginavendedor/editar-produto/adicionar-promocao",
    element: <AdicionarPromocao />,
    errorElement: <NotFound />,
  },
  {
    path: "/resumo/vendas",
    element: <SalesManagement />,
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
  {
    path: "/venda/finalizar-compra",
    element: <CheckoutPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/historico",
    element: <MyHistory />,
    errorElement: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <SalesProvider>
        <RouterProvider router={router} />
      </SalesProvider>
    </UserProvider>
  </StrictMode>
);
