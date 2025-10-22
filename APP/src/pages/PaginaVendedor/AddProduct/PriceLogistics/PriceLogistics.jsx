import { useEffect } from "react";
import "./PriceLogistics.css";
import { useNavigate } from "react-router-dom";

function PriceLogistics({ formData, errors = false, removeError, onChange }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const scrollElement = document.querySelector(".errorElement");
      scrollElement?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [errors]);

  return (
    <section
      id="priceLogisticsBody"
      className="basicsInfos borderRadius boxShadow"
    >
      <h1>Preço e logística</h1>
      <hr />

      <div className="displayRow">
        <p className="displayColumn">
          <label htmlFor="productPrice">Valor do produto * (R$)</label>
          <input
            type="number"
            name="productPrice"
            id="productPrice"
            className={errors.price ? "errorElement" : ""}
            min={0}
            placeholder="Digite o valor do seu produto"
            value={formData.price}
            onChange={(e) => {
              onChange("price", Number(e.target.value));
              removeError("price");
            }}
          />
          {errors.price && <span className="errorMsg">{errors.price}</span>}

          {formData?.promotionPrice && (
            <>
              <label htmlFor="productPrice" style={{ marginTop: "8px" }}>
                Valor atual de promoção
              </label>
              <input
                type="number"
                name="productPrice"
                id="productPrice"
                min={0}
                value={formData.promotionPrice}
                onChange={(e) => {
                  onChange("price", Number(e.target.value));
                  removeError("price");
                }}
                readOnly
              />
            </>
          )}

          {formData.id && (
            <button
              id="addPromotionBtn"
              onClick={() => {
                navigate("/paginavendedor/editar-produto/adicionar-promocao", {
                  state: formData.id,
                });
              }}
            >
              {formData?.promotionPrice
                ? "Editar Promoção"
                : "Adicionar Promoção"}
            </button>
          )}
        </p>

        <p className="displayColumn">
          <label htmlFor="productShipping">Valor do frete * (R$)</label>
          <input
            type="number"
            name="productShipping"
            id="productShipping"
            className={errors.shippingCost ? "errorElement" : ""}
            min={0}
            placeholder="Digite o valor do frete do seu produto"
            value={formData.shippingCost}
            onChange={(e) => {
              onChange("shippingCost", Number(e.target.value));
              removeError("shippingCost");
            }}
          />
          {errors.shippingCost && (
            <span className="errorMsg">{errors.shippingCost}</span>
          )}
        </p>

        <p className="displayColumn">
          <label htmlFor="productShipping">Tempo para entrega * (Dias)</label>
          <input
            type="number"
            step={1}
            name="productShipping"
            id="productShipping"
            className={errors.deliveryTime ? "errorElement" : ""}
            placeholder="Digite o tempo máximo de entrega para o produto"
            min={1}
            value={formData.deliveryTime}
            onChange={(e) => {
              onChange("deliveryTime", Number(e.target.value));
              removeError("deliveryTime");
            }}
          />
          {errors.deliveryTime && (
            <span className="errorMsg">{errors.deliveryTime}</span>
          )}
        </p>
      </div>
    </section>
  );
}

export default PriceLogistics;
