"use client";

import { useState, useEffect } from "react";
import {
  Store,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Search,
  Filter,
  Check,
  X,
  Eye,
  RefreshCw,
} from "lucide-react";

import "./Dashboard.css";
import Header from "../../componentes/Header/Header";
import SaleDetailsModal from "./Modais/SalesDetailsModal/SalesDetailsModal";
import ConfirmSaleModal from "./Modais/ConfirmSaleModal/ConfirmSaleModal";
// import CancelSaleModal from "./Modais/CancelSaleModal/CancelSaleModal";
import UpdateStatusModal from "./Modais/UpdateStatusModal/UpdateStatusModal";
import { useUser } from "../../context/UserContext";
import {
  // formatarData,
  formatDefaultDate,
  getStatusClass,
  getStatusLabel,
  monetaryFormatting,
} from "../../helpers/functions";
import FeedbackPopup from "../../componentes/Feedback/Feedback";
import CancelSaleModal from "../../componentes/CancelSaleModal/CancelSaleModal";

function DashboardContent() {
  const { user } = useUser();
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [confirmingSale, setConfirmingSale] = useState(null);
  const [cancellingSale, setCancellingSale] = useState(null);
  const [updatingStatusSale, setUpdatingStatusSale] = useState(null);

  const productTotal = (sale) => {
    const price =
      sale.preco_promocao > 0 ? sale.preco_promocao : sale.preco_unitario;

    return price * sale.quantidade + sale.frete;
  };

  useEffect(() => {
    // console.log(user?.id);
    if (!user?.id) return;

    fetch("http://localhost/tcc/API/GET/itens-by-seller_id", {
      method: "POST",
      body: new URLSearchParams({ id_seller: user?.seller_id }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("data", data);
        setSales(data);
        setFilteredSales(data);
      });
    // .catch((error) => console.error(error));
  }, [user]);

  // Calcular resumo financeiro
  const confirmedSales = sales.filter((s) => s.status === "confirmed");
  const cancelledSales = sales.filter((s) => s.status === "cancelled");
  const totalProfit = confirmedSales.reduce(
    (sum, sale) => sum + sale.profit,
    0
  );
  const averageTicket =
    confirmedSales.length > 0
      ? confirmedSales.reduce((sum, sale) => sum + sale.value, 0) /
        confirmedSales.length
      : 0;

  // Função para confirmar venda
  const handleConfirmSale = (saleId) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id_item === saleId
          ? {
              ...sale,
              status: "confirmado",
            }
          : sale
      )
    );
    setConfirmingSale(null);
  };

  // Função para cancelar venda
  const handleCancelSale = (saleId) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id_item === saleId
          ? {
              ...sale,
              status: "cancelado",
            }
          : sale
      )
    );
    setCancellingSale(null);
  };

  // Atualizar status de entrega
  const handleUpdateStatus = (saleId, newDeliveryStatus) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id_item === saleId
          ? {
              ...sale,
              status: newDeliveryStatus,
              // statusHistory: [
              //   ...sale.statusHistory,
              //   {
              //     status: newDeliveryStatus,
              //     date: new Date().toLocaleString("pt-BR"),
              //   },
              // ],
            }
          : sale
      )
    );
    setUpdatingStatusSale(null);
  };

  const [alertSuccess, setAlertSuccess] = useState(false);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...sales];

    // Busca
    if (searchTerm) {
      filtered = filtered.filter(
        (sale) =>
          sale.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.id_item.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status
    if (statusFilter !== "all") {
      filtered = filtered.filter((sale) => sale.status === statusFilter);
    }

    // Período
    if (periodFilter !== "all") {
      const now = new Date();
      const daysAgo =
        periodFilter === "week" ? 7 : periodFilter === "month" ? 30 : 90;
      const cutoffDate = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000
      );
      filtered = filtered.filter(
        (sale) => new Date(sale.data_compra.replace(" ", "T")) >= cutoffDate
      );
    }

    setFilteredSales(filtered);
  }, [searchTerm, statusFilter, periodFilter, sales]);

  const statusArray = [
    "confirmado",
    "em transporte",
    "chegara hoje",
    "chegou",
    "não recebido",
  ];

  if (!user?.id || !user?.seller_id) {
    return <></>;
  }

  return (
    <div id="dashboard-container">
      <Header title={"Painel Administrativo"} />

      <main style={{ maxWidth: "80rem", margin: "0 auto", padding: "8% 0" }}>
        {/* Cards de resumo */}
        <div className="summary-cards-grid">
          <div className="summary-card">
            <div className="summary-card-content">
              <div>
                <p className="summary-card-label">Vendas Concluídas</p>
                <p className="summary-card-value">{confirmedSales.length}</p>
              </div>
              <div className="summary-card-icon success">
                <TrendingUp />
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-content">
              <div>
                <p className="summary-card-label">Cancelamentos</p>
                <p className="summary-card-value">{cancelledSales.length}</p>
              </div>
              <div className="summary-card-icon error">
                <TrendingDown />
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-content">
              <div>
                <p className="summary-card-label">Lucro Total</p>
                <p className="summary-card-value">
                  {monetaryFormatting(totalProfit)}
                </p>
              </div>
              <div className="summary-card-icon success">
                <DollarSign />
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-content">
              <div>
                <p className="summary-card-label">Ticket Médio</p>
                <p className="summary-card-value">
                  {monetaryFormatting(averageTicket)}
                </p>
              </div>
              <div className="summary-card-icon info">
                <Receipt />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="sales-filters">
          <div className="sales-filters-header">
            <Filter />
            <h2 className="sales-filters-title">Filtros e Busca</h2>
          </div>

          <div className="sales-filters-grid">
            <div className="filter-group full-width">
              <label htmlFor="search" className="filter-label">
                Buscar por produto ou ID
              </label>
              <div className="filter-input-wrapper">
                <Search className="filter-input-icon" />
                <input
                  id="search"
                  type="text"
                  placeholder="Digite o nome do produto ou ID da venda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="status" className="filter-label">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos</option>
                <option value="confirmado">Confirmada</option>
                <option value="pendente">Pendente</option>
                <option value="cancelado">Cancelada</option>
              </select>
            </div>

            <div className="filter-group period">
              <label htmlFor="period" className="filter-label">
                Período
              </label>
              <select
                id="period"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos os períodos</option>
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
                <option value="3months">Últimos 3 meses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="sales-table-container">
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Valor Uni.</th>
                  <th>Frete</th>
                  <th>Qnt.</th>
                  <th>Total Pago</th>
                  <th>Status</th>
                  <th className="center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="sales-table-empty">
                      Nenhuma venda encontrada
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale, key) => (
                    <tr key={key} onClick={() => setSelectedSale(sale)}>
                      <td className="id">{sale.id_compra}</td>
                      <td className="product">{sale.product_name}</td>
                      <td className="client">{sale.nome_cliente}</td>
                      <td className="date">
                        {formatDefaultDate(sale.data_compra)}
                      </td>
                      <td className="value">
                        {sale.preco_promocao ? (
                          <>
                            <p className="colorGray line-through ">
                              {monetaryFormatting(sale.preco_unitario)}
                            </p>{" "}
                            <p>{monetaryFormatting(sale.preco_promocao)}</p>
                          </>
                        ) : (
                          monetaryFormatting(sale.preco_unitario)
                        )}
                      </td>
                      <td>
                        {sale.frete > 0 ? (
                          monetaryFormatting(sale.frete)
                        ) : (
                          <span className="colorGreen">Grátis</span>
                        )}
                      </td>
                      <td>{sale.quantidade}</td>
                      <td>{monetaryFormatting(productTotal(sale))}</td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            sale.status
                          )}`}
                        >
                          {getStatusLabel(sale.status)}
                        </span>
                      </td>
                      <td>
                        <div className="sales-table-actions">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSale(sale);
                            }}
                            className="action-button view"
                            title="Ver detalhes"
                          >
                            <Eye />
                          </button>

                          {sale.status === "pendente" && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmingSale(sale);
                                }}
                                className="action-button confirm"
                                title="Confirmar venda"
                              >
                                <Check />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCancellingSale(sale);
                                }}
                                className="action-button cancel"
                                title="Cancelar venda"
                              >
                                <X />
                              </button>
                            </>
                          )}

                          {statusArray.includes(sale.status) && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUpdatingStatusSale(sale);
                                }}
                                className="action-button update"
                                title="Atualizar status de entrega"
                              >
                                <RefreshCw />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCancellingSale(sale);
                                }}
                                className="action-button cancel"
                                title="Cancelar venda"
                              >
                                <X />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {alertSuccess && (
        <FeedbackPopup
          message={alertSuccess.message}
          type="success"
          onClose={() => {
            setAlertSuccess(false);
          }}
        />
      )}

      {/* Modais */}
      {selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}

      {confirmingSale && (
        <ConfirmSaleModal
          sale={confirmingSale}
          onConfirm={() => handleConfirmSale(confirmingSale.id_item)}
          success={setAlertSuccess}
          onClose={() => setConfirmingSale(null)}
        />
      )}

      {cancellingSale && (
        <CancelSaleModal
          sale={cancellingSale}
          onCancel={() => handleCancelSale(cancellingSale.id_item)}
          success={setAlertSuccess}
          onClose={() => setCancellingSale(null)}
        />
      )}

      {updatingStatusSale && (
        <UpdateStatusModal
          sale={updatingStatusSale}
          onUpdate={(newStatus) =>
            handleUpdateStatus(updatingStatusSale.id_item, newStatus)
          }
          success={setAlertSuccess}
          onClose={() => setUpdatingStatusSale(null)}
        />
      )}
    </div>
  );
}

export default DashboardContent;
