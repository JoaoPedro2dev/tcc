import { useNavigate } from "react-router-dom";
import {
  formatarMonetario,
  verificarFrete,
} from "../../../../helpers/functions";
import "./ItensDetails.css";

function ItensDetails({ item, index }) {
  const navigate = useNavigate();

  const valorPromocao = Number(item.preco_promocao);
  const frete = Number(item.frete);

  return (
    <section
      id="itensDetailsBody"
      className="borderRadius"
      style={index != 1 ? { marginTop: 20 } : {}}
    >
      <h1>Pacote {index}</h1>

      <div>
        <img
          src={item.produc_image}
          alt={item.product_name}
          onClick={() => {
            navigate("/venda?", { state: item.id_produto });
          }}
        />

        <aside>
          <p>{item.product_name}</p>

          <div className="colorGray">
            <p className={valorPromocao > 0 ? "line-through" : ""}>
              {formatarMonetario(item.preco_unitario)}
            </p>
            {valorPromocao > 0 && <p>{formatarMonetario(valorPromocao)}</p>}
            <span>|</span>
            <p>
              {item.quantidade} unidade{item.quantidade > 1 && "s"}
            </p>
          </div>

          <div className="colorGray small">
            <p>Frete:</p>

            <p className={frete <= 0 ? "colorGreen" : ""}>
              {verificarFrete(frete)}
            </p>
          </div>

          <div className="colorGray">
            <p>Cor: {item.cor}</p>
            <p>Tamanho: {item.tamanho}</p>
          </div>

          {item.status === "cancelado" && (
            <div>
              <p>Cancelado, o reembolso foi providenciado</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default ItensDetails;
