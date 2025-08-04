import "./PriceLogistics";

function PriceLogistics({ formData, onChange }) {
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
            min={0}
            placeholder="Digite o valor do seu produto"
            value={formData.price}
            onChange={(e) => {
              onChange("price", Number(e.target.value));
            }}
          />
        </p>

        <p className="displayColumn">
          <label htmlFor="productShipping">Valor do frete * (R$)</label>
          <input
            type="number"
            name="productShipping"
            id="productShipping"
            min={0}
            placeholder="Digite o valor do frete do seu produto"
            value={formData.shipping}
            onChange={(e) => {
              onChange("shipping", Number(e.target.value));
            }}
          />
        </p>

        <p className="displayColumn">
          <label htmlFor="productShipping">Tempo para entrega * (Dias)</label>
          <input
            type="number"
            step={1}
            name="productShipping"
            id="productShipping"
            placeholder="Digite o tempo máximo de entrega para o produto"
            min={1}
            value={formData.deliveryTime}
            onChange={(e) => {
              onChange("deliveryTime", Number(e.target.value));
            }}
          />
        </p>
      </div>
    </section>
  );
}

export default PriceLogistics;
