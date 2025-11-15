import {
  formatarData,
  monetaryFormatting,
  verificarFrete,
} from "../../../../helpers/functions";
import "./PaymentCard.css";
// import { Wallet } from "lucide-react";

function PaymentCard({ compra }) {
  const produtos = compra.itens;

  const totalProdutoDescontos = produtos.reduce(
    (soma, item) =>
      soma +
      (item.preco_promocao > 0 ? item.preco_promocao : item.preco_unitario) *
        item.quantidade,
    0
  );

  const totalProduto = produtos.reduce(
    (soma, item) => soma + item.preco_unitario * item.quantidade,
    0
  );

  const totalFrete = produtos.reduce(
    (soma, item) => soma + Number(item.frete),
    0
  );

  const totalPago = totalProdutoDescontos + totalFrete;

  const reembolso = produtos.reduce((soma, item) => {
    if (item.status == "cancelado") {
      const price =
        Number(item.preco_promocao) > 0
          ? Number(item.preco_promocao)
          : Number(item.preco_unitario);

      return soma + (price * Number(item.quantidade) + Number(item.frete));
    }

    return soma;
  }, 0);

  console.log(totalPago);

  const qntItens = produtos.reduce((soma, item) => {
    return soma + Number(item.quantidade);
  }, 0);

  const subtotalDescontos = totalProdutoDescontos + totalFrete;
  const subtotal = totalProduto + totalFrete;

  return (
    <section id="pagamentoCardBody" className=" borderRadius">
      <div>
        <p className="gray">{formatarData(compra.data_compra)}</p>
        <p className="gray">{compra.id_string ?? "#" + compra.id_compra}</p>
      </div>

      <hr />

      <div>
        <p className="payment-price-content">
          Valor total da compra ({qntItens} ite
          {qntItens > 1 ? "ns" : "m"}){" "}
          {totalProdutoDescontos > 0 &&
          totalProdutoDescontos !== totalProduto ? (
            <>
              de
              <span className="colorGray">
                {monetaryFormatting(totalProduto)}
              </span>
              por
              <span>{monetaryFormatting(totalProdutoDescontos)}</span>
            </>
          ) : (
            monetaryFormatting(totalProduto)
          )}
        </p>

        <p className={totalFrete == 0 ? "colorGreen" : ""}>
          Frete {verificarFrete(totalFrete)}
        </p>

        {totalProdutoDescontos > 0 &&
          totalProdutoDescontos !== totalProduto && (
            <p className="colorGreen">
              Você economizou{" "}
              {monetaryFormatting(totalProduto - totalProdutoDescontos)}{" "}
              escolhendo por ofertas!
            </p>
          )}
      </div>

      <hr />

      <div className="colorGray">
        <p>Subtotal</p>
        {subtotalDescontos > 0 && totalProdutoDescontos !== totalProduto ? (
          <div className="promotion-subtotal">
            <p className="line-through">{monetaryFormatting(subtotal)}</p>
            <p>{monetaryFormatting(subtotalDescontos)}</p>
          </div>
        ) : (
          <p>{monetaryFormatting(subtotal)}</p>
        )}
      </div>

      <div>
        <p>Total pago</p>
        <p>{monetaryFormatting(totalPago)}</p>
      </div>

      {reembolso != 0 && (
        <div>
          <p>Reembolso por produtos cancelados</p>
          <p>{monetaryFormatting(reembolso)}</p>
        </div>
      )}
    </section>
  );
}

export default PaymentCard;
