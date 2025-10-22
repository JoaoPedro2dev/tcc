import React, { useState, useEffect } from "react";
import "./SalesManagement.css";
import { monetaryFormatting } from "../../helpers/functions";

const SalesManagement = () => {
  // Estado inicial com dados mockados
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/tcc/API/GET/compras?id=1`, {
      method: "POST",
      // body: ,
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data) {
          setSales(data);
        }
      })
      .catch((error) => {
        console.error("erro", error);
      });
  }, []);

  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [filteredSales, setFilteredSales] = useState(sales);

  // Estados para ações
  const [customCarrier, setCustomCarrier] = useState({});

  // Efeito para filtrar vendas
  useEffect(() => {
    let filtered = sales;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (sale) =>
          sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.buyer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter((sale) => sale.status === statusFilter);
    }

    setFilteredSales(filtered);
  }, [sales, searchTerm, statusFilter]);

  // Função para atualizar status da venda
  const updateSaleStatus = (id, newStatus) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === id ? { ...sale, status: newStatus } : sale
      )
    );
  };

  // Função para confirmar venda
  const confirmSale = (id) => {
    updateSaleStatus(id, "confirmada");
  };

  // Função para cancelar venda
  const cancelSale = (id) => {
    updateSaleStatus(id, "cancelada");
  };

  // Função para atualizar método de entrega
  const updateDeliveryMethod = (id, method, customValue = "") => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === id
          ? {
              ...sale,
              deliveryMethod: method === "outro" ? customValue : method,
            }
          : sale
      )
    );
  };

  // Função para atualizar data de entrega
  const updateDeliveryDate = (id, date) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === id ? { ...sale, deliveryDate: date } : sale
      )
    );
  };

  // Função para marcar como enviado
  const updateShippedStatus = (id, shipped) => {
    setSales((prevSales) =>
      prevSales.map((sale) => {
        if (sale.id === id) {
          const newStatus = shipped ? "em transporte" : "confirmada";
          return {
            ...sale,
            shipped,
            status: newStatus,
            // Reset delivery today and time when unshipping
            deliveryToday: shipped ? sale.deliveryToday : false,
            deliveryTimeStart: shipped ? sale.deliveryTimeStart : "",
            deliveryTimeEnd: shipped ? sale.deliveryTimeEnd : "",
          };
        }
        return sale;
      })
    );
  };

  // Função para atualizar entrega hoje
  const updateDeliveryToday = (id, deliveryToday) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === id
          ? {
              ...sale,
              deliveryToday,
              // Reset time when unchecking delivery today
              deliveryTimeStart: deliveryToday ? sale.deliveryTimeStart : "",
              deliveryTimeEnd: deliveryToday ? sale.deliveryTimeEnd : "",
            }
          : sale
      )
    );
  };

  // Função para atualizar horário de entrega
  const updateDeliveryTime = (id, timeType, time) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === id ? { ...sale, [timeType]: time } : sale
      )
    );
  };

  // Função para obter badge de status
  const getStatusBadge = (status) => {
    const statusConfig = {
      pendente: { class: "status-pending", text: "Pendente" },
      confirmada: { class: "status-confirmed", text: "Confirmada" },
      cancelada: { class: "status-cancelled", text: "Cancelada" },
      "em transporte": { class: "status-shipping", text: "Em Transporte" },
      entregue: { class: "status-delivered", text: "Entregue" },
    };

    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>{config.text}</span>
    );
  };

  // Cálculos do dashboard
  const totalSales = sales.length;
  const salesByStatus = sales.reduce((acc, sale) => {
    acc[sale.status] = (acc[sale.status] || 0) + 1;
    return acc;
  }, {});
  const activeSales = sales.filter(
    (sale) => !["cancelada", "entregue"].includes(sale.status)
  ).length;

  return (
    <div className="sales-management">
      {/* Dashboard */}
      <div className="dashboard">
        <div className="dashboard-card">
          <h3>Total de Vendas</h3>
          <span className="dashboard-number">{totalSales}</span>
        </div>
        <div className="dashboard-card">
          <h3>Vendas Ativas</h3>
          <span className="dashboard-number active">{activeSales}</span>
        </div>
        <div className="dashboard-card">
          <h3>Pendentes</h3>
          <span className="dashboard-number pending">
            {salesByStatus.pendente || 0}
          </span>
        </div>
        <div className="dashboard-card">
          <h3>Entregues</h3>
          <span className="dashboard-number delivered">
            {salesByStatus.entregue || 0}
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por produto ou comprador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
            <option value="em transporte">Em Transporte</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="sales-list">
        {filteredSales.map((sale, key) => (
          <div key={key} className="sale-card">
            <p className="buyer-info">
              Comprador: <strong>{sale.name}</strong>
            </p>
            <div className="sale-status">{getStatusBadge(sale.status)}</div>

            {sale.itens.map((item, key) => (
              <div key={key} className="sale-header">
                <div className="sale-info">
                  <img
                    src={item.produc_image}
                    alt=""
                    className="product_image"
                  />
                  <h3 className="product-name">{item.product_name}</h3>

                  <div className="sale-details">
                    <span className="quantity">Qtd: {item.quantidade}</span>

                    {item.preco_promocao > 0 ? (
                      <div>
                        <p>
                          Preco por unidade:
                          <span className="colorGray small line-through">
                            {monetaryFormatting(item.preco_unitario)}
                          </span>
                        </p>

                        <p>
                          Preco pago por promoção:
                          <span className="value">
                            {monetaryFormatting(item.preco_promocao)}
                          </span>
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                    <span className="value">
                      Frete: {monetaryFormatting(item.frete)}
                    </span>
                    <span className="value">
                      Total da compra:
                      {monetaryFormatting(
                        item.preco_promocao > 0
                          ? item.preco_promocao * item.quantidade + item.frete
                          : item.preco_unitario * item.quantidade + item.frete
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Ações da venda */}
            <div className="sale-actions">
              {/* Botões de ação */}
              {sale.status === "pendente" && (
                <div className="action-buttons">
                  <button
                    className="btn btn-confirm"
                    onClick={() => confirmSale(sale.id)}
                  >
                    Confirmar
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={() => cancelSale(sale.id)}
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {/* Configurações de entrega para vendas confirmadas */}
              {sale.status === "confirmada" && (
                <div className="delivery-settings">
                  <div className="delivery-method">
                    <h4>Método de Entrega:</h4>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`delivery-${sale.id}`}
                          value="proprio"
                          checked={sale.deliveryMethod === "proprio"}
                          onChange={(e) =>
                            updateDeliveryMethod(sale.id, e.target.value)
                          }
                        />
                        Próprio vendedor
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`delivery-${sale.id}`}
                          value="correios"
                          checked={sale.deliveryMethod === "correios"}
                          onChange={(e) =>
                            updateDeliveryMethod(sale.id, e.target.value)
                          }
                        />
                        Correios
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`delivery-${sale.id}`}
                          value="outro"
                          checked={
                            sale.deliveryMethod &&
                            !["proprio", "correios"].includes(
                              sale.deliveryMethod
                            )
                          }
                          onChange={(e) =>
                            updateDeliveryMethod(sale.id, e.target.value)
                          }
                        />
                        Outra transportadora
                      </label>
                    </div>
                    {sale.deliveryMethod &&
                      !["proprio", "correios"].includes(
                        sale.deliveryMethod
                      ) && (
                        <input
                          type="text"
                          placeholder="Nome da transportadora"
                          value={customCarrier[sale.id] || sale.deliveryMethod}
                          onChange={(e) => {
                            setCustomCarrier((prev) => ({
                              ...prev,
                              [sale.id]: e.target.value,
                            }));
                            updateDeliveryMethod(
                              sale.id,
                              "outro",
                              e.target.value
                            );
                          }}
                          className="carrier-input"
                        />
                      )}
                  </div>

                  <div className="delivery-date">
                    <label>Data Estimada de Entrega:</label>
                    <input
                      type="date"
                      value={sale.deliveryDate}
                      onChange={(e) =>
                        updateDeliveryDate(sale.id, e.target.value)
                      }
                      className="date-input"
                    />
                  </div>

                  <div className="shipping-status">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={sale.shipped}
                        onChange={(e) =>
                          updateShippedStatus(sale.id, e.target.checked)
                        }
                      />
                      Produto saiu para entrega
                    </label>
                  </div>

                  {/* Configurações adicionais quando produto saiu para entrega */}
                  {sale.shipped && (
                    <div className="delivery-timing">
                      <div className="delivery-today">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={sale.deliveryToday}
                            onChange={(e) =>
                              updateDeliveryToday(sale.id, e.target.checked)
                            }
                          />
                          Produto chegará hoje
                        </label>
                      </div>

                      {/* Horários específicos quando entrega é hoje */}
                      {sale.deliveryToday && (
                        <div className="delivery-time-range">
                          <h5>Horário estimado de entrega:</h5>
                          <div className="time-inputs">
                            <div className="time-input-group">
                              <label>Das:</label>
                              <input
                                type="time"
                                value={sale.deliveryTimeStart}
                                onChange={(e) =>
                                  updateDeliveryTime(
                                    sale.id,
                                    "deliveryTimeStart",
                                    e.target.value
                                  )
                                }
                                className="time-input"
                              />
                            </div>
                            <div className="time-input-group">
                              <label>Até:</label>
                              <input
                                type="time"
                                value={sale.deliveryTimeEnd}
                                onChange={(e) =>
                                  updateDeliveryTime(
                                    sale.id,
                                    "deliveryTimeEnd",
                                    e.target.value
                                  )
                                }
                                className="time-input"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Informações de entrega para vendas em transporte/entregues */}
              {["em transporte", "entregue"].includes(sale.status) && (
                <div className="delivery-info">
                  <p>
                    <strong>Método:</strong>{" "}
                    {sale.deliveryMethod === "proprio"
                      ? "Próprio vendedor"
                      : sale.deliveryMethod === "correios"
                      ? "Correios"
                      : sale.deliveryMethod}
                  </p>
                  {sale.deliveryDate && (
                    <p>
                      <strong>Data estimada:</strong>{" "}
                      {new Date(sale.deliveryDate).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  {sale.deliveryToday && (
                    <p>
                      <strong>Entrega:</strong>{" "}
                      <span className="delivery-today-badge">Hoje</span>
                    </p>
                  )}
                  {sale.deliveryToday &&
                    sale.deliveryTimeStart &&
                    sale.deliveryTimeEnd && (
                      <p>
                        <strong>Horário:</strong> {sale.deliveryTimeStart} às{" "}
                        {sale.deliveryTimeEnd}
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSales.length === 0 && (
        <div className="no-results">
          <p>Nenhuma venda encontrada com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
