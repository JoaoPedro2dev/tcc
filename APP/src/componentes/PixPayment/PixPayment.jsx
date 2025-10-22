import React, { useState } from "react";
import { Copy, Check, Smartphone, QrCode } from "lucide-react";
import "./PixPayment.css";
import { monetaryFormatting } from "../../helpers/functions";
import FeedbackPopup from "../Feedback/Feedback";

const PixPayment = ({
  confirm,
  pixLink = "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=TESTE_PIX_DEBUG%3BID%3A1700000000%3BAMOUNT%3A25.50%3BMERCHANT%3APadaria%2520Debug%3BUNUSABLE%3D1",
  onClose,
  total,
  purchasedTrue,
}) => {
  const [copied, setCopied] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  if (purchasedTrue) {
    return (
      <FeedbackPopup
        message={"Sua compra foi realizada com sucesso!"}
        type="success"
        link={"/minhas-compras"}
      />
    );
  }

  return (
    <div
      className="background-pix-payment"
      onClick={(e) => {
        e.target.className === "background-pix-payment" && onClose && onClose();
        console.log(e.target.className);
      }}
    >
      <div className="pix-payment-container">
        {/* Header */}
        <div className="pix-payment-header">
          <div className="pix-payment-header-content">
            <QrCode className="pix-header-icon" />
            <h2 className="pix-payment-title">Pagamento via PIX</h2>
          </div>
        </div>

        {/* Content */}
        <div className="pix-payment-content">
          {/* Description */}
          <div className="pix-payment-description">
            <p>
              Escaneie o QR Code com o aplicativo do seu banco ou copie o código
              PIX abaixo para realizar o pagamento.
            </p>
          </div>

          {/* QR Code */}
          <div className="pix-qr-section">
            <div className="pix-qr-container">
              <div className="pix-qr-wrapper">
                <img
                  src="../../../qrcode.png"
                  alt="QR CODE Não funcional de PIX para emular um QR CODE real"
                  className={`pix-qr-image ${
                    isImageLoaded ? "loaded" : "loading"
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                />
                {!isImageLoaded && (
                  <div className="pix-qr-placeholder">
                    <div className="pix-qr-placeholder-content">
                      <QrCode className="pix-qr-placeholder-icon" />
                    </div>
                  </div>
                )}
              </div>
              <div className="pix-smartphone-badge">
                <Smartphone className="pix-smartphone-icon" />
              </div>
            </div>
          </div>

          <div className="textCenter colorGray">
            <p>
              Você pagará <strong>{monetaryFormatting(total)}</strong>
            </p>
          </div>

          {/* PIX Code */}
          <div className="pix-code-section">
            <div className="pix-code-container">
              <p className="pix-code-text">{pixLink}</p>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className={`pix-copy-button ${copied ? "copied" : ""}`}
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="pix-button-icon" />
                  <span>Código Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="pix-button-icon" />
                  <span>Copiar Código PIX</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pix-action-buttons">
            <button
              onClick={confirm}
              className="pix-action-button pix-confirm-button"
            >
              <Check className="pix-button-icon" />
              <span>Já paguei!</span>
            </button>
            <button
              onClick={onClose}
              className="pix-action-button pix-cancel-button"
            >
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixPayment;
