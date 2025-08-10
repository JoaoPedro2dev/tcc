export function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  const dataCorrigida = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return new Date(dataCorrigida).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatarMonetario(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function verificarPagamento(metodoPagamento, reembolso) {
  switch (metodoPagamento) {
    case "PIX":
      return reembolso ? (
        <p className="gray">
          Esta compra foi cancelada. O dinheiro foi devolvido a conta que
          efetuou o pagamento via PIX.
        </p>
      ) : (
        <p className="gray">
          Esta compra foi cancelada. O dinheiro sera devolvido a conta que
          efetuou o pagamento via PIX. Isso pode levar alguns minutos
        </p>
      );

    case "Cartão":
      return (
        <p className="gray">
          Esta compra foi cancelada. O valor não sera descontado de sua fatura,
          ou caso já tenha pago, sera retornado como crédito em seu cartão. isso
          pode levar até X dias.
        </p>
      );

    case "Boleto":
      return reembolso ? (
        <p className="gray">
          Esta compra foi cancelada. O reembolso foi efetuado a conta a qual
          efetuou o pagamento.
        </p>
      ) : (
        <p className="gray">
          Esta compra foi cancelada. O processo para reembolso foi iniciado,
          pode levar até 7 dias.
        </p>
      );

    default:
      return <p>Método de pagamento não reconhecido</p>;
  }
}

export function verificarFrete(frete) {
  return frete <= 0 ? "Grátis" : formatarMonetario(frete);
}

export function monetaryFormatting(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function brDateFormatting(data) {
  const date = new Date(data);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function calculatinDelivery(deliveryTime) {
  const date = new Date();
  date.setDate(date.getDate() + deliveryTime);
  return brDateFormatting(date);
}
