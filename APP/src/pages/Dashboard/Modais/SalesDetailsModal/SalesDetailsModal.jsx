import { X, ExternalLink, MapPin } from "lucide-react";
import "../modal.css";
import "./SalesDetailsModal.css";
import {
  calcularPorcentagem,
  formatarData,
  getStatusClass,
  getStatusLabel,
  monetaryFormatting,
} from "../../../../helpers/functions";

export default function SaleDetailsModal({ sale, onClose }) {
  const statusArray = ["cancelado", "entregue"];

  function verifyStatus(status) {
    switch (status) {
      case "entregue":
        return { class: "entregue", message: "Você recebera seu lucro" };
      case "cancelado":
        return {
          class: "cancelado",
          message: "Pedido cancelado, você não recebera seu lucro",
        };
      default:
        return {
          class: "",
          message:
            "Você receberá seu lucro em até 24 após a entrega do produto",
        };
    }
  }

  const productTotal = () => {
    const price =
      sale.preco_promocao > 0 ? sale.preco_promocao : sale.preco_unitario;

    return price * sale.quantidade + sale.frete;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        {/* Cabeçalho do modal */}
        <div className="modal-header">
          <h2 className="modal-title">Detalhes da Venda</h2>
          <button onClick={onClose} className="modal-close-button">
            <X />
          </button>
        </div>

        {/* Conteúdo do modal */}
        <div className="modal-content scrollable">
          {/* Informações do produto */}
          <div className="sale-details-product">
            <img
              src={sale.product_image || "/placeholder.svg"}
              alt={sale.product_name}
              className="sale-details-image"
            />
            <div className="sale-details-product-info">
              <h3 className="sale-details-product-name">{sale.product_name}</h3>
              <p className="sale-details-product-id">ID: {sale.id_compra}</p>
              <div className="sale-details-product-status">
                <span className={`status-badge ${getStatusClass(sale.status)}`}>
                  {getStatusLabel(sale.status)}
                </span>
                {sale.status === "cancelado" && (
                  <>
                    <p>
                      Quem cancelou: <span>{sale.quem_cancelou}</span>
                    </p>
                    <p>
                      Motivo: <span>{sale.motivo_cancelamento}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Grid de informações */}
          <div className="sale-details-grid">
            <aside className="right">
              <div>
                <p className="sale-details-field-label">Cliente</p>
                <p className="sale-details-field-value">{sale.nome_cliente}</p>
              </div>

              <div>
                <p className="sale-details-field-label">Data da Venda</p>
                <p className="sale-details-field-value">
                  {formatarData(sale.data_compra)}
                </p>
              </div>

              <div className="displayRow">
                <div>
                  <p className="sale-details-field-label">Cor</p>
                  <p className="sale-details-field-value">{sale.cor}</p>
                </div>

                <div>
                  <p className="sale-details-field-label">Tamanho</p>
                  <p className="sale-details-field-value">{sale.tamanho}</p>
                </div>
              </div>

              <div>
                <p className="sale-details-field-label">Quantidade</p>
                <p className="sale-details-field-value">
                  {sale.quantidade} Unidade{sale.quantidade > 1 && "s"}
                </p>
              </div>
            </aside>

            <aside className="left">
              <div className="sale-details-field-value">
                <p className="sale-details-field-label">Valor Unitário</p>
                {sale.preco_promocao ? (
                  <div className="promotion-container">
                    <span className="small colorGray line-through ">
                      {monetaryFormatting(sale.preco_unitario)}
                    </span>
                    <span>{monetaryFormatting(sale.preco_promocao)}</span>
                  </div>
                ) : (
                  <p>{monetaryFormatting(sale.preco_unitario)}</p>
                )}
              </div>

              <div>
                <p className="sale-details-field-label">Valor de Frete</p>
                <p className="sale-details-field-value">
                  {sale.frete > 0 ? (
                    monetaryFormatting(sale.frete)
                  ) : (
                    <span className="colorGreen">Grátis</span>
                  )}
                </p>
              </div>

              <div>
                <p className="sale-details-field-label">Valor Total</p>
                <p className="sale-details-field-value large">
                  {monetaryFormatting(productTotal())}
                </p>
              </div>

              <div>
                <p className="sale-details-field-label">Calculo de Lucro:</p>
                <p className="small">
                  Fátia da DNV WEAR:{" "}
                  <span className="colorGreen">
                    {monetaryFormatting(sale.fatia_dnvwear)} (
                    {calcularPorcentagem(
                      sale.fatia_dnvwear,
                      sale.preco_total - sale.frete
                    )}
                    )
                  </span>
                </p>
                <p className="small sale-details-field-value">
                  Seu lucro:{" "}
                  <span className="colorGreen">
                    {monetaryFormatting(sale.preco_total - sale.fatia_dnvwear)}
                  </span>
                </p>
              </div>
            </aside>
          </div>

          <div className={"money-credited " + verifyStatus(sale.status).class}>
            {verifyStatus(sale.status).message}
          </div>

          {/* Link para NF-e */}
          <div className="sale-details-nfe">
            <p className="sale-details-nfe-label">Nota Fiscal Eletrônica</p>
            <a
              href={sale.nfeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="sale-details-nfe-link"
            >
              Acessar NF-e
              <ExternalLink />
            </a>
          </div>

          {/* Informações de entrega */}
          {!statusArray.includes(sale.status) && (
            <div className="sale-details-delivery">
              <h4 className="sale-details-delivery-title">
                Informações de Entrega
              </h4>
              <div className="sale-details-delivery-info">
                <div className="sale-details-delivery-field">
                  {sale.quem_entrega && (
                    <>
                      <span className="sale-details-delivery-field-label">
                        Entrega realizada por:{" "}
                      </span>
                      <span className="sale-details-delivery-field-value">
                        {sale.quem_entrega === "seller"
                          ? "VENDEDOR"
                          : sale.quem_entrega}
                      </span>
                    </>
                  )}
                </div>
                <div>
                  <p className="sale-details-delivery-field-label">
                    Local de entrega:
                  </p>
                  <div className={`sale-details-delivery-status`}>
                    {/* {getDeliveryIcon(sale.quem_entrega)} */}
                    <MapPin />
                    <p className="sale-details-delivery-field-value">
                      {sale.endereco_entrega}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Histórico de status */}
          <div>
            <h4 className="sale-details-history-title">Histórico de Status</h4>
            <div className="sale-details-history-list">
              {sale.statusHistory?.map((history, index) => (
                <div key={index} className="sale-details-history-item">
                  <div className="sale-details-history-dot" />
                  <div className="sale-details-history-content">
                    <p className="sale-details-history-status">
                      {history.status}
                    </p>
                    <p className="sale-details-history-date">{history.date}</p>
                  </div>
                </div>
              )) ?? <>NULL</>}
            </div>
          </div>
        </div>

        {/* Rodapé do modal */}
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button primary full-width">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
