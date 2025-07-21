import { useNavigate } from "react-router-dom";
import {
  formatarData,
  verificarPagamento,
} from "../../../../helpers/functions.jsx";

function CanceledPurchases({ item }) {
  const navigate = useNavigate();
  return (
    <div>
      <p className="red">{item.status}</p>
      <h1>Cancelado no dia {formatarData(item.dataCancelamento)}</h1>

      <p>Motivo do cancelamento</p>
      <p>
        <span className="gray">{item.motivoCancelamento}</span>
      </p>

      <p>
        {item.reembolso
          ? "Seu reembolso foi efetuado"
          : "Estamos providenciando seu reembolso"}{" "}
        <br />{" "}
      </p>

      {verificarPagamento(item.metodoPagamento, item.reembolso)}

      <button
        id="details-btn"
        onClick={() => navigate("/minhas-compras/detalhes")}
      >
        VER DETALHES
      </button>
    </div>
  );
}

export default CanceledPurchases;
