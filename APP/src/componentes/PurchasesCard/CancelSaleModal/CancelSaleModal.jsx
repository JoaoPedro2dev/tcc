import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import "../modal.css";
import "./CancelSaleModal.css";

function CancelSaleModal({ sale, onCancel, success, onClose }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [showError, setShowError] = useState(false);

  const cancellationReasons = [
    "Produto fora de estoque",
    "Cliente solicitou cancelamento",
    "Erro no pedido",
    "Problema com pagamento",
    "Endereço de entrega inválido",
  ];

  const handleConfirm = () => {
    if (!selectedReason && !additionalDetails) {
      setShowError(true);
      return;
    }

    fetch("http://localhost/tcc/API/POST/cancelar_item", {
      method: "POST",
      body: new URLSearchParams({
        id_item: sale.id_item,
        motivo_cancelamento: additionalDetails
          ? additionalDetails
          : selectedReason,
        quem_cancelou: "vendedor",
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("CANCELADO", data);
        if (data === true) {
          onCancel();
          success({ message: "Pedido Cancelado com sucesso" });
        }
      })
      .catch((error) => console.error("erro", error));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Cabeçalho do modal */}
        <div className="modal-header">
          <h2 className="modal-title">Cancelar Venda</h2>
          <button onClick={onClose} className="modal-close-button">
            <X />
          </button>
        </div>

        {/* Conteúdo do modal */}
        <div className="modal-content">
          <div className="cancel-sale-content">
            <div className="cancel-sale-icon">
              <AlertTriangle />
            </div>
            <div className="cancel-sale-text">
              <p className="cancel-sale-title">
                Tem certeza que deseja cancelar esta venda?
              </p>
              <p className="cancel-sale-description">
                Esta ação não pode ser desfeita. A venda será marcada como
                cancelada e o lucro será zerado.
              </p>
              <div className="cancel-sale-details">
                <p className="cancel-sale-detail">
                  ID:{" "}
                  <span className="cancel-sale-detail-value">
                    {sale.id_item}
                  </span>
                </p>
                <p className="cancel-sale-detail">
                  Produto:{" "}
                  <span className="cancel-sale-detail-value">
                    {sale.product_name}
                  </span>
                </p>
                <p className="cancel-sale-detail">
                  Cliente:{" "}
                  <span className="cancel-sale-detail-value">
                    {sale.nome_cliente}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="cancellation-reasons-section">
            <h3 className="cancellation-reasons-title">
              Motivo do cancelamento *
            </h3>
            <div className="cancellation-reasons-list">
              {cancellationReasons.map((reason) => (
                <label key={reason} className="cancellation-reason-option">
                  <input
                    type="radio"
                    name="cancellation-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => {
                      setSelectedReason(e.target.value);
                      setShowError(false);
                    }}
                    className="cancellation-reason-radio"
                  />
                  <span className="cancellation-reason-label">{reason}</span>
                </label>
              ))}
            </div>

            <div className="cancellation-details-section">
              <label
                htmlFor="additional-details"
                className="cancellation-details-label"
              >
                Detalhes adicionais (opcional)
              </label>
              <textarea
                id="additional-details"
                value={additionalDetails}
                onChange={(e) => {
                  setAdditionalDetails(e.target.value);
                  setSelectedReason(null);
                }}
                placeholder="Descreva mais detalhes sobre o cancelamento, se necessário..."
                className="cancellation-details-textarea"
                rows={4}
              />
            </div>
          </div>

          {showError && (
            <p className="cancellation-error-message">
              Por favor, selecione um motivo para o cancelamento
            </p>
          )}

          {/* Botões de ação */}
          <div className="modal-button-group">
            <button onClick={onClose} className="modal-button secondary">
              Não, manter venda
            </button>
            <button onClick={handleConfirm} className="modal-button danger">
              Sim, cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CancelSaleModal;
