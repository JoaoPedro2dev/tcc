import { useEffect, useState } from "react";

function BasicsInfos({ formData, onChange }) {
  const classes = [
    "Camisa",
    "Casaco",
    "Parte Inferior",
    "Vestido",
    "Conjunto",
    "Calçado",
    "Bolsa",
    "Acessório",
    "Joia",
  ];

  const subClasses = [
    ["Camiseta", "Regata", "Camisa Social", "Polo", "Blusa"],
    ["Jaqueta", "Moletom", "Blazer", "Cardigan"],
    ["Calça", "Short", "Saia", "Legging", "Bermuda"],
    ["Vestido Longo", "Vestido Curto", "Vestido Midi"],
    ["Conjunto Feminino", "Conjunto Masculino", "Macacão", "Macaquinho"],
    ["Tênis", "Bota", "Chinelo", "Sandália", "Rasteirinha"],
    ["Bolsa de Mão", "Mochila", "Pochete", "Carteira"],
    ["Boné", "Chapéu", "Óculos de Sol", "Cinto", "Relógio"],
    ["Brinco", "Colar", "Pulseira", "Anel"],
  ];

  const style = [
    "Casual",
    "Esportivo",
    "Social",
    "De Luxo",
    "Streetwear",
    "Vintage",
    "Minimalista",
    "Romântico",
    "Boho",
    "Urbano",
    "Clássico",
    "Moderno",
    "Rústico",
    "Rock",
    "Formal",
  ];

  const [categoryHandler, setCategoryHandler] = useState(classes[0]);

  function verifyClasses() {
    switch (categoryHandler) {
      case "Camisa":
        return subClasses[0];
      case "Casaco":
        return subClasses[1];
      case "Parte Inferior":
        return subClasses[2];
      case "Vestido":
        return subClasses[3];
      case "Conjunto":
        return subClasses[4];
      case "Calçado":
        return subClasses[5];
      case "Bolsa":
        return subClasses[6];
      case "Acessório":
        return subClasses[7];
      case "Joia":
        return subClasses[8];
      default:
        return [];
    }
  }

  const [subClassOptions, setSubClassOptions] = useState(subClasses[0]);

  useEffect(() => {
    setSubClassOptions(verifyClasses());
  }, [categoryHandler]);

  const [descQty, setDescQty] = useState(formData.description.length);

  return (
    <section className="basicsInfos borderRadius boxShadow ">
      <h1>Informações básicas</h1>

      <hr />

      <div className="displayRow">
        <p className="displayColumn">
          <label htmlFor="productCategory">
            Selecione a categoria do produto *
          </label>
          <select
            name="productCategory"
            id="productCategory"
            value={formData.category}
            onChange={(e) => {
              onChange("category", e.target.value);
            }}
          >
            {classes.map((item, key) => (
              <option key={key} value={item}>
                {item}
              </option>
            ))}
          </select>
          <span className="errorMsg">Houve um erro</span>
        </p>

        <p className="displayColumn">
          <label htmlFor="productSubclass">
            Selecione a subclasse do produto *
          </label>
          <select
            name="productSubclass"
            id="productSubclass"
            value={formData.subcategory}
            onChange={(e) => {
              onChange("subcategory", e.target.value);
            }}
          >
            {subClassOptions.map((value, key) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
          <span className="errorMsg">Houve um erro</span>
        </p>
      </div>

      <div className="displayColumn">
        <label htmlFor="productName">Nome do produto *</label>
        <input
          type="text"
          name="productName"
          id="productName"
          placeholder="Adicione um nome ao seu produto"
          value={formData.name}
          onChange={(e) => {
            onChange("name", e.target.value);
          }}
        />
        <span className="errorMsg">Houve um erro</span>
      </div>

      <div className="displayRow">
        <p className="displayColumn">
          <label htmlFor="productBrand">Marca do produto *</label>
          <input
            type="text"
            name="productBrand"
            id="productBrand"
            placeholder="Adicione a marca do seu produto"
            value={formData.brand}
            onChange={(e) => {
              onChange("brand", e.target.value);
            }}
          />
          <span className="errorMsg">Houve um erro</span>
        </p>

        <p className="displayColumn">
          <label htmlFor="productStyle">
            Adicione o estilo do seu produto *
          </label>
          <select
            name="productStyle"
            id="productStyle"
            value={formData.style}
            onChange={(e) => {
              onChange("style", e.target.value);
            }}
          >
            {style.map((value, key) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
          <span className="errorMsg">Houve um erro</span>
        </p>
      </div>

      <div className="displayColumn">
        <p>
          <label htmlFor="productDescription">
            Adicione a descrição do seu produto *
          </label>
          <span>({descQty}/300máx)</span>
        </p>
        <textarea
          name="productDescription"
          id="productDescription"
          value={formData.description}
          onChange={(e) => {
            onChange("description", e.target.value);
            setDescQty(e.target.value.length);
          }}
        ></textarea>
        <span className="errorMsg">Houve um erro</span>
      </div>
    </section>
  );
}

export default BasicsInfos;
