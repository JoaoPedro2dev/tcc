import { useState, useEffect } from "react";
import "./ProductSize.css";

function ProductSize({
  formData,
  errors = false,
  removeError,
  onChange,
  category,
}) {
  // Map de classes para tamanhos
  const sizesByClass = {
    Camisas: ["PP", "P", "M", "G", "GG", "XG", "XGG", "XXG", "Plus Size"],
    Casacos: ["PP", "P", "M", "G", "GG", "XG", "XGG", "XXG", "Plus Size"],
    Calças: [
      "34",
      "36",
      "38",
      "40",
      "42",
      "44",
      "46",
      "48",
      "50",
      "52",
      "54",
      "Plus Size",
    ],
    Vestidos: ["PP", "P", "M", "G", "GG", "XG", "XGG", "Plus Size", "Único"],
    Conjuntos: ["PP", "P", "M", "G", "GG", "XG", "XGG", "Plus Size"],
    Saia: ["34", "36", "38", "40", "42", "44", "46", "G", "GG", "Plus Size"],
    Blusas: ["PP", "P", "M", "G", "GG", "XG", "XGG", "Plus Size"],
    Jaquetas: ["PP", "P", "M", "G", "GG", "XG", "XGG", "XXG"],
    Moletom: ["PP", "P", "M", "G", "GG", "XG", "XGG"],
    Shorts: ["PP", "P", "M", "G", "GG", "XG", "XGG", "Plus Size"],
    Bermudas: ["36", "38", "40", "42", "44", "46", "48", "50"],
    Calçados: [
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
    ],
    Bolsas: ["Pequeno", "Médio", "Grande", "Único"],
    Acessórios: ["Pequeno", "Médio", "Grande", "Único"],
    Bonés: ["P", "M", "G", "Ajustável", "Único"],
    Cintos: [
      "85 cm",
      "90 cm",
      "95 cm",
      "100 cm",
      "105 cm",
      "110 cm",
      "115 cm",
      "120 cm",
    ],
    RoupasIntimas: ["PP", "P", "M", "G", "GG", "XG"],
    Infantil: [
      "RN",
      "0-3M",
      "3-6M",
      "6-9M",
      "9-12M",
      "1",
      "2",
      "3",
      "4",
      "6",
      "8",
      "10",
      "12",
      "14",
      "16",
    ],
    Bebê: ["RN", "0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M"],
  };

  // Cores disponíveis
  const colors = [
    { label: "Vermelho", name: "Vermelho", color: "#FF0000" },
    { label: "Azul", name: "Azul", color: "#0000FF" },
    { label: "Verde", name: "Verde", color: "#008000" },
    { label: "Amarelo", name: "Amarelo", color: "#FFFF00" },
    { label: "Rosa", name: "Rosa", color: "#FFC0CB" },
    { label: "Preto", name: "Preto", color: "#000000" },
    { label: "Branco", name: "Branco", color: "#FFFFFF" },
    { label: "Cinza", name: "Cinza", color: "#808080" },
    { label: "Bege", name: "Bege", color: "#F5F5DC" },
    { label: "Marrom", name: "Marrom", color: "#8B4513" },

    // --- Tons adicionais muito usados na moda ---
    { label: "Bordô", name: "Bordô", color: "#800020" },
    { label: "Vinho", name: "Vinho", color: "#722F37" },
    { label: "Caramelo", name: "Caramelo", color: "#AF6E4D" },
    { label: "Terracota", name: "Terracota", color: "#E2725B" },
    { label: "Ouro", name: "Ouro", color: "#FFD700" },
    { label: "Prata", name: "Prata", color: "#C0C0C0" },
    { label: "Laranja", name: "Laranja", color: "#FFA500" },
    { label: "Verde Oliva", name: "Verde Oliva", color: "#808000" },
    { label: "Verde Militar", name: "Verde Militar", color: "#4B5320" },
    { label: "Verde Menta", name: "Verde Menta", color: "#98FF98" },
    { label: "Azul Marinho", name: "Azul Marinho", color: "#000080" },
    { label: "Azul Celeste", name: "Azul Celeste", color: "#87CEEB" },
    { label: "Azul Turquesa", name: "Azul Turquesa", color: "#40E0D0" },
    { label: "Lilás", name: "Lilás", color: "#C8A2C8" },
    { label: "Roxo", name: "Roxo", color: "#800080" },
    { label: "Lavanda", name: "Lavanda", color: "#E6E6FA" },
    { label: "Salmão", name: "Salmão", color: "#FA8072" },
    { label: "Coral", name: "Coral", color: "#FF7F50" },
    { label: "Champagne", name: "Champagne", color: "#F7E7CE" },
    { label: "Off White", name: "Off White", color: "#FAF9F6" },
    { label: "Areia", name: "Areia", color: "#DDD6B8" },
    { label: "Creme", name: "Creme", color: "#FFFDD0" },
    { label: "Grafite", name: "Grafite", color: "#383838" },
    { label: "Cáqui", name: "Cáqui", color: "#C3B091" },
    { label: "Mostarda", name: "Mostarda", color: "#FFDB58" },
    { label: "Petrol", name: "Petrol", color: "#355E7C" },
    { label: "Ciano", name: "Ciano", color: "#00FFFF" },
    { label: "Magenta", name: "Magenta", color: "#FF00FF" },
  ];

  // Tamanhos disponíveis para a classe selecionada
  const sizes = sizesByClass[category] || [];

  useEffect(() => {
    setSelectedSizes([]);
    setStock([]);
    setSelectedColors([]);
  }, [category]);

  // Estados principais
  const [stock, setStock] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    setStock(formData?.itenStock);
    setSelectedColors(formData?.itenStock?.map((item) => item.cor) || []);
  }, [formData]);

  // Inicializa seleção de cores e tamanhos
  useEffect(() => {
    const existingColors = stock.map((item) => item.cor || "");
    setSelectedColors(existingColors);

    const existingSizes = Array.from(
      new Set(stock.flatMap((item) => item.tamanhos.map((s) => s.tamanho)))
    );

    // handleColorChange();

    setSelectedSizes(existingSizes);
  }, [stock]);

  // Notifica mudanças do estoque para o pai
  useEffect(() => {
    // Evita loop infinito: só atualiza se for diferente do formData atual
    const isDifferent =
      JSON.stringify(stock) !== JSON.stringify(formData?.itenStock || []);

    if (isDifferent) {
      onChange("itenStock", stock);
    }
  }, [stock]);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const scrollElement = document.querySelector(".errorElement");
      scrollElement?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [errors]);

  // Seleção/deseleção de cores
  const handleColorChange = (colorName) => {
    const isSelected = selectedColors.includes(colorName);
    if (isSelected) {
      setSelectedColors((prev) => prev.filter((c) => c !== colorName));
      setStock((prev) => prev.filter((item) => item.cor !== colorName));
    } else {
      setSelectedColors((prev) => [...prev, colorName]);
      setStock((prev) => [
        ...prev,
        {
          cor: colorName,
          tamanhos: selectedSizes.map((tamanho) => ({ tamanho, qnt: 0 })),
          stockTotalColor: 0,
        },
      ]);
    }

    removeError("itenStock");
  };

  // Seleção/deseleção de tamanhos
  const handleSizeChange = (sizeName) => {
    const isSelected = selectedSizes.includes(sizeName);
    if (isSelected) {
      setSelectedSizes((prev) => prev.filter((s) => s !== sizeName));
      setStock((prev) =>
        prev.map((item) => ({
          ...item,
          tamanhos: item.tamanhos.filter((s) => s.tamanho !== sizeName),
        }))
      );
    } else {
      setSelectedSizes((prev) => [...prev, sizeName]);
      setStock((prev) =>
        prev.map((item) => ({
          ...item,
          tamanhos: [...item.tamanhos, { tamanho: sizeName, qnt: 0 }],
        }))
      );
    }

    removeError("itenStock");
  };

  // Atualiza quantidade do estoque
  const handleStockQuantityChange = (colorName, sizeName, quantity) => {
    const numQuantity = parseInt(quantity) || 0;

    setStock((prev) =>
      prev.map((item) => {
        if (item.cor === colorName) {
          const updatedTamanhos = item.tamanhos.map((s) =>
            s.tamanho === sizeName ? { ...s, qnt: numQuantity } : s
          );

          const stockTotalColor = updatedTamanhos.reduce(
            (sum, s) => sum + s.qnt,
            0
          );

          return {
            ...item,
            tamanhos: updatedTamanhos,
            stockTotalColor,
          };
        }
        return item;
      })
    );

    removeError("itenStock");
  };

  const getColorTotal = (colorName) => {
    const colorItem = stock.find((item) => item.cor === colorName);
    if (!colorItem) return 0;
    return colorItem.tamanhos.reduce((sum, s) => sum + s.qnt, 0);
  };

  const getTotalStock = () =>
    stock.reduce(
      (total, item) => total + item.tamanhos.reduce((sum, s) => sum + s.qnt, 0),
      0
    );

  const getStockQuantity = (colorName, sizeName) => {
    const colorItem = stock.find((item) => item.cor === colorName);
    if (!colorItem) return 0;
    const sizeItem = colorItem.tamanhos.find((s) => s.tamanho === sizeName);
    return sizeItem ? sizeItem.qnt : 0;
  };

  if (!category) {
    return null;
  }

  return (
    <section id="productSizeBody" className="borderRadius">
      <h1>Tamanhos e cores</h1>
      <hr />
      <div
        className={errors.itenStock ? "displayRow errorElement" : "displayRow"}
      >
        {/* Seleção de cores */}
        <div className="displayColumn">
          <strong>Cores disponíveis</strong>
          <div className="colors-container">
            {colors.map((color) => (
              <p key={color.name}>
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color.name)}
                  onChange={() => handleColorChange(color.name)}
                  name={color.name}
                  id={color.name}
                  style={{
                    accentColor: selectedColors.includes(color.name)
                      ? color.color
                      : "#ccc", // cor padrão quando desmarcado
                  }}
                />
                <label htmlFor={color.name}>{color.label}</label>
              </p>
            ))}
          </div>
        </div>

        {/* Seleção de tamanhos */}
        {selectedColors.length > 0 && (
          <div className="displayColumn">
            <strong>Tamanhos disponíveis</strong>
            <div className="sizes-container">
              {sizes.map((sizeName) => (
                <p key={sizeName}>
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(sizeName)}
                    onChange={() => handleSizeChange(sizeName)}
                    name={sizeName}
                    id={sizeName}
                  />
                  <label htmlFor={sizeName}>{sizeName}</label>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controle de estoque */}
      {selectedColors.length > 0 && selectedSizes.length > 0 && (
        <div className="stocks-container">
          <strong>Controle de estoque</strong>
          <div className="stocks-cards">
            {selectedColors.map((colorName) => (
              <section key={colorName} className="borderRadius">
                <p>
                  <span
                    style={{
                      display: "inline-block",
                      width: "20px",
                      height: "20px",
                      backgroundColor:
                        colors.find((c) => c.name === colorName)?.color ||
                        "gray",
                      marginRight: "8px",
                      border: "1px solid #ccc",
                    }}
                  ></span>
                  {colorName}
                </p>

                <div
                  className={
                    errors.itenStock ? "displayRow errorElement" : "displayRow "
                  }
                >
                  {selectedSizes.map((sizeName) => (
                    <p key={sizeName} className="">
                      <label htmlFor={`${colorName}-${sizeName}`}>
                        Tamanho: {sizeName}
                      </label>
                      <input
                        type="number"
                        id={`${colorName}-${sizeName}`}
                        placeholder="0"
                        min={0}
                        value={getStockQuantity(colorName, sizeName)}
                        onChange={(e) =>
                          handleStockQuantityChange(
                            colorName,
                            sizeName,
                            e.target.value
                          )
                        }
                      />
                    </p>
                  ))}
                </div>

                <p>
                  Total para {colorName}: {getColorTotal(colorName)} unidades
                </p>
              </section>
            ))}
          </div>

          <div id="totalQntDisplay">
            <strong>Estoque total: {getTotalStock()} unidades</strong>
          </div>
        </div>
      )}

      {errors.itenStock && <span className="errorMsg">{errors.itenStock}</span>}
    </section>
  );
}

export default ProductSize;
