import {
  formatarMonetario,
  verificarFrete,
} from "../../../../helpers/functions";
import "./ItensDetails.css";

function ItensDetails({ item, index }) {
  const valorPromocao = Number(item.preco_promocao);
  const frete = Number(item.frete);

  return (
    <section id="itensDetailsBody" className="borderRadius boxShadow">
      <h1>Pacote {index}</h1>

      <div>
        <img src={item.produc_image} alt={item.product_name} />

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
        </aside>
      </div>
    </section>
  );
}

export default ItensDetails;
