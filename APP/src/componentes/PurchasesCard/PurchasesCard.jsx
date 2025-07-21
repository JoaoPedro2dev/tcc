import { useNavigate } from "react-router-dom";
import "./PurchasesCard.css";

import { verificarPagamento, formatarData } from "../../helpers/functions.jsx";
import { useState } from "react";
import CancellationForm from "../../pages/MyPurchases/CancellationForm/CancellationForm.jsx";

function PurchasesCard({ item }) {
  function verificarStatus(
    status,
    dataEntrega,
    prazo,
    novoPrazo,
    metodoPagamento,
    reembolso
  ) {
    let tag;

    switch (status) {
      case "Entregue":
      case "Chegou":
        tag = <h2>Chegou em {formatarData(dataEntrega)}</h2>;
        break;

      case "A caminho":
      case "Em preparação":
        tag = <h2>Chegara até {formatarData(prazo)}</h2>;
        break;

      case "Cancelado por você":
        tag = verificarPagamento(metodoPagamento, reembolso);
        break;

      case "Cancelado pelo vendedor":
        tag = verificarPagamento(metodoPagamento, reembolso);
        break;

      case "Cancelado pela DNV WEAR":
        tag = (
          <p className="colorGray">
            Pedido cancelado. O tempo para efetuar o pagamento esgotou.
          </p>
        );
        break;

      case "Não recebido":
        if (!novoPrazo) {
          tag = (
            <p className="colorGray">
              Ninguém recebeu seu produto. Estamos esperando o vendedor efetuar
              um novo prazo.
            </p>
          );
        } else {
          tag = <h2>Chegara no novo prazo, dia {formatarData(novoPrazo)}</h2>;
        }
        break;

      default:
        tag = <p>Status do produto não reconhecido</p>;
    }

    return tag;
  }

  const navigate = useNavigate();

  const arrayStatus = [
    "Entregue",
    "Cancelado por você",
    "Cancelado pelo vendedor",
    "Cancelado pela DNV WEAR",
  ];

  const [typeCancellation, setTypeCancellation] = useState("full");

  const [openCancellationForm, setOpenCancellationForm] = useState(false);
  function cancellationForm() {
    !openCancellationForm
      ? setOpenCancellationForm(true)
      : setOpenCancellationForm(false);
  }

  return (
    <article id="purcahsesCardBody">
      <h1>{formatarData(item.dataCompra)}</h1>

      {item.produtos.map((iten) => (
        <section key={iten.id}>
          <img
            src={iten.imagem}
            alt={iten.nome}
            onClick={() => {
              arrayStatus.includes(iten.status)
                ? navigate("/minhas-compras/status")
                : navigate("/minhas-compras/rastrear");
            }}
          />

          <div>
            <strong
              className={
                iten.status !== "Entregue" &&
                iten.status !== "A caminho" &&
                iten.status !== "Chegou" &&
                iten.status !== "Em preparação"
                  ? "red"
                  : "green"
              }
            >
              {iten.status}
            </strong>

            <p>{iten.nome}</p>

            {verificarStatus(
              iten.status,
              iten.dataEntrega,
              iten.prazo,
              iten.novoPrazo,
              iten.metodoPagamento,
              iten.reembolso
            )}

            {iten.recebido && <p>Recebido por {iten.recebido}</p>}

            <p>
              {iten.qnt} produto{iten.qnt > 1 ? "s" : ""}
            </p>

            {(iten.status === "A caminho" ||
              iten.status === "Em preparação" ||
              iten.status === "Não recebido") && (
              <button
                onClick={() => {
                  cancellationForm();
                  setTypeCancellation("produto");
                }}
              >
                CANCELAR
              </button>
            )}
          </div>
        </section>
      ))}

      {item.produtos.some(
        (p) => p.status === "A caminho" || p.status === "Não recebido"
      ) && (
        <section id="deliveryOptions">
          <button
            onClick={() => {
              navigate("/minhas-compras/rastrear");
            }}
          >
            RASTREAR
          </button>

          {item.produtos.length > 1 && (
            <button
              onClick={() => {
                cancellationForm();
                setTypeCancellation("full");
              }}
            >
              CANCELAR
            </button>
          )}
        </section>
      )}

      {openCancellationForm && (
        <CancellationForm
          funcao={() => {
            cancellationForm();
          }}
          tipo={typeCancellation}
        />
      )}
    </article>
  );
}

export default PurchasesCard;
