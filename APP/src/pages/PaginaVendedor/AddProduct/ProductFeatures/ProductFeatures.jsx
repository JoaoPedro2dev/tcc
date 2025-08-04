import "./ProductFeatures.css";

function ProductFeatures({ formData, onChnage }) {
  return (
    <section id="productFeaturesBody" className=" borderRadius boxShadow ">
      <h1>Características do produto</h1>

      <hr />

      <div className="displayRow">
        <div className="displayColumn">
          <strong>Estado do produto</strong>
          <div className="displayColumn">
            <p>
              <input
                type="radio"
                name="productStatus"
                className="productStatus"
                value={"Novo"}
                checked={formData.condiction === "Novo"}
                onChange={(e) => {
                  onChnage("condiction", e.target.value);
                }}
              />
              <span>Novo</span>
            </p>

            <p>
              <input
                type="radio"
                name="productStatus"
                className="productStatus"
                value={"Seminovo"}
                checked={formData.condiction === "Seminovo"}
                onChange={(e) => {
                  onChnage("condiction", e.target.value);
                }}
              />
              <span>Seminovo</span>
            </p>

            <p>
              <input
                type="radio"
                name="productStatus"
                className="productStatus"
                checked={formData.condiction === "Usado"}
                onChange={(e) => {
                  onChnage("condiction", e.target.value);
                }}
              />
              <span>Usado</span>
            </p>
          </div>
        </div>

        <div className="displayColumn">
          <strong htmlFor="">Gênero do produto</strong>
          <div className="displayColumn">
            <p>
              <input
                type="radio"
                name="productGenre"
                className="productGenre"
                checked={formData.genre === "Masculino"}
                onChange={(e) => {
                  onChnage("genre", e.target.value);
                }}
              />
              <span>Masculino</span>
            </p>

            <p>
              <input
                type="radio"
                name="productGenre"
                className="productGenre"
                checked={formData.genre === "Feminino"}
                onChange={(e) => {
                  onChnage("genre", e.target.value);
                }}
              />
              <span>Feminino</span>
            </p>

            <p>
              <input
                type="radio"
                name="productGenre"
                className="productGenre"
                checked={formData.genre === "Unissex"}
                onChange={(e) => {
                  onChnage("genre", e.target.value);
                }}
              />
              <span>Unissex</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductFeatures;
