import {
  formatarMonetario,
  verificarFrete,
} from "../../../../helpers/functions";
import "./ItensDetails.css";

function ItensDetails({ item, index }) {
  return (
    <section id="itensDetailsBody" className="borderRadius boxShadow">
      <h1>Pacote {index}</h1>

      <div>
        <img src={item.imagem} alt={item.nome} />

        <aside>
          <p>{item.nome}</p>

          <div className="colorGray">
            <p className={item.promocao && "line-through"}>
              {formatarMonetario(item.valor)}
            </p>
            {item.promocao && <p>{formatarMonetario(item.promocao)}</p>}
            <span>|</span>
            <p>
              {item.quantidade} unidade{item.quantidade > 1 && "s"}
            </p>
          </div>

          <div className="colorGray small">
            <p>Frete:</p>

            <p className={item.frete <= 0 && "colorGreen"}>
              {verificarFrete(item.frete)}
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
