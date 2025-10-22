import { useEffect } from "react";
import "./ProductFeatures.css";

function ProductFeatures({ formData, errors = false, removeError, onChange }) {
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
    <section id="productFeaturesBody" className=" borderRadius boxShadow ">
      <h1>Características do produto</h1>
      <hr />
      <div className="displayRow">
        <div className="displayColumn">
          <strong>Estado do produto</strong>
          <div
            className={
              errors.condition ? "displayColumn errorElement" : "displayColumn"
            }
          >
            <p>
              <input
                type="radio"
                name="productStatus"
                className="productStatus"
                value={"Novos"}
                checked={formData.condition === "Novos"}
                onChange={(e) => {
                  onChange("condition", e.target.value);
                  removeError("condition");
                }}
              />
              <span>Novo</span>
            </p>

            <p>
              <input
                type="radio"
                name="productStatus"
                className="productStatus"
                value={"Seminovos"}
                checked={formData.condition === "Seminovos"}
                onChange={(e) => {
                  onChange("condition", e.target.value);
                  removeError("condition");
                }}
              />
              <span>Seminovo</span>
            </p>

            <p>
              <input
                type="radio"
                name="productStatus"
                className="productStatus"
                value="Usados"
                checked={formData.condition === "Usados"}
                onChange={(e) => {
                  onChange("condition", e.target.value);
                  removeError("condition");
                }}
              />
              <span>Usado</span>
            </p>
          </div>
          {errors.condition && (
            <span className="errorMsg">{errors.condition}</span>
          )}
        </div>

        <div className="displayColumn">
          <strong htmlFor="">Gênero do produto</strong>
          <div
            className={
              errors.gender ? "displayColumn errorElement" : "displayColumn"
            }
          >
            <p>
              <input
                type="radio"
                name="productGenre"
                className="productGenre"
                value="Masculino"
                checked={formData.gender === "Masculino"}
                onChange={(e) => {
                  onChange("gender", e.target.value);
                  removeError("gender");
                }}
              />
              <span>Masculino</span>
            </p>

            <p>
              <input
                type="radio"
                name="productGenre"
                className="productGenre"
                value="Feminino"
                checked={formData.gender === "Feminino"}
                onChange={(e) => {
                  onChange("gender", e.target.value);
                  removeError("gender");
                }}
              />
              <span>Feminino</span>
            </p>

            <p>
              <input
                type="radio"
                name="productGenre"
                className="productGenre"
                value="Unissex"
                checked={formData.gender === "Unissex"}
                onChange={(e) => {
                  onChange("gender", e.target.value);
                  removeError("gender");
                }}
              />
              <span>Unissex</span>
            </p>
          </div>
          {errors.gender && <span className="errorMsg">{errors.gender}</span>}
        </div>
      </div>
    </section>
  );
}

export default ProductFeatures;
