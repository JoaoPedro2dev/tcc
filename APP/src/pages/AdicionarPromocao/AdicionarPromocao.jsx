"use client";

import { useState, useEffect } from "react";
import {
  // useLoaderData,
  useLocation,
  useNavigate,
  // useParams,
} from "react-router-dom";
import { ArrowLeft, Tag, Calendar, DollarSign, Save } from "lucide-react";
import "./adicionarPromocao.css";
import { calcStockTotal, monetaryFormatting } from "../../helpers/functions";
import FeedbackPopup from "../../componentes/Feedback/Feedback";

const AdicionarPromocao = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const productId = location.state;

  // Mock de produto - substituir por fetch real da API
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [removed, setRemoved] = useState(false);

  const [formData, setFormData] = useState({
    promotionStartDate: "",
    promotionEndDate: "",
    promotionPrice: "",
  });

  const [errors, setErrors] = useState({});
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    try {
      setLoading(true);
      fetch(`http://localhost/tcc/API/GET?id=${productId}`)
        .then((r) => r.json())
        .then((data) => {
          const images = JSON.parse(data.images);
          data.images = [images[0]];
          data.stockTotal = calcStockTotal(data);

          setProduto(data);

          if (data.promotionStartDate) {
            setFormData({
              promotionStartDate: data.promotionStartDate,
              promotionEndDate: data.promotionEndDate,
              promotionPrice: data.promotionPrice,
            });
          }

          setLoading(false);
        })
        .catch((error) => console.error(error));

      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (produto && formData.promotionPrice) {
      const priceNum = Number.parseFloat(produto.price);
      const promoNum = Number.parseFloat(formData.promotionPrice);

      if (promoNum > 0 && promoNum < priceNum) {
        const discount = ((priceNum - promoNum) / priceNum) * 100;
        setDiscountPercent(discount.toFixed(0));
      } else {
        setDiscountPercent(0);
      }
    }
  }, [formData.promotionPrice, produto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erro do campo ao editar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.promotionStartDate) {
      newErrors.promotionStartDate = "Data de início é obrigatória";
    } else if (formData.promotionStartDate < today) {
      newErrors.promotionStartDate =
        "Data de início não pode ser anterior a hoje";
    }

    if (!formData.promotionEndDate) {
      newErrors.promotionEndDate = "Data de término é obrigatória";
    } else if (formData.promotionEndDate <= formData.promotionStartDate) {
      newErrors.promotionEndDate =
        "Data de término deve ser posterior à data de início";
    }

    if (!formData.promotionPrice) {
      newErrors.promotionPrice = "Preço promocional é obrigatório";
    } else {
      const promoPrice = Number.parseFloat(formData.promotionPrice);
      const originalPrice = Number.parseFloat(produto.price);

      if (promoPrice <= 0) {
        newErrors.promotionPrice = "Preço deve ser maior que zero";
      } else if (promoPrice >= originalPrice) {
        newErrors.promotionPrice =
          "Preço promocional deve ser menor que o preço original";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      let form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value ?? "");
      });

      console.log("dados enviados", formData);

      form.append("product_id", productId);

      fetch("http://localhost/tcc/API/POST/adicionar-promocao", {
        method: "POST",
        body: form,
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data);

          if (data === true) {
            setSuccess(true);
          }
        });
    } catch (error) {
      console.error("Erro ao salvar promoção:", error);
      alert("Erro ao salvar promoção. Tente novamente.");
    }
  };

  const handleRemovePromotion = async () => {
    if (!window.confirm("Deseja realmente remover a promoção deste produto?")) {
      return;
    }

    try {
      fetch("http://localhost/tcc/API/POST/remover-promocao", {
        method: "POST",
        body: new URLSearchParams({ product_id: productId }),
      })
        .then((r) => r.json())
        .then((data) => {
          console.log("removido", data);
          if (data === true) {
            setRemoved(true);
          }
        })
        .catch((error) => {
          console.error("erro", error);
        });
    } catch (error) {
      console.error("Erro ao remover promoção:", error);
      alert("Erro ao remover promoção. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="promocao-loading">
        <div className="spinner"></div>
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="promocao-error">
        <p>Produto não encontrado</p>
        <button onClick={() => navigate(-1)} className="btn-voltar">
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="adicionar-promocao-container">
      {success && (
        <FeedbackPopup
          message="Promoção criada com sucesso"
          type="success"
          link={-1}
        />
      )}

      {removed && (
        <FeedbackPopup
          message="Promoção removida com sucesso"
          type="success"
          link={-1}
        />
      )}

      <div className="promocao-header">
        <button onClick={() => navigate(-1)} className="btn-voltar">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1>
          <Tag size={28} />
          Adicionar Promoção
        </h1>
      </div>

      <div className="promocao-content">
        {/* Card do Produto */}
        <div className="produto-info-card">
          <div className="produto-info-header">
            <h2>Produto Selecionado</h2>
          </div>
          <div className="produto-info-body">
            <img
              src={produto.images[0] || "/placeholder.svg"}
              alt={produto.productName}
              className="produto-thumbnail"
            />
            <div className="produto-details">
              <h3>{produto.productName}</h3>
              <p className="produto-categoria">{produto.category}</p>
              <div className="produto-price-info">
                <span className="label">Preço Original:</span>
                <span className="price-original">
                  R$ {Number.parseFloat(produto.price).toFixed(2)}
                </span>
              </div>

              {produto?.promotionPrice && (
                <div className="produto-price-info">
                  <span className="label">Preço Atual:</span>
                  <span className="price-original">
                    {monetaryFormatting(produto.promotionPrice)}
                  </span>
                </div>
              )}

              <div className="produto-stock-info">
                <span className="label">Estoque:</span>
                <span className="stock">{produto.stockTotal} unidades</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Promoção */}
        <form onSubmit={handleSubmit} className="promocao-form">
          <div className="form-section">
            <h2>Dados da Promoção</h2>

            {/* Período da Promoção */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="promotionStartDate">
                  <Calendar size={18} />
                  Data de Início *
                </label>
                <input
                  type="date"
                  id="promotionStartDate"
                  name="promotionStartDate"
                  value={formData.promotionStartDate}
                  onChange={handleChange}
                  className={errors.promotionStartDate ? "error" : ""}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.promotionStartDate && (
                  <span className="error-message">
                    {errors.promotionStartDate}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="promotionEndDate">
                  <Calendar size={18} />
                  Data de Término *
                </label>
                <input
                  type="date"
                  id="promotionEndDate"
                  name="promotionEndDate"
                  value={formData.promotionEndDate}
                  onChange={handleChange}
                  className={errors.promotionEndDate ? "error" : ""}
                  min={
                    formData.promotionStartDate ||
                    new Date().toISOString().split("T")[0]
                  }
                />
                {errors.promotionEndDate && (
                  <span className="error-message">
                    {errors.promotionEndDate}
                  </span>
                )}
              </div>
            </div>

            {/* Preço Promocional */}
            <div className="form-group">
              <label htmlFor="promotionPrice">
                <DollarSign size={18} />
                Preço Promocional *
              </label>
              <input
                type="number"
                id="promotionPrice"
                name="promotionPrice"
                value={formData.promotionPrice}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className={errors.promotionPrice ? "error" : ""}
              />
              {errors.promotionPrice && (
                <span className="error-message">{errors.promotionPrice}</span>
              )}
            </div>

            {/* Preview do Desconto */}
            {discountPercent > 0 &&
              !isNaN(
                Number.parseFloat(produto.price) -
                  Number.parseFloat(formData.promotionPrice)
              ) && (
                <div className="discount-preview">
                  <div className="discount-badge">
                    <span className="discount-value">
                      {discountPercent}% OFF
                    </span>
                  </div>
                  <div className="price-comparison">
                    <div className="price-item">
                      <span className="price-label">De:</span>
                      <span className="price-old">
                        R$ {Number.parseFloat(produto.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="price-item">
                      <span className="price-label">Por:</span>
                      <span className="price-new">
                        {monetaryFormatting(formData.promotionPrice)}
                      </span>
                    </div>
                    <div className="price-item">
                      <span className="price-label">Diferença:</span>
                      <span className="price-save">
                        {monetaryFormatting(
                          Number.parseFloat(produto.price) -
                            Number.parseFloat(formData.promotionPrice)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Botões de Ação */}
          <div className="form-actions">
            {produto.promotionStartDate && (
              <button
                type="button"
                onClick={handleRemovePromotion}
                className="btn-remove"
              >
                Remover Promoção
              </button>
            )}
            <button type="submit" className="btn-save">
              <Save size={20} />
              Salvar Promoção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdicionarPromocao;
