import { useEffect, useState } from "react";
import "./CheckoutPage.css";
import {
  CreditCard,
  MapPin,
  Phone,
  Package,
  Calendar,
  Store,
  Edit3,
  CheckCircle2,
  Truck,
  Smartphone,
  FileText,
  ShoppingCart,
  MapPinPlusInside,
} from "lucide-react";
// import Header from "../../componentes/Header/Header";
import Loading from "../../componentes/Loading/Loading.jsx";
import BackButton from "../../componentes/BackButton/BackButton";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  calculatinDelivery,
  formatPhone,
  monetaryFormatting,
} from "../../helpers/functions.jsx";
import PixPayment from "../../componentes/PixPayment/PixPayment.jsx";
import CardPayment from "../../componentes/CardPayment/CardPayment.jsx";
import { useSales } from "../../context/SalesContext.jsx";

function CheckoutPage() {
  // useSessionVerify();

  const { user } = useUser();

  const navigate = new useNavigate();

  const [produtos, setProdutos] = useState([]);

  const { sales } = useSales();

  const ids = sales.map((item) => item.id_item);
  const query = encodeURIComponent(JSON.stringify(ids));

  useEffect(() => {
    fetch(`http://localhost/tcc/API/GET?id=${query}`)
      .then((r) => r.json())
      .then((data) => {
        // console.clear();
        console.log("itens da API", data);
        if (data) {
          const newProdutos = data.map((item) => {
            const saleItem = sales.find((s) => s.id_item === item.id);

            return {
              ...item,
              quantidade: saleItem ? saleItem.quantidade_item : 0,
            };
          });

          setProdutos(newProdutos);
        }
      });
  }, []);

  const [payment, setPayment] = useState("cartao");
  const [isProcessing, setIsProcessing] = useState(false);

  const [pixContainer, setPixContainer] = useState(false);
  const [cardContainer, setCardContainer] = useState(false);

  const [parcelas, setParcelas] = useState(0);
  const [idCartao, setIdCartao] = useState(null);

  const [purchasedTrue, setPurchasedTrue] = useState(false);

  const subtotal = produtos.reduce((acc, produto) => {
    return (
      acc +
      (produto.promotionPrice ? produto.promotionPrice : produto.price) *
        produto.quantidade
    );
  }, 0);

  const totalFrete = produtos.reduce((acc, produto) => {
    return acc + produto.shippingCost;
  }, 0);

  const total = subtotal + totalFrete;

  const handleSubmit = async () => {
    // e.preventDefault();
    setIsProcessing(true);

    switch (payment) {
      case "pix":
        setPixContainer(true);
        break;
      case "cartao":
        setCardContainer(true);
        break;
      default:
        return;
    }
  };

  function ConfirmPayment() {
    const form = new FormData();

    const idLojas = [...new Set(produtos.map((produto) => produto.sellerId))];
    const totalFrete = produtos.reduce(
      (soma, produto) => soma + Number(produto.shippingCost || 0),
      0
    );

    form.append("id_cliente", user.id);
    form.append("cpf_cliente", user.cpf);
    form.append("id_loja", JSON.stringify(idLojas));
    form.append("id_cartao", idCartao ?? null);
    form.append("endereco_entrega", user.address);
    form.append("forma_pagamento", payment);
    form.append("parcelas", parcelas);
    form.append("valor_parcelas", idCartao ? total / parcelas : null);
    form.append("frete_total", totalFrete);
    form.append("itens", JSON.stringify(produtos));

    fetch("http://localhost/tcc/API/POST/compras", {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((data) => {
        console.clear();
        console.log("Compra finalizada", data);

        if (data.success === true) {
          setIsProcessing(false);
          setPurchasedTrue(true);
        } else {
          setIsProcessing(false);
          return false;
        }
      });
    // .catch((error) => {
    //   setIsProcessing(false);
    //   console.error(error);
    // });
  }

  const paymentMethods = [
    {
      id: "cartao",
      label: "Cartão de Crédito",
      icon: CreditCard,
      description: "Visa, Mastercard, Elo",
    },
    {
      id: "pix",
      label: "PIX",
      icon: Smartphone,
      description: "Aprovação instantânea",
    },
  ];

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="checkout-page">
      {cardContainer && (
        <CardPayment
          onClose={() => {
            setCardContainer(false);
            setIsProcessing(false);
          }}
          totalAmount={total}
          userId={user.id}
          confirm={ConfirmPayment}
          parcelas={parcelas}
          setParcelas={setParcelas}
          idCartao={setIdCartao}
          purchasedTrue={purchasedTrue}
        />
      )}

      {pixContainer && (
        <PixPayment
          confirm={ConfirmPayment}
          onClose={() => {
            setPixContainer(false);
            setIsProcessing(false);
          }}
          total={total}
          purchasedTrue={purchasedTrue}
        />
      )}

      <div className="container">
        <BackButton />

        <div className="header">
          <h1>Finalizar Compra</h1>
          <p>Confirme seus dados e finalize seu pedido</p>
        </div>

        <div className="checkout-grid">
          {/* Produtos - Ocupa 2 colunas no desktop */}
          <div>
            <div className="card">
              <div className="card-header">
                <div className="card-header-content">
                  <div className="card-icon blue">
                    <ShoppingCart />
                  </div>
                  <h2 className="card-title">
                    Sua Compra ({produtos.length}{" "}
                    {produtos.length === 1 ? "item" : "itens"})
                  </h2>
                </div>
              </div>

              <div className="card-content">
                <div className="cart-items">
                  {produtos.map((item, key) => (
                    <div key={key} className="cart-item">
                      <div className="cart-item-image-container">
                        <img
                          src={JSON.parse(item.images)[0]}
                          alt={item.productName}
                          className="cart-item-image"
                        />
                        <div className="cart-item-quantity">
                          {item.quantidade}
                        </div>
                      </div>

                      <div className="cart-item-info">
                        <h3 className="cart-item-name">{item.productName}</h3>

                        <div className="cart-item-details">
                          <div className="cart-item-detail">
                            <Store />
                            <span>{item.store_name}</span>
                          </div>

                          <div className="cart-item-detail">
                            <Calendar />
                            <span>
                              Entrega: {calculatinDelivery(item.deliveryTime)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="cart-item-price">
                        <div className="cart-item-total">
                          {monetaryFormatting(
                            (item.promotionPrice
                              ? item.promotionPrice
                              : item.price) * item.quantidade
                          )}
                        </div>
                        <div className="cart-item-unit">
                          {item.promotionPrice ? (
                            <div>
                              <span className="font-medium   weigth-500">
                                {monetaryFormatting(item.promotionPrice)}
                              </span>
                              <span className="line-through">
                                {monetaryFormatting(item.price)}
                              </span>
                            </div>
                          ) : (
                            "Unidade: " + monetaryFormatting(item.price)
                          )}
                        </div>
                        <div className="cart-item-unit">
                          Frete:{" "}
                          {item.shippingCost === 0 ? (
                            <span className="colorGreen">Grátis</span>
                          ) : (
                            monetaryFormatting(item.shippingCost)
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo do pedido */}
              <div className="cart-summary">
                <div className="summary-items">
                  <div className="summary-item">
                    <span>Subtotal</span>
                    <span>{monetaryFormatting(subtotal)}</span>
                  </div>

                  <div className="summary-item shipping">
                    <div className="label">
                      <Truck />
                      <span>Frete</span>
                    </div>
                    {totalFrete === 0 ? (
                      <span className="colorGreen">Grátis</span>
                    ) : (
                      <span>{monetaryFormatting(totalFrete)}</span>
                    )}
                  </div>

                  <div className="summary-total">
                    <span className="label">Total</span>
                    <span className="value">{monetaryFormatting(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Endereço + Pagamento */}
          <div className="sidebar">
            {/* Endereço de Entrega */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-content">
                  <div className="card-icon green">
                    <MapPin />
                  </div>
                  <h2 className="card-title">Endereço de Entrega</h2>
                </div>
              </div>

              {user.cep ? (
                <div className="card-content">
                  <div className="address-info">
                    <div className="address-name">{user?.name}</div>

                    {user?.address && (
                      <div className="address-details">
                        <MapPin size={18} />
                        <p>{user?.address}</p>
                      </div>
                    )}

                    {user?.telefone && (
                      <div className="address-phone">
                        <Phone />
                        <span>{formatPhone(user.telefone)}</span>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn-change-address"
                    onClick={() => {
                      navigate("/cadastrarcep");
                    }}
                  >
                    <Edit3 />
                    Trocar Endereço
                  </button>
                </div>
              ) : (
                <div className="card-content">
                  <button
                    className="btn-change-address"
                    onClick={() => {
                      navigate("/cadastrarcep");
                    }}
                  >
                    <MapPinPlusInside />
                    Adicionar endereço
                  </button>
                </div>
              )}
            </div>

            {/* Forma de Pagamento */}
            <div className="card">
              <div className="card-header">
                <div className="card-header-content">
                  <div className="card-icon purple">
                    <CreditCard />
                  </div>
                  <h2 className="card-title">Forma de Pagamento</h2>
                </div>
              </div>

              <div className="card-content">
                <div className="payment-methods">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    const isSelected = payment === method.id;

                    return (
                      <label
                        key={method.id}
                        className={`payment-method ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={isSelected}
                          onChange={(e) => setPayment(e.target.value)}
                        />

                        <div
                          className={`payment-method-icon ${
                            isSelected ? "selected" : "default"
                          }`}
                        >
                          <IconComponent />
                        </div>

                        <div className="payment-method-info">
                          <div className="payment-method-label">
                            {method.label}
                          </div>
                          <div className="payment-method-description">
                            {method.description}
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="payment-method-check" />
                        )}
                      </label>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    user?.endereco ?? user?.address
                      ? handleSubmit()
                      : navigate("/cadastrarcep");
                  }}
                  disabled={isProcessing}
                  className="btn-checkout"
                >
                  {isProcessing ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      Processando...
                    </div>
                  ) : (
                    <>
                      <Package />
                      Finalizar Compra
                    </>
                  )}
                </button>

                <p className="checkout-disclaimer">
                  Ao finalizar a compra, você concorda com nossos termos de uso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
