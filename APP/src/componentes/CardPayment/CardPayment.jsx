import React, { useEffect, useState } from "react";
import "./CardPayment.css";

import Feedback from "../Feedback/Feedback.jsx";

import {
  formatarMonetario,
  formatPaymentCard,
} from "../../helpers/functions.jsx";
import { Trash, Trash2 } from "lucide-react";
import ConfirmAlert from "../ConfirmAlert/ConfirmAlert.jsx";

// Dados simulados de
const CardPayment = ({
  onClose,
  totalAmount,
  userId,
  confirm,
  setParcelas,
  idCartao,
  purchasedTrue,
}) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("http://localhost/tcc/API/GET/paymentcard", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ id: userId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          setCards(data);
          setIsAddingCard(false);
        }
      })
      .catch((error) => console.error("erro", error));
  }, []);

  const [selectedCard, setSelectedCard] = useState(null);
  const [isAddingCard, setIsAddingCard] = useState(cards.length === 0);

  const [installments, setInstallments] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const [newCard, setNewCard] = useState({
    cardholder_name: "",
    complete_number: "",
    expiry: "",
    cvv: "",
    brand: "",
  });

  useEffect(() => {
    idCartao(selectedCard ?? null);
  }, [selectedCard]);

  // Auto-detectar bandeira do cartão
  const detectCardBrand = (number) => {
    const cleanNumber = number.replace(/\D/g, "");

    if (cleanNumber.startsWith("4")) return "visa";
    if (
      cleanNumber.startsWith("5") ||
      (cleanNumber.startsWith("2") && cleanNumber.length >= 2)
    )
      return "mastercard";
    if (cleanNumber.startsWith("3")) return "amex";
    if (cleanNumber.startsWith("6")) return "discover";

    return "";
  };

  // Formatação do número do cartão
  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    const chunks = cleanValue.match(/.{1,4}/g) || [];
    return chunks.join(" ").substr(0, 19); // 4 grupos de 4 dígitos
  };

  const hiddenCardNumber = (value) => {
    const last4 = value.substring(15, 19);

    return `**** **** **** ${last4}`;
  };

  // Formatação da data de validade
  const formatExpiry = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 6);
    }
    return cleanValue;
  };

  const formatResumeExpire = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length >= 3) {
      return cleanValue.substring(0, 2) + "/" + cleanValue.substring(4, 6);
    }
    return cleanValue;
  };

  // Validações
  const validateCard = () => {
    const newErrors = {};

    if (!newCard.cardholder_name.trim()) {
      newErrors.holder = "Nome é obrigatório";
    } else if (newCard.cardholder_name.trim().length < 3) {
      newErrors.holder = "Nome deve ter pelo menos 3 caracteres";
    }

    const cleanNumber = newCard.complete_number.replace(/\D/g, "");
    if (!cleanNumber) {
      newErrors.number = "Número do cartão é obrigatório";
    } else if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      newErrors.number = "Número do cartão inválido";
    }

    if (!newCard.expiry) {
      newErrors.expiry = "Data de validade é obrigatória";
    } else {
      const [month, year] = newCard.expiry.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(month) > 12 || parseInt(month) < 1) {
        newErrors.expiry = "Mês inválido";
      } else if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiry = "Cartão expirado";
      }
    }

    if (!newCard.cvv) {
      newErrors.cvv = "CVV é obrigatório";
    } else if (newCard.cvv.length < 3) {
      newErrors.cvv = "CVV inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === "complete_number") {
      formattedValue = formatCardNumber(value);
      const brand = detectCardBrand(value);
      setNewCard((prev) => ({ ...prev, [field]: formattedValue, brand }));
    } else if (field === "expiry") {
      formattedValue = formatExpiry(value);
      setNewCard((prev) => ({ ...prev, [field]: formattedValue }));
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, "").substring(0, 4);
      setNewCard((prev) => ({ ...prev, [field]: formattedValue }));
    } else if (field === "cardholder_name") {
      formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "").substring(0, 50);
      setNewCard((prev) => ({ ...prev, [field]: formattedValue }));
    } else {
      setNewCard((prev) => ({ ...prev, [field]: formattedValue }));
    }

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const getCardColor = () => {
    const colors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  //CADASTRA O CARTÃO
  const handleAddCard = (e) => {
    e.preventDefault();

    if (!validateCard()) return;

    setIsProcessing(true);

    const cleanNumber = newCard.complete_number.replace(/\D/g, "");
    const card = {
      user_id: userId,
      id: Date.now(),
      cardholder_name: newCard.cardholder_name.trim(),
      complete_number: newCard.complete_number,
      brand: newCard.brand || detectCardBrand(cleanNumber),
      expiry: newCard.expiry,
      cvv: newCard.cvv,
      color: getCardColor(),
    };

    const formData = new FormData();
    for (const key in card) {
      formData.append(key, card[key]);
    }

    fetch("http://localhost/tcc/API/POST/paymentcard", {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);

        if (data.field === "number") {
          const newError = {};
          newError.number = data.status;
          setIsProcessing(false);

          setErrors(newError);
          return;
        }

        if (data !== null) {
          card.id = data;
          setCards((prev) => [...prev, card]);
          setSelectedCard(card.id);
          setIsAddingCard(false);
          setNewCard({
            cardholder_name: "",
            complete_number: "",
            expiry: "",
            cvv: "",
            brand: "",
          });
          setIsProcessing(false);
          setErrors({});
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [confirmAlert, setConfirmAlert] = useState(false);
  function deleteCard(cardId) {
    fetch("http://localhost/tcc/API/POST/DELETE/paymentcard", {
      method: "POST",
      body: new URLSearchParams({ id_card: cardId }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handlePayment = () => {
    setIsProcessing(true);

    if (confirm()) {
      alert(
        `Pagamento de R$ ${totalAmount.toFixed(2)} processado com sucesso!`
      );
      setIsProcessing(false);
      if (onClose) onClose();
    } else {
      setIsProcessing(false);
      setShowPopup(true);

      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    }
  };

  const getBrandIcon = (brand) => {
    const icons = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳",
    };
    return icons[brand] || "💳";
  };

  //VERIFICANDO SE CARDS ESTA VAZIL
  useEffect(() => {
    if (cards.length === 0) {
      setIsAddingCard(true);
    }
  }, [cards]);

  useEffect(() => {
    setParcelas(installments);
  }, [installments]);

  if (purchasedTrue) {
    return (
      <Feedback
        message={"Sua compra foi realizada com sucesso!"}
        type="success"
        link={"/minhas-compras"}
      />
    );
  }

  return (
    <div
      className="card-payment-overlay"
      onClick={(e) =>
        e.target.className === "card-payment-overlay" && onClose && onClose()
      }
    >
      <div className="card-payment-container">
        <div className="card-payment-header">
          <h2>Pagamento com Cartão</h2>
          {onClose && (
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Fechar"
            >
              ✕
            </button>
          )}
        </div>

        <div className="card-payment-content">
          {isAddingCard ? (
            <div className="add-card-section">
              <div className="card-preview">
                <div
                  className="preview-card"
                  style={{
                    background: newCard.brand ? getCardColor() : "#e2e8f0",
                  }}
                >
                  <div className="card-brand">
                    {getBrandIcon(newCard.brand)}
                    <span>{newCard.brand.toUpperCase()}</span>
                  </div>
                  <div className="card-number">
                    {newCard.complete_number || "**** **** **** ****"}
                  </div>
                  <div className="card-details">
                    <div className="card-holder">
                      {newCard.cardholder_name || "NOME DO TITULAR"}
                    </div>
                    <div className="card-expiry">
                      {formatResumeExpire(newCard.expiry) || "MM/AA"}
                    </div>
                  </div>
                </div>
              </div>

              <form className="card-form" onSubmit={handleAddCard}>
                <div className="form-group">
                  <label>Nome impresso no cartão</label>
                  <input
                    type="text"
                    placeholder="João Silva"
                    value={newCard.cardholder_name}
                    onChange={(e) =>
                      handleInputChange("cardholder_name", e.target.value)
                    }
                    className={errors.holder ? "error" : ""}
                    disabled={isProcessing}
                  />
                  {errors.holder && (
                    <span className="error-message">{errors.holder}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Número do cartão</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={newCard.complete_number}
                    onChange={(e) =>
                      handleInputChange("complete_number", e.target.value)
                    }
                    className={errors.number ? "error" : ""}
                    disabled={isProcessing}
                    maxLength={19}
                  />
                  {errors.number && (
                    <span className="error-message">{errors.number}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Validade</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={newCard.expiry}
                      onChange={(e) =>
                        handleInputChange("expiry", e.target.value)
                      }
                      className={errors.expiry ? "error" : ""}
                      disabled={isProcessing}
                      maxLength={7}
                    />
                    {errors.expiry && (
                      <span className="error-message">{errors.expiry}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={newCard.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      className={errors.cvv ? "error" : ""}
                      disabled={isProcessing}
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <span className="error-message">{errors.cvv}</span>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  {cards.length > 0 && (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => setIsAddingCard(false)}
                      disabled={isProcessing}
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Salvando..." : "Salvar cartão"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {cards.length > 0 && (
                <div className="saved-cards-section">
                  <h3>Escolha um cartão</h3>
                  {/* <p>Atenção não cadastre um cartão real</p> */}
                  <div className="cards-list">
                    {cards.map((card, key) => (
                      <label key={key} className="card-option">
                        <input
                          type="radio"
                          name="selectedCard"
                          value={card.id}
                          checked={selectedCard === card.id}
                          onChange={() => setSelectedCard(card.id)}
                        />
                        <div className="card-info">
                          <div className="card-meta">
                            <span className="card-holder">
                              {card.cardholder_name}
                            </span>
                            <span className="card-expiry">{card.brand}</span>
                            <span className="card-holder">
                              {card.hidden_number
                                ? card.hidden_number
                                : hiddenCardNumber(card.complete_number)}
                            </span>
                            <span className="card-expiry">
                              Válido até{" "}
                              {formatPaymentCard(
                                card.expiry ||
                                  card.exp_month + "/" + card.exp_year
                              )}
                            </span>
                          </div>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setConfirmAlert(true);
                            }}
                            className="deleteCardBtn"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        {confirmAlert && (
                          <ConfirmAlert
                            message={"Você deseja mesmmo deletar este cartão?"}
                            onClose={() => {
                              setConfirmAlert(false);
                            }}
                            onConfirm={() => {
                              deleteCard(card.id);

                              setCards((prev) =>
                                prev.filter((item) => item.id !== card.id)
                              );

                              setConfirmAlert(false);
                            }}
                          />
                        )}
                      </label>
                    ))}
                  </div>

                  <button
                    className="add-card-button"
                    onClick={() => setIsAddingCard(true)}
                  >
                    + Adicionar novo cartão
                  </button>
                </div>
              )}
            </>
          )}

          {selectedCard && !isAddingCard && (
            <div className="payment-section">
              <div className="installments-section">
                <h3>Parcelamento</h3>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value))}
                  className="installments-select"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                    const installmentValue = totalAmount / num;
                    const hasInterest = num > 6;
                    const finalValue = hasInterest
                      ? installmentValue * 1.02
                      : installmentValue;

                    return (
                      <option key={num} value={num}>
                        {num}x de {formatarMonetario(finalValue)}{" "}
                        {hasInterest ? "com juros" : "sem juros"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="payment-summary">
                <div className="summary-row">
                  <span>Total:</span>
                  <span className="total-amount">
                    {formatarMonetario(totalAmount)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Parcelamento:</span>
                  <span>
                    {installments}x de{" "}
                    {formatarMonetario(totalAmount / installments)}
                  </span>
                </div>
              </div>

              <button
                className="pay-button"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processando..." : `Finalizar pagamento`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPayment;
