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
    Camisas: ["PP", "P", "M", "G", "GG"],
    Casacos: ["PP", "P", "M", "G", "GG"],
    Calças: ["PP", "P", "M", "G", "GG"],
    Vestidos: ["PP", "P", "M", "G", "GG"],
    Conjuntos: ["PP", "P", "M", "G", "GG"],
    Calçados: [
      "30",
      "31",
      "32",
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
      "49",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "57",
      "58",
      "59",
      "60",
    ],
    Bolsas: ["Pequeno", "Médio", "Grande", "Único"],
    Acessórios: ["Pequeno", "Médio", "Grande", "Único"],
    Infantil: [
      "30",
      "31",
      "32",
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
      "49",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "57",
      "58",
      "59",
      "60",
    ],
    Shorts: ["PP", "P", "M", "G", "GG", "XG", "XGG"],
  };

  // Cores disponíveis
  const colors = [
    { label: "Vermelho", name: "Vermelho", color: "red" },
    { label: "Azul", name: "Azul", color: "blue" },
    { label: "Verde", name: "Verde", color: "green" },
    { label: "Amarelo", name: "Amarelo", color: "yellow" },
    { label: "Rosa", name: "Rosa", color: "pink" },
    { label: "Preto", name: "Preto", color: "black" },
    { label: "Branco", name: "Branco", color: "white" },
    { label: "Cinza", name: "Cinza", color: "gray" },
    { label: "Bege", name: "Bege", color: "beige" },
    { label: "Marrom", name: "Marrom", color: "brown" },
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
          <div>
            {colors.map((color) => (
              <p key={color.name}>
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color.name)}
                  onChange={() => handleColorChange(color.name)}
                  name={color.name}
                  id={color.name}
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
            <div>
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
        <div>
          <strong>Controle de estoque</strong>
          {selectedColors.map((colorName) => (
            <section key={colorName} className="borderRadius">
              <p>
                <span
                  style={{
                    display: "inline-block",
                    width: "20px",
                    height: "20px",
                    backgroundColor:
                      colors.find((c) => c.name === colorName)?.color || "gray",
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
                      {sizeName}
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
