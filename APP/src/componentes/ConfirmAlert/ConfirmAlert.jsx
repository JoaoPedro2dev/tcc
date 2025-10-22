import "./confirmAlert.css";

const confirmAlert = ({ message, onClose, onConfirm }) => {
  // Fecha ao clicar no fundo
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup-overlay")) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-container">
        <button className="popup-close" onClick={onClose}>
          ✕
        </button>
        <p className="popup-message">{message}</p>
        <div className="popup-actions">
          <button className="popup-btn confirm" onClick={onConfirm}>
            Sim
          </button>
          <button className="popup-btn cancel" onClick={onClose}>
            Não
          </button>
        </div>
      </div>
    </div>
  );
};

export default confirmAlert;
