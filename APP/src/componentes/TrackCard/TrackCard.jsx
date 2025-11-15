import "./TrackCard.css";

import { formatarData } from "../../helpers/functions.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext.jsx";

function TrackCard({ compraId }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [compra, setCompra] = useState({});

  useEffect(() => {
    fetch("http://localhost/tcc/API/GET/compra-by-id", {
      method: "POST",
      body: new URLSearchParams({ id_compra: compraId }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("compra", data);
        if (data) {
          setCompra(data);
        }
      })
      .catch((error) => console.error("erro", error));
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
        <p className="colorGray">Quem recebe: {user?.name}</p>

        <hr />

        {compra.itens.map((item, key) => (
          <section key={key}>
            <div>
              <img
                src={item.produc_image}
                alt={item.product_name}
                onClick={() => {
                  navigate("/venda?", { state: item.id_produto });
                }}
              />
              <strong>{item.product_name}</strong>
            </div>

            <div>
              {item.status != "entregue" &&
                item.status != "chegou" &&
                item.status != "cancelado" && (
                  <h2>
                    Seu pedido chegara até o dia{" "}
                    {formatarData(item.data_previsao)}
                  </h2>
                )}

              {item.status === "entregue" && <h2>Seu pedido foi entregue</h2>}

              {item.status === "chegou" && <h2>Seu pedido chegou</h2>}

              {item.status === "cancelado" && <h2>Seu pedido foi cancelado</h2>}

              {item.status === "cancelado" ? (
                <div className="track-cancelled-container">
                  <p>Quem cancelou: {item.quem_cancelou}</p>
                  <p>Motivo: {item.motivo_cancelamento}</p>
                  <p className="color">
                    Efetuaremos seu reembolso em até 5 dias úteis
                  </p>
                  {/* <span className="cancelled"></span> */}
                </div>
              ) : (
                <div>
                  <div>
                    <span
                      className={
                        item.status === "pendente" ||
                        item.status === "confirmado"
                          ? "animated"
                          : ""
                      }
                    ></span>
                    <p>
                      {item.status === "pendente"
                        ? "Em preparação"
                        : "Pedido confirmado"}
                    </p>
                  </div>

                  <div>
                    <span
                      className={
                        item.status === "em transporte" ? "animated" : ""
                      }
                    ></span>
                    <p>Saiu para entrega</p>
                  </div>

                  <div>
                    <span
                      className={
                        item.status === "chegara hoje" ? "animated" : ""
                      }
                    ></span>
                    <p>
                      {" "}
                      {item.status === "chegara hoje"
                        ? "Chegara hoje"
                        : "Esta quase chegando"}
                    </p>
                  </div>

                  <div>
                    <span className={verificarStatus(item.status)}></span>
                    <p>{item.status === "entregue" ? "Entregue" : "Chegou"}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}

        <button
          id="details-btn"
          onClick={() =>
            navigate("/minhas-compras/detalhes", { state: compra.id_compra })
          }
        >
          Ver detalhes da compra
        </button>
      </article>
    );
  }
}

export default TrackCard;
