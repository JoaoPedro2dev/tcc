import {
  formatarData,
  formatarMonetario,
  verificarFrete,
} from "../../../../helpers/functions";
import "./PaymentCard.css";
// import { Wallet } from "lucide-react";

function PaymentCard({ compra }) {
  const produtos = [...compra.itens];

  const totalCompra = produtos.reduce((soma, item) => {
    return soma + Number(item.preco_unitario) * Number(item.quantidade);
  }, 0);

  console.log("total compra", totalCompra);

  const totalPago = produtos.reduce((soma, item) => {
    return (
      soma +
      Number(item.preco_unitario) * Number(item.quantidade) +
      Number(item.frete) -
      Number(item.preco_promocao)
    );
  }, 0);

  // const qntItens = somarTotalArray(produtos, produtos.quantidade);
  const qntItens = produtos.reduce((soma, item) => {
    return soma + Number(item.quantidade);
  }, 0);

  // const totalFrete = somarTotalArray(produtos, produtos.frete);

  const totalFrete = produtos.reduce((soma, item) => {
    return soma + Number(item.frete);
  }, 0);

  const totalDesconto = produtos.reduce((soma, item) => {
    return soma + Number(item.preco_promocao);
  }, 0);

  const subtotal = produtos.reduce((soma, item) => {
    return (
      soma +
      Number(item.preco_unitario) * Number(item.quantidade) +
      Number(item.frete)
    );
  }, 0);

  return (
    <section id="pagamentoCardBody" className="boxShadow borderRadius">
      <div>
        <p className="gray">{formatarData(compra.data_compra)}</p>
        <p className="gray">{compra.id_string}</p>
      </div>

      <hr />

      <div>
        <p>
          Valor total da compra ({qntItens} ite
          {qntItens > 1 ? "ns" : "m"}) {formatarMonetario(Number(totalCompra))}
        </p>

        <p className={totalFrete == 0 ? "colorGreen" : ""}>
          Frete {verificarFrete(totalFrete)}
        </p>

        {totalDesconto > 0 && (
          <p className="colorGreen">
            Desconto {formatarMonetario(totalDesconto)}
          </p>
        )}
      </div>

      <hr />

      <div className="colorGray">
        <p>Subtotal</p>
        <p>{formatarMonetario(subtotal)}</p>
      </div>

      <div>
        <p>Total pago</p>
        <p>{formatarMonetario(totalPago)}</p>
      </div>
    </section>
  );
}

export default PaymentCard;
