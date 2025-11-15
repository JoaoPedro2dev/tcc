import { useState } from "react";
import { X, Package, Truck, Home, Check } from "lucide-react";
import "../modal.css";
import "./UpdateStatusModal.css";

function UpdateStatusModal({ sale, onUpdate, success, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState(sale.status || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStatus) {
      return;
    }

    fetch("http://localhost/tcc/API/POST/alterar_status_item", {
      method: "POST",
      body: new URLSearchParams({
        id_item: sale.id_item,
        novo_estado: selectedStatus,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("Mudou o status", data);

        if (data === true) {
          onUpdate(selectedStatus);
          success({ message: "status do pedido alterado com sucesso" });
        }
      });
    // .catch((error) => console.error("erro", error));
  };

  // Opções de status de entrega com ícones
  const statusOptions = [
    {
      value: "em transporte",
      label: "Em transporte",
      icon: Package,
      color: "blue",
    },
    {
      value: "chegara hoje",
      label: "Chegará hoje",
      icon: Truck,
      color: "yellow",
    },
    { value: "chegou", label: "Chegou", icon: Home, color: "green" },
    {
      value: "entregue",
      label: "Entregue",
      icon: Check,
      color: "orange",
    },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Cabeçalho do modal */}
        <div className="modal-header">
          <h2 className="modal-title">Atualizar Status de Entrega</h2>
          <button onClick={onClose} className="modal-close-button">
            <X />
          </button>
        </div>

        {/* Conteúdo do modal */}
        <form onSubmit={handleSubmit} className="modal-content">
          {/* Informações da venda */}
          <div className="update-status-sale-info">
            <p className="update-status-sale-label">Venda</p>
            <p className="update-status-sale-id">{sale.id_item}</p>
            <p className="update-status-sale-product">{sale.product_name}</p>
            {sale.endereco_entrega && (
              <div className="update-status-current-info">
                <p>
                  Entrega:{" "}
                  <span className="update-status-current-value">
                    {sale.quem_entrega === "seller"
                      ? "Própria"
                      : `${sale.quem_entrega || "Terceirizada"}`}
                  </span>
                </p>
                <p>
                  Status atual:{" "}
                  <span className="update-status-current-value">
                    {sale.status}
                  </span>
                </p>
                <p>
                  Endereco Entrega:{" "}
                  <span className="update-status-current-value">
                    {sale.endereco_entrega}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Seleção de novo status */}
          <div className="update-status-options">
            <label className="update-status-options-label">
              Novo status de entrega
            </label>
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <label
                  key={option.value}
                  className={`update-status-option ${
                    selectedStatus === option.value ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryStatus"
                    value={option.value}
                    checked={selectedStatus == option.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="update-status-option-radio"
                  />
                  <Icon
                    className={`update-status-option-icon ${option.color}`}
                  />
                  <span className="update-status-option-text">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Botões de ação */}
          <div className="update-status-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-button secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedStatus}
              className="modal-button primary"
            >
              Atualizar Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateStatusModal;
