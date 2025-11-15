import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";

export function formatarData(data) {
  if (!data) return ""; // evita erro se vier null/undefined

  let dateObj;

  // Se já for um objeto Date
  if (data instanceof Date) {
    dateObj = data;
  }
  // Se for string no formato "YYYY-MM-DD HH:mm:ss" ou "YYYY-MM-DD"
  else if (typeof data === "string" && /^\d{4}-\d{2}-\d{2}/.test(data)) {
    const soData = data.split(" ")[0]; // pega só "YYYY-MM-DD"
    const [ano, mes, dia] = soData.split("-");
    dateObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
  }
  // Se for string no formato brasileiro "DD/MM/YYYY"
  else if (typeof data === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    const [dia, mes, ano] = data.split("/");
    dateObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
  }
  // fallback: tenta criar Date direto
  else {
    dateObj = new Date(data);
  }

  // Se a data não for válida
  if (isNaN(dateObj.getTime())) {
    console.warn("Data inválida recebida:", data);
    return "";
  }

  return dateObj.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDefaultDate(data) {
  const date = data.split(" ");
  const [ano, mes, dia] = date[0].split("-");
  return `${dia}/${mes}/${ano}`;
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

export function shootCartCounter(number) {
  window.dispatchEvent(
    new CustomEvent("countUpdate", {
      detail: number ?? 1,
    })
  );
}

export function formatPhone(value) {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  const limitedNumbers = numbers.slice(0, 11);

  // Aplica a formatação
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(
      2,
      7
    )}-${limitedNumbers.slice(7)}`;
  }
}

export function formatCPF(value) {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  const limitedNumbers = numbers.slice(0, 11);

  // Aplica a formatação
  if (limitedNumbers.length <= 3) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 6) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
  } else if (limitedNumbers.length <= 9) {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(
      3,
      6
    )}.${limitedNumbers.slice(6)}`;
  } else {
    return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(
      3,
      6
    )}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
  }
}

export function formatCNPJ(value) {
  if (!value) return "";

  // Remove tudo que não for número
  const cnpj = value.replace(/\D/g, "");

  // Aplica a máscara
  return cnpj
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18); // Garante o tamanho máximo
}

export function formatPaymentCard(value) {
  let [mes, ano] = value.split("/");

  mes = mes.padStart(2, "0");
  ano = ano.slice(-2);

  return `${mes}/${ano}`;
}

export function useSessionVerify() {
  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) navigate("/login");
  }, [user, navigate]);
}

export function GetMe() {
  const { setUser } = useUser();

  fetch("http://localhost/tcc/API/GET/me")
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        console.log("getMe", data);
        setUser(data.user);
      } else {
        console.log("getMe", data);

        console.log("error");
      }
    })
    .catch((error) => console.error("erro", error));
}

export function calcStockTotal(item) {
  return item.itenStock?.reduce((total, cor) => {
    const corTotal = cor.tamanhos.reduce(
      (sum, tamanho) => sum + tamanho.qnt,
      0
    );
    return total + corTotal;
  }, 0);
}

export function getStatusClass(status) {
  switch (status) {
    case "confirmado":
      return "confirmed";
    case "cancelado":
      return "cancelled";
    case "pendente":
      return "pending";
    case "entregue":
      return "entregue";
    case "em transporte":
      return "em transporte";
    default:
      return "";
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case "confirmado":
      return "Confirmado";
    case "cancelado":
      return "Cancelado";
    case "pendente":
      return "Pendente";
    case "em transporte":
      return "Em Transporte";
    case "chegara hoje":
      return "Chegará Hoje";
    case "chegou":
      return "Chegou";
    case "entregue":
      return "Entregue";
    default:
      return "Desconhecido";
  }
}

export function calcularPorcentagem(parte, total) {
  if (total === 0) {
    return 0; // evita divisão por zero
  }

  const porcentagem = (parte / total) * 100;
  return porcentagem.toFixed(2) + "%";
}
