import { useState } from "react";
import { X, Check, MapPin } from "lucide-react";
import "../modal.css";
import "./confirmSaleModal.css";

function ConfirmSaleModal({ sale, onConfirm, success, onClose }) {
  const [deliveredBy, setDeliveredBy] = useState("seller");
  const [company, setCompany] = useState("");
  // const [deliveryStatus, setDeliveryStatus] = useState("Pedido confirmado");
  // const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost/tcc/API/POST/confirmar-item", {
      method: "POST",
      body: new URLSearchParams({
        id_item: sale.id_item,
        quem_entrega:
          company && deliveredBy === "third-party" ? company : deliveredBy,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data === true) {
          onConfirm();
          success({ message: "status do pedido alterado com sucesso" });
        }
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Cabeçalho do modal */}
        <div className="modal-header">
          <h2 className="modal-title">Confirmar Pedido</h2>
          <button onClick={onClose} className="modal-close-button">
            <X />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="confirm-sale-info">
            <p>
              Venda:{" "}
              <span className="confirm-sale-info-value">{sale.id_item}</span>
            </p>
            <p>
              Produto:{" "}
              <span className="confirm-sale-info-value">
                {sale.product_name}
              </span>
            </p>
          </div>

          {/* Quem fará a entrega */}
          <div className="confirm-sale-form-group">
            <label className="confirm-sale-form-label">
              Quem fará a entrega?
            </label>
            <div className="confirm-sale-address">
              <span>Local de entrega:</span>
              <p>
                <MapPin size={20} />
                {sale.endereco_entrega}
              </p>
            </div>
            <div className="confirm-sale-radio-group">
              <label className="confirm-sale-radio-label">
                <input
                  type="radio"
                  value="seller"
                  checked={deliveredBy === "seller"}
                  onChange={(e) => setDeliveredBy(e.target.value)}
                  className="confirm-sale-radio-input"
                />
                <span className="confirm-sale-radio-text">
                  Eu mesmo (vendedor)
                </span>
              </label>
              <label className="confirm-sale-radio-label">
                <input
                  type="radio"
                  value="third-party"
                  checked={deliveredBy === "third-party"}
                  onChange={(e) => setDeliveredBy(e.target.value)}
                  className="confirm-sale-radio-input"
                />
                <span className="confirm-sale-radio-text">
                  Empresa terceirizada
                </span>
              </label>
            </div>
          </div>

          {/* Nome da empresa (se terceirizada) */}
          {deliveredBy === "third-party" && (
            <div className="confirm-sale-form-group">
              <label htmlFor="company" className="confirm-sale-form-label">
                Nome da empresa
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: Correios, Loggi, etc."
                required
                className="confirm-sale-text-input"
              />
            </div>
          )}

          {/* Botões de ação */}
          <div className="modal-button-group">
            <button
              type="button"
              onClick={onClose}
              className="modal-button secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="modal-button">
              <Check />
              Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmSaleModal;
