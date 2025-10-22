import { useEffect, useState } from "react";
import { Search, History } from "lucide-react";
import Header from "../../componentes/Header/Header.jsx";
import LoadingSpinner from "../../componentes/LoadingSpinner/LoadingSpinner.jsx";
import EmptyState from "../../componentes/EmptyState/EmptyState.jsx";
import "./MyHistory.css";
import { useUser } from "../../context/UserContext.jsx";
import { formatarMonetario } from "../../helpers/functions.jsx";
import Footer from "../../componentes/Footer/Footer.jsx";
import { useNavigate } from "react-router-dom";

function MyHistory() {
  const navigate = new useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      try {
        setLoading(true);
        fetch(`http://localhost/tcc/API/GET/historio`, {
          method: "POST",
          body: new URLSearchParams({ id: user.id }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.length > 0) {
              setHistory(data);
              console.log(data);
            }
          })
          .catch(() => setError("Erro ao buscar histórico."));

        setError(null);
      } catch (err) {
        setError("Erro ao carregar histórico. Tente novamente.");
        console.error("Erro fetch:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  function deleteHistory(id_historico) {
    fetch(`http://localhost/tcc/API/POST/DELETE/historico`, {
      method: "POST",
      body: new URLSearchParams({
        id_historico: id_historico,
        user_id: user.id,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        setHistory((prev) =>
          prev.filter((h) => h.id_historico !== id_historico)
        );
      })
      .catch(() => setError("Erro ao excluir histórico."));
  }

  const filteredHistory = history.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="main-content">
          <div className="loading-container">
            <LoadingSpinner size="lg" />
            <span className="loading-text">Carregando histórico...</span>
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

  function visitItem(item_id) {
    navigate("/venda?", { state: item_id });
  }

  return (
    <div className="page-container">
      <Header />

      <div className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <History className="title-icon" />
            <h1 className="title-text">Meu Histórico</h1>
          </div>

          {/* Search */}
          <div className="filters-container">
            <div className="search-container">
              <div className="search-icon-container">
                <Search className="search-icon" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquise no histórico..."
                className="search-input"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredHistory.length === 0 ? (
          <EmptyState
            title={
              searchTerm
                ? "Nenhum produto encontrado"
                : "Você ainda não visualizou produtos"
            }
            description={
              searchTerm
                ? "Tente ajustar o termo de busca."
                : "Quando você visitar produtos, eles aparecerão aqui."
            }
            actionText={searchTerm ? "Limpar busca" : "Explorar produtos"}
            onAction={() => {
              if (searchTerm) {
                setSearchTerm("");
              } else {
                console.log("Navigate to products");
              }
            }}
          />
        ) : (
          <div className="history-container">
            {filteredHistory.map((item, index) => (
              <div
                key={index}
                className="history-card"
                onClick={() => {
                  visitItem(item.produto_id);
                }}
              >
                <img
                  src={item.images}
                  alt={item.productName}
                  className="history-img"
                />
                <div className="history-info">
                  <h3>{item.productName}</h3>
                  <p className="history-price">
                    {formatarMonetario(item.price)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistory(item.id_historico);
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyHistory;
