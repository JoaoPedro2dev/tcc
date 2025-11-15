import {
  Calendar,
  Package,
  MapPin,
  CreditCard,
  User,
  Clock,
  AlertCircle,
  X,
  CheckCircle,
  Check,
  EarthLock,
} from "lucide-react";
import { formatarData, monetaryFormatting } from "../../helpers/functions";
import { useState } from "react";
import "./PurchasesCard.css";
import { useNavigate } from "react-router-dom";
import CancelSaleModal from "../CancelSaleModal/CancelSaleModal";
import FeedbackPopup from "../Feedback/Feedback";
// import CancelSaleModal from "./CancelSaleModal/CancelSaleModal";
// import CancelSaleModal from "./CancelSaleModal/CancelSaleModal";

function PurchaseCard({ purchaseData }) {
  const navigate = useNavigate();
  const [purchase, setPurchases] = useState(purchaseData);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [cancelSale, setCancelSale] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [success, setSuccess] = useState(false);

  console.log("Compra data", purchase);

  const toggleExpand = (productId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case "entregue":
        return {
          className: "status-delivered",
          icon: CheckCircle,
          label: "Entregue",
        };
      case "em transporte":
        return {
          className: "status-shipping",
          icon: Package,
          label: "Em transporte",
        };
      case "confirmado":
        return {
          className: "status-preparing",
          icon: Check,
          label: "Confirmado",
        };

      case "pendente":
        return {
          className: "status-preparing",
          icon: Clock,
          label: "Em preparação",
        };
      case "chegou":
        return { className: "status-arrived", icon: MapPin, label: "Chegou" };
      case "cancelado":
        return {
          className: "status-cancelled",
          icon: X,
          label: "Cancelado",
        };
      case "não recebido":
        return {
          className: "status-not-received",
          icon: AlertCircle,
          label: "Não recebido",
        };
      default:
        return { className: "status-default", icon: Package, label: status };
    }
  };

  const getStatusMessage = (product) => {
    const status = product.status.toLowerCase();

    if (status === "entregue" && product.data_entregue) {
      return `Entregue em ${formatarData(product.data_entregue)}`;
    }

    if (
      (status === "em transporte" || status === "pendente") &&
      product.data_previsao
    ) {
      return `Previsão de entrega: ${formatarData(product.data_previsao)}`;
    }

    if (status === "não recebido") {
      if (product.novoPrazo) {
        return `Nova previsão: ${formatarData(product.novoPrazo)}`;
      }
      return "Aguardando novo prazo do vendedor";
    }

    if (status.includes("cancelado")) {
      return (
        <>
          <span>Quem cancelou: {product.quem_cancelou}</span>
          <span>Motivo: {product.motivo_cancelamento}</span>
          <span>
            Seu reembolso de{" "}
            {product.preco_promocao > 0
              ? monetaryFormatting(product.preco_promocao)
              : monetaryFormatting(product.preco_uniario)}{" "}
            foi acionado
          </span>
        </>
      );
    }

    return;
  };

  const handleCancelSale = (selectedItemId) => {
    setPurchases((prev) => ({
      ...prev,
      itens: prev.itens.map((item) =>
        item.id_item === selectedItemId
          ? {
              ...item,
              status: "cancelado",
            }
          : item
      ),
    }));

    setCancelSale(false);
  };

  return (
    <div className="purchase-card">
      {cancelSale && (
        <CancelSaleModal
          sale={selectedItem}
          onCancel={() => handleCancelSale(selectedItem.id_item)}
          success={setSuccess}
          onClose={() => {
            setCancelSale(false);
          }}
          isClient={true}
        />
      )}

      {success && (
        <FeedbackPopup
          message={success.message}
          type="success"
          onClose={() => {
            setSuccess(false);
          }}
        />
      )}

      {/* Header */}
      <div className="purchase-header">
        <div className="purchase-date">
          <Calendar size={20} color="black" />
          <span className="date-text">
            Pedido de {formatarData(purchase.data_compra)}
          </span>
        </div>
        <div className="payment-method">
          {purchase.forma_pagamento === "cartao" ? (
            <CreditCard className="payment-icon" color="black" />
          ) : (
            <EarthLock className="payment-icon" color="black" />
          )}
          <span className="payment-text">
            {purchase.forma_pagamento === "cartao" ? "Cartão" : "Pix"}
          </span>
        </div>
      </div>

      {/* Products */}
      <div className="products-list">
        {purchase.itens.map((product, key) => {
          const statusInfo = getStatusInfo(product.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div key={key} className="product-item">
              <div className="product-content">
                {/* Product Image */}
                <div
                  className="product-image-container"
                  onClick={() => {
                    product.status === "entregue" ||
                      (product.status === "cancelado" &&
                        navigate("/minhas-compras/detalhes", {
                          state: purchase.id_compra,
                        }));
                  }}
                >
                  <img
                    src={
                      product.produc_image ||
                      "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop"
                    }
                    alt={product.product_name}
                    className="product-image"
                    onClick={() => toggleExpand(product.id)}
                  />
                </div>

                {/* Product Info */}
                <div className="product-info">
                  <div className="product-header-info">
                    <div className="product-details">
                      <h3 className="product-name">{product.product_name}</h3>
                      <p className="product-quantity">
                        {product.quantidade}{" "}
                        {product.quantidade === 1 ? "unidade" : "unidades"}
                      </p>
                      <div className="displayRow small colorGray">
                        <p>Cor: {product.cor}</p>
                        <p>Tamanho: {product.tamanho}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`status-badge ${statusInfo.className}`}>
                      <StatusIcon className="status-icon" />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Status Message */}
                  {getStatusMessage(product) && (
                    <div className="status-message">
                      <p className="status-text">{getStatusMessage(product)}</p>
                      {product.recebido_por && (
                        <div className="received-by">
                          <User className="received-icon" />
                          <span className="received-text">
                            Recebido por {product.recebido_por}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    {product.status != "entregue" &&
                      product.status != "cancelado" &&
                      product.status != "não recebido" && (
                        <button
                          className="action-button cancel-button"
                          onClick={() => {
                            setSelectedItem(product);
                            setCancelSale(true);
                          }}
                        >
                          Cancelar
                        </button>
                      )}

                    {product.status === "Entregue" && (
                      <button className="action-button review-button">
                        Avaliar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        {purchase.itens.some(
          (product) =>
            product.status != "entregue" && product.status != "cancelado"
        ) && (
          <button
            className="action-button track-button"
            onClick={() => {
              navigate("/minhas-compras/rastrear", {
                state: purchase.id_compra,
              });
            }}
          >
            Rastrear Compra
          </button>
        )}
      </div>
    </div>
  );
}

export default PurchaseCard;
