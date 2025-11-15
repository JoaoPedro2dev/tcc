import {
  formatarData,
  formatarMonetario,
  monetaryFormatting,
} from "../../../../helpers/functions";
import "./PaymentDetails.css";
import { CircleAlert, CreditCard, SquareKanban, Wallet } from "lucide-react";

function PaymentDetails({ compra }) {
  console.log("compra detalhes", compra);

  function verificarMetodoPagamento(metodo, identificacao) {
    switch (metodo) {
      case "pix":
        return (
          <div>
            <span>
              <Wallet />
            </span>

            <p className="colorGray">PIX {identificacao}</p>
          </div>
        );

      case "cartao":
        return (
          <div>
            <span>
              <CreditCard />
            </span>

            <p className="colorGray">Cartão {identificacao}</p>
          </div>
        );

      default:
        return (
          <div>
            <span>
              <CircleAlert />
            </span>

            <p className="colorGray">Algo deu errado!</p>
          </div>
        );
    }
  }

  return (
    <div id="paymentDetailsBody" className="borderRadius">
      {verificarMetodoPagamento(compra.forma_pagamento, compra.identificação)}

      <aside>
        <p className="colorGray">
          {formatarData(compra.data_compra)} |{" "}
          {compra.id_string ?? "#" + compra.id_compra}
        </p>

        <p className="price-content">
          {compra.parcelas <= 1 ? (
            `À vista ${formatarMonetario(compra.preco_total)}`
          ) : (
            <>
              <span>
                Parcelado {compra.parcelas} X{" "}
                {formatarMonetario(compra.valor_parcelas)}
              </span>
              <span>Total: {monetaryFormatting(compra.preco_total)}</span>
            </>
          )}
        </p>

        {/* <p className={compra.pagamentoAprovado ? "colorGreen" : "colorRed"}>
          {compra.pagamentoAprovado
            ? "Pagamento aprovado"
            : "Pagamento não aprovado"}
        </p> */}
      </aside>
    </div>
  );
}

export default PaymentDetails;
