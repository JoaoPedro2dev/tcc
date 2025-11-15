import { useEffect, useState } from "react";

function BasicsInfos({
  formData,
  errors = false,
  removeError,
  onChange,
  setSelectedCategory,
}) {
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const scrollElement = document.querySelector(".errorElement");
      scrollElement?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [errors]);

  const classes = [
    "Camisas",
    "Casacos",
    "Calças",
    "Vestidos",
    "Conjuntos",
    "Calçados",
    "Bolsas",
    "Acessórios",
    "Infantil",
    "Shorts",
  ];

  const subClasses = [
    ["Camiseta", "Regata", "Camisa Social", "Polo", "Blusa"],
    ["Jaqueta", "Moletom", "Blazer", "Cardigan"],
    ["Calça", "Legging", "Bermuda"],
    ["Vestido Longo", "Vestido Curto", "Vestido Midi"],
    ["Conjunto Feminino", "Conjunto Masculino", "Macacão", "Macaquinho"],
    ["Tênis", "Bota", "Chinelo", "Sandália", "Rasteirinha"],
    ["Bolsa de Mão", "Mochila", "Pochete", "Carteira"],
    [
      "Boné",
      "Chapéu",
      "Óculos de Sol",
      "Cinto",
      "Relógio",
      "Brinco",
      "Colar",
      "Pulseira",
      "Anel",
    ],
    [
      "Camiseta",
      "Regata",
      "Camisa Social",
      "Polo",
      "Blusa",
      "Jaqueta",
      "Moletom",
      "Blazer",
      "Cardigan",
      "Calça",
      "Short",
      "Saia",
      "Legging",
      "Bermuda",
      "Vestido Longo",
      "Vestido Curto",
      "Vestido Midi",
      "Conjunto Feminino",
      "Conjunto Masculino",
      "Macacão",
      "Macaquinho",
      "Tênis",
      "Bota",
      "Chinelo",
      "Sandália",
      "Rasteirinha",
      "Bolsa de Mão",
      "Mochila",
      "Pochete",
    ],
    [
      "Short Jeans",
      "Short Moletom",
      "Short Sarja",
      "Short Esportivo",
      "Short Praia",
      "Short Alfaiataria",
      "Short Cintura Alta",
      "Short Cargo",
      "Short Fitness",
      "Short Social",
      "Bermuda Jeans",
      "Bermuda Moletom",
      "Bermuda Sarja",
      "Bermuda Tática",
      "Bermuda Praia",
      "Bermuda Ciclista",
      "Bermuda Esportiva",
      "Bermuda Cargo",
    ],
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

  const [descQty, setDescQty] = useState(formData.description?.length ?? 0);

  const [subClassOptions, setSubClassOptions] = useState(subClasses[0]);

  useEffect(() => {
    let category = formData.category || classes[0]; // usa a primeira categoria se não houver
    const categoryIndex = classes.indexOf(category);

    if (categoryIndex >= 0) {
      setSubClassOptions(subClasses[categoryIndex]);
      if (!formData.category) {
        // define categoria e subcategoria iniciais se não houver
        onChange("category", classes[0]);
        onChange("subCategory", subClasses[0][0]);
      } else {
        // atualiza apenas subcategoria
        onChange("subCategory", subClasses[categoryIndex][0]);
      }
    }
  }, [formData?.category]);

  return (
    <section className="basicsInfos borderRadius">
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
            className={errors.category ? "errorElement" : ""}
            value={formData.category}
            onChange={(e) => {
              onChange("category", e.target.value);
              setSelectedCategory(e.target.value);
              removeError("category");
            }}
          >
            {classes.map((item, key) => (
              <option key={key} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="errorMsg">{errors.category}</span>
          )}
        </p>

        <p className="displayColumn">
          <label htmlFor="productSubclass">
            Selecione a subcategoria do produto *
          </label>
          <select
            name="productSubclass"
            id="productSubclass"
            className={errors.subCategory ? "errorElement" : ""}
            value={formData.subCategory}
            onChange={(e) => {
              onChange("subCategory", e.target.value);
              removeError("subCategory");
            }}
          >
            {subClassOptions.map((value, key) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
          {errors.subCategory && (
            <span className="errorMsg">{errors.subCategory}</span>
          )}
        </p>
      </div>

      <div className="displayColumn">
        <label htmlFor="productName">Nome do produto *</label>
        <input
          type="text"
          name="productName"
          id="productName"
          className={errors.productName ? "errorElement" : ""}
          placeholder="Adicione um nome ao seu produto"
          value={formData.productName}
          onChange={(e) => {
            onChange("productName", e.target.value);
            removeError("productName");
          }}
        />
        {errors.productName && (
          <span className="errorMsg">{errors.productName}</span>
        )}
      </div>

      <div className="displayRow">
        <p className="displayColumn">
          <label htmlFor="productBrand">Marca do produto *</label>
          <input
            type="text"
            name="productBrand"
            id="productBrand"
            className={errors.brand ? "errorElement" : ""}
            placeholder="Adicione a marca do seu produto"
            value={formData.brand}
            onChange={(e) => {
              onChange("brand", e.target.value);
              removeError("brand");
            }}
          />
          {errors.brand && <span className="errorMsg">{errors.brand}</span>}
        </p>

        <p className="displayColumn">
          <label htmlFor="productStyle">
            Adicione o estilo do seu produto *
          </label>
          <select
            name="productStyle"
            id="productStyle"
            value={formData.style}
            className={errors.style ? "errorElement" : ""}
            onChange={(e) => {
              onChange("style", e.target.value);
              removeError("style");
            }}
          >
            <option value="">Selecione um estilo</option>
            {style.map((value, key) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
          {errors.style && <span className="errorMsg">{errors.style}</span>}
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
          className={errors.description ? "errorElement" : ""}
          value={formData.description}
          onChange={(e) => {
            onChange("description", e.target.value);
            setDescQty(e.target.value.length);
            removeError("description");
          }}
        ></textarea>
        {errors.description && (
          <span className="errorMsg">{errors.description}</span>
        )}
      </div>
    </section>
  );
}

export default BasicsInfos;
