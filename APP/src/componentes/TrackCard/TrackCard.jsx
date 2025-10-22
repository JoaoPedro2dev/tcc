import "./TrackCard.css";

import { formatarData } from "../../helpers/functions.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { useUser } from "../../context/UserContext.jsx";

function TrackCard() {
  const navigate = useNavigate();

  // const { user } = useUser();

  const [compra, setCompra] = useState({});

  useEffect(() => {
    // if (user) {
    fetch("http://localhost/tcc/API/GET/compra-by-id")
      .then((r) => r.json())
      .then((data) => {
        console.log("compra", data);
        if (data) {
          setCompra(data);
        }
      })
      .catch((error) => console.error("erro", error));
    // }
  }, []);

  function verificarStatus(status) {
    if (status === "Chegou") {
      return "animated";
    } else if (status === "Entregue") {
      return "green";
    }
  }

  if (compra.id_compra) {
    return (
      <article id="trackCardBody">
        <h1>Acompanhe seu pedido</h1>

        <p className="colorGray">Endereço: {compra.endereco_entrega}</p>
        <p className="colorGray">Quem recebe: {compra.quem_recebe}</p>

        <hr />

        {compra.itens.map((item, key) => (
          <section key={key}>
            <div>
              <img src={item.produc_image} alt={item.product_name} />
              <strong>{item.product_name}</strong>
            </div>

            <div>
              {item.status != "entregue" && item.status != "chegou" && (
                <h2>
                  Seu pedido chegara até o dia{" "}
                  {formatarData(item.data_previsao)}
                </h2>
              )}

              {item.status === "entregue" && <h2>Seu pedido foi entregue</h2>}

              {item.status === "chegou" && <h2>Seu pedido chegou</h2>}

              <div>
                <div>
                  <span
                    className={item.status === "pendente" ? "animated" : ""}
                  ></span>
                  <p>Em preparação</p>
                </div>

                <div>
                  <span
                    className={
                      item.status === "em_transporte" ? "animated" : ""
                    }
                  ></span>
                  <p>Saiu para entrega</p>
                </div>

                <div>
                  <span className={verificarStatus(item.status)}></span>
                  <p>{item.status === "entregue" ? "Entregue" : "Chegou"}</p>
                </div>
              </div>
            </div>
          </section>
        ))}

        <button
          id="details-btn"
          onClick={() => navigate("/minhas-compras/detalhes")}
        >
          VER DETALHES
        </button>
      </article>
    );
  }
}

export default TrackCard;
