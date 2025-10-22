import {
  Calendar,
  Package,
  MapPin,
  CreditCard,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatarData } from "../../helpers/functions";
import { useState } from "react";
import "./PurchasesCard.css";
import { useNavigate } from "react-router-dom";

function PurchaseCard({ purchase }) {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState(new Set());

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
      case "em_transporte":
      case "a caminho":
        return {
          className: "status-shipping",
          icon: Package,
          label: "Em transporte",
        };
      case "em preparação":
      case "pendente":
        return {
          className: "status-preparing",
          icon: Clock,
          label: "Em preparação",
        };
      case "chegou":
        return { className: "status-arrived", icon: MapPin, label: "Chegou" };
      case "cancelado por você":
      case "cancelado pelo vendedor":
      case "cancelado pela dnv wear":
        return {
          className: "status-cancelled",
          icon: AlertCircle,
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
      (status === "em_transporte" || status === "pendente") &&
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
      return "Reembolso será processado em até 5 dias úteis";
    }

    return "";
  };

  return (
    <div className="purchase-card">
      {/* Header */}
      <div className="purchase-header">
        <div className="purchase-date">
          <Calendar className="date-icon" />
          <span className="date-text">
            Pedido de {formatarData(purchase.data_compra)}
          </span>
        </div>
        {purchase.metodoPagamento && (
          <div className="payment-method">
            <CreditCard className="payment-icon" />
            <span className="payment-text">{purchase.metodoPagamento}</span>
          </div>
        )}
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
                <div className="product-image-container">
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
                    </div>

                    {/* Status Badge */}
                    <div className={`status-badge ${statusInfo.className}`}>
                      <StatusIcon className="status-icon" />
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Status Message */}
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

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    {(product.status === "em_transporte" ||
                      product.status === "Em preparação") && (
                      <button
                        className="action-button track-button"
                        onClick={() => {
                          navigate("/minhas-compras/rastrear");
                        }}
                      >
                        Rastrear
                      </button>
                    )}

                    {(product.status === "em_transporte" ||
                      product.status === "Em preparação" ||
                      product.status === "Não recebido") && (
                      <button className="action-button cancel-button">
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
    </div>
  );
}

export default PurchaseCard;
