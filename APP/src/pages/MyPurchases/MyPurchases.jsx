import { useEffect, useState } from "react";
import { Search, Filter, ShoppingBag } from "lucide-react";
// import Header from "../../components/Header/Header";
import Header from "../../componentes/Header/Header.jsx";
import PurchasesCard from "../../componentes/PurchasesCard/PurchasesCard.jsx";
import EmptyState from "../../componentes/EmptyState/EmptyState.jsx";
import LoadingSpinner from "../../componentes/LoadingSpinner/LoadingSpinner.jsx";
import "./MyPurchases.css";
import { useUser } from "../../context/UserContext.jsx";

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      try {
        setLoading(true);
        fetch("http://localhost/tcc/API/GET/compras", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            id: user.id,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            console.log(data);
            if (data.length > 0) {
              setPurchases(data);
            }
          })
          .catch();

        setError(null);
      } catch (err) {
        setError("Erro ao carregar suas compras. Tente novamente.");
        console.error("Error fetching purchases:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch = purchase.itens.some((item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus =
      statusFilter === "all" ||
      purchase.itens.some((item) => {
        if (statusFilter === "delivered")
          return item.status.toLowerCase() === "entregue";
        if (statusFilter === "shipping")
          return (
            item.status.toLowerCase().includes("transporte") ||
            item.status.toLowerCase().includes("preparação")
          );
        if (statusFilter === "cancelled")
          return item.status.toLowerCase().includes("cancelado");
        return true;
      });

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="main-content">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <span className="loading-text">Carregando suas compras...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Header />
        <div className="main-content">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />

      <div className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <ShoppingBag className="title-icon" />
            <h1 className="title-text">Minhas Compras</h1>
          </div>

          {/* Search and Filters */}
          <div className="filters-container">
            {/* Search Input */}
            <div className="search-container">
              <div className="search-icon-container">
                <Search className="search-icon" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquise por produtos..."
                className="search-input"
              />
            </div>

            {/* Status Filter */}
            <div className="filter-container">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos os status</option>
                <option value="delivered">Entregues</option>
                <option value="shipping">Em andamento</option>
                <option value="cancelled">Cancelados</option>
              </select>
              <div className="filter-icon-container">
                <Filter className="filter-icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredPurchases.length === 0 ? (
          <EmptyState
            title={
              searchTerm || statusFilter !== "all"
                ? "Nenhuma compra encontrada"
                : "Você ainda não fez nenhuma compra"
            }
            description={
              searchTerm || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca para encontrar suas compras."
                : "Quando você fizer uma compra, ela aparecerá aqui para acompanhamento."
            }
            actionText={
              searchTerm || statusFilter !== "all"
                ? "Limpar filtros"
                : "Explorar produtos"
            }
            onAction={() => {
              if (searchTerm || statusFilter !== "all") {
                setSearchTerm("");
                setStatusFilter("all");
              } else {
                // Navigate to products page
                console.log("Navigate to products");
              }
            }}
          />
        ) : (
          <div className="purchases-container">
            {filteredPurchases.map((purchase, index) => (
              <PurchasesCard key={index} purchase={purchase} />
            ))}

            {/* Results Summary */}
            <div className="results-summary">
              <p className="summary-text">
                {filteredPurchases.length === 1
                  ? "1 pedido encontrado"
                  : `${filteredPurchases.length} pedidos encontrados`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPurchases;
