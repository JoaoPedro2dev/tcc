import "./Details.css";
import Header from "../../../componentes/Header/Header.jsx";
import PaymentCard from "./PaymentCard/PaymentCard.jsx";
import PaymentDetails from "./PaymentDetails/PaymentDetails.jsx";
import DeliveryDetails from "./DeliveryDetails/DeliveryDetails.jsx";
import { useNavigate } from "react-router-dom";
import ItensDetails from "./ItensDetails/ItensDetails.jsx";

function Details() {
  const compra = {
    id: 1,
    data: "2025-01-01",
    id_string: "#122412BASDASAS",
    produtos: [
      {
        id: 1,
        imagem: "http://localhost/tcc/API/UPLOADS/images/imagem6.png",
        nome: "tenis 6",
        quantidade: 1,
        valor: 4,
        promocao: null,
        frete: 0,
        desconto: 0,
        cor: "azul",
        tamanho: "39",
      },
      {
        id: 2,
        imagem: "http://localhost/tcc/API/UPLOADS/images/imagem2.png",
        nome: "tenis 6",
        quantidade: 1,
        valor: 4,
        promocao: null,
        frete: 0,
        desconto: 0,
        cor: "azul",
        tamanho: "39",
      },
      {
        id: 3,
        imagem: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
        nome: "tenis 6",
        quantidade: 3,
        valor: 4,
        promocao: 2,
        frete: 0,
        desconto: 0,
        cor: "azul",
        tamanho: "39",
      },
    ],
  };

  const navigate = useNavigate();
  return (
    <div id="detailsBody">
      <Header />
      <main>
        <PaymentCard compra={compra} />

        <h1>Detalhes do pagamento</h1>
        <PaymentDetails />

        <h1>Detalhes da entrega</h1>
        <DeliveryDetails />

        <h1>Itens da compra</h1>
        {compra.produtos.map((item, key) => (
          <ItensDetails key={key} item={item} index={key + 1} />
        ))}
      </main>

      <button
        id="backBtn"
        onClick={() => {
          navigate("/minhas-compras");
        }}
      >
        Voltar a meus produtos
      </button>
    </div>
  );
}

export default Details;
