import { formatarData, formatarMonetario } from "../../../../helpers/functions";
import "./PaymentDetails.css";
import { CircleAlert, CreditCard, SquareKanban, Wallet } from "lucide-react";

function PaymentDetails() {
  const pagamnetoJSON = {
    id: 1,
    id_string: "#092103NJDJFSDNCA",
    data: "2025-01-01",
    pagamentoAprovado: true,
    tipo: "Cartão",
    identificação: "Identificação pix",
    avista: true,
    parcelas: 0,
    valor: 62,
    juros: 10,
  };

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
      {verificarMetodoPagamento(
        pagamnetoJSON.tipo,
        pagamnetoJSON.identificação
      )}

      <aside>
        <p className="colorGray">
          {formatarData(pagamnetoJSON.data)} | {pagamnetoJSON.id_string}
        </p>

        <p>
          {pagamnetoJSON.avista
            ? `À vista ${formatarMonetario(pagamnetoJSON.valor)}`
            : `Parcelado ${pagamnetoJSON.parcelas} x ${formatarMonetario(
                pagamnetoJSON.valor
              )}`}
        </p>

        <p
          className={
            pagamnetoJSON.pagamentoAprovado ? "colorGreen" : "colorRed"
          }
        >
          {pagamnetoJSON.pagamentoAprovado
            ? "Pagamento aprovado"
            : "Pagamento não aprovado"}
        </p>
      </aside>
    </div>
  );
}

export default PaymentDetails;
