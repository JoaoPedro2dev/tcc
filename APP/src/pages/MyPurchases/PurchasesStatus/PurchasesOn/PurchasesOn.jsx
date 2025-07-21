import { useNavigate } from "react-router-dom";
import { formatarData } from "../../../../helpers/functions.jsx";
import { ScrollText } from "lucide-react";

function PurchasesOn({ item }) {
  const navigate = useNavigate();
  return (
    <div>
      <p className="green">{item.status}</p>
      <h1>Chegou no dia {formatarData(item.dataEntrega)}</h1>
      <p className="gray">
        Entregamos seu pacote as {item.horarioEntrega}h em{" "}
        <address>{item.endereco}</address>
      </p>
      <p>
        Recebido por:{" "}
        <span className="colorGray">
          {item.recebidoPor} - {item.recebidoDesc}
        </span>
      </p>

      <div id="nfBox">
        <h2>Informações da compra</h2>

        <hr />

        <div>
          <span>
            <ScrollText />
          </span>

          <div>
            <p>{item.nome}</p>
            <p className="gray">
              {item.dataEmissaoNF
                ? `Adicionada em ${formatarData(item.dataEmissaoNF)}`
                : "Aguardando a NF-e por parte do vendedor"}
            </p>
          </div>
        </div>

        {item.dataEmissaoNF && <a href={item.linkNF}>Baixar NF-e</a>}
      </div>

      <button
        id="details-btn"
        onClick={() => navigate("/minhas-compras/detalhes")}
      >
        VER DETALHES
      </button>
    </div>
  );
}

export default PurchasesOn;
