import { formatarData, formatarMonetario } from "../../../../helpers/functions";
import "./PaymentDetails.css";
import { CircleAlert, CreditCard, SquareKanban, Wallet } from "lucide-react";

function PaymentDetails(compra) {
  console.log("compra detalhes", compra);
  function verificarMetodoPagamento(metodo, identificacao) {
    switch (metodo) {
      case "PIX":
        return (
          <div>
            <span>
              <Wallet />
            </span>

            <p className="colorGray">PIX {identificacao}</p>
          </div>
        );

      case "Cartão":
        return (
          <div>
            <span>
              <CreditCard />
            </span>

            <p className="colorGray">Cartão {identificacao}</p>
          </div>
        );

      case "Boleto":
        return (
          <div>
            <span>
              <SquareKanban />
            </span>

            <p className="colorGray">Boleto {identificacao}</p>
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
    <div id="paymentDetailsBody" className="borderRadius boxShadow">
      {verificarMetodoPagamento(compra.forma_pagamento, compra.identificação)}

      <aside>
        <p className="colorGray">
          {formatarData(compra.data_compra)} | {compra.id_string}
        </p>

        <p>
          {compra.avista
            ? `À vista ${formatarMonetario(compra.valor)}`
            : `Parcelado ${compra.parcelas} x ${formatarMonetario(
                compra.valor
              )}`}
        </p>

        <p className={compra.pagamentoAprovado ? "colorGreen" : "colorRed"}>
          {compra.pagamentoAprovado
            ? "Pagamento aprovado"
            : "Pagamento não aprovado"}
        </p>
      </aside>
    </div>
  );
}

export default PaymentDetails;
