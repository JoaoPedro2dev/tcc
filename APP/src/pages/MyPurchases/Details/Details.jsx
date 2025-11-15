import "./Details.css";
import Header from "../../../componentes/Header/Header.jsx";
import PaymentCard from "./PaymentCard/PaymentCard.jsx";
import PaymentDetails from "./PaymentDetails/PaymentDetails.jsx";
import DeliveryDetails from "./DeliveryDetails/DeliveryDetails.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import ItensDetails from "./ItensDetails/ItensDetails.jsx";
import { useEffect, useState } from "react";

function Details() {
  const location = useLocation();
  const compraId = location.state ?? false;

  const [compra, setCompra] = useState({});

  useEffect(() => {
    fetch("http://localhost/tcc/API/GET/compra-by-id", {
      method: "POST",
      body: new URLSearchParams({ id_compra: compraId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          console.log("DETALHES", data);
          setCompra(data);
        }
      })
      .catch((error) => console.error("erro", error));
  }, []);

  const navigate = useNavigate();
  return (
    <div id="detailsBody">
      <Header title={"Detalhes da compra"} />

      {compra.itens && (
        <main>
          <PaymentCard compra={compra} />

          <h1>Detalhes do pagamento</h1>
          <PaymentDetails compra={compra} />

          <h1>Detalhes da entrega</h1>
          <DeliveryDetails compra={compra} />

          <h1>Itens da compra</h1>
          {compra.itens?.map((item, key) => (
            <ItensDetails key={key} item={item} index={key + 1} />
          ))}
        </main>
      )}

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
