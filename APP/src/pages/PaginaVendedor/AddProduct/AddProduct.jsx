import ProductSize from "./ProductSize/ProductSize.jsx";
import "./AddProduct.css";
import BasicsInfos from "./BasicsInfos/BasicsInfos.jsx";
import PriceLogistics from "./PriceLogistics/PriceLogistics.jsx";
import ProductFeatures from "./ProductFeatures/ProductFeatures.jsx";
import ProductImages from "./ProductImages/ProductImages.jsx";
import { useState } from "react";

function AddProduct() {
  const id = 0;

  const [formData, setFormData] = useState({
    id: 1,
    name: "Teste",
    category: "Casaco",
    subcategory: "",
    brand: "Marca de teste",
    style: "Social",
    description: "Descrição de teste",
    condiction: "Seminovo",
    genre: "Unissex",
    stock: [
      {
        nameColor: "Vermelho",
        sizes: [
          { size: "GG", qty: 1 },
          { size: "PP", qty: 1 },
        ],
      },
      {
        nameColor: "Azul",
        sizes: [{ size: "GG", qty: 1 }],
      },
      {
        nameColor: "Rosa",
        sizes: [{ size: "P", qty: 1 }],
      },
    ],
    price: 1,
    shipping: 2,
    deliveryTime: 3,
    imagens: [],
  });

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.clear();
    console.log("Dados enviados:", formData);
  };

  return (
    <div id="addProductBody">
      <BasicsInfos formData={formData} onChange={handleFormChange} />

      <ProductFeatures formData={formData} onChange={handleFormChange} />

      <ProductSize formData={formData} onChange={handleFormChange} />

      <PriceLogistics formData={formData} onChange={handleFormChange} />

      <ProductImages formData={formData} onChange={handleFormChange} />

      <div>
        {id ? (
          <button>SALVAR ALTERAÇÕES</button>
        ) : (
          <button onClick={handleSubmit}>CADASTRAR PRODUTOS</button>
        )}

        <button>CANCELAR</button>
      </div>
    </div>
  );
}

export default AddProduct;
