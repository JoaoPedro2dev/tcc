import { useState, useEffect } from "react";
import "./ProductSize.css";

function ProductSize({ formData, onChange }) {
  // Configuração estática dos tamanhos disponíveis
  const sizes = [
    { label: "PP", name: "PP" },
    { label: "P", name: "P" },
    { label: "M", name: "M" },
    { label: "G", name: "G" },
    { label: "GG", name: "GG" },
    { label: "XG", name: "XG" },
  ];

  // Configuração estática das cores disponíveis
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

  // Estado principal do estoque - estrutura única e consistente
  // Cada item tem: { nameColor: string, sizes: [{ size: string, qty: number }] }
  const [stock, setStock] = useState(formData?.stock || []);

  // Estados derivados para controle da UI
  // Array simples com nomes das cores selecionadas
  const [selectedColors, setSelectedColors] = useState([]);
  // Array simples com nomes dos tamanhos selecionados
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Efeito para inicializar os estados derivados baseado no estoque inicial
  // Executa apenas quando o componente monta ou quando formData.stock muda
  useEffect(() => {
    // Extrai cores que já existem no estoque
    const existingColors = stock.map((item) => item.nameColor);
    setSelectedColors(existingColors);

    // Extrai todos os tamanhos únicos que já existem no estoque
    // Usa Set para eliminar duplicatas e depois converte para array
    const existingSizes = Array.from(
      new Set(
        stock.flatMap((item) => item.sizes.map((sizeItem) => sizeItem.size))
      )
    );
    setSelectedSizes(existingSizes);
  }, [formData?.stock]); // Reexecuta quando formData.stock muda

  // Efeito para notificar mudanças no estoque para o componente pai
  // Permite que o componente pai seja notificado sempre que o estoque muda
  useEffect(() => {
    onChange("stock", stock);
  }, [stock]);

  /**
   * Manipula a seleção/deseleção de cores
   * Quando uma cor é selecionada: adiciona ao selectedColors e cria entrada no stock
   * Quando uma cor é deselecionada: remove do selectedColors e remove do stock
   * @param {string} colorName - Nome da cor a ser adicionada/removida
   */
  const handleColorChange = (colorName) => {
    const isSelected = selectedColors.includes(colorName);

    if (isSelected) {
      // Remove a cor da seleção
      setSelectedColors((prev) => prev.filter((color) => color !== colorName));

      // Remove a cor do estoque (remove toda a entrada da cor)
      setStock((prev) => prev.filter((item) => item.nameColor !== colorName));
    } else {
      // Adiciona a cor à seleção
      setSelectedColors((prev) => [...prev, colorName]);

      // Cria entrada no estoque para a nova cor com todos os tamanhos selecionados
      // Cada tamanho começa com quantidade 0
      const newStockItem = {
        nameColor: colorName,
        sizes: selectedSizes.map((size) => ({ size, qty: 0 })),
      };

      setStock((prev) => [...prev, newStockItem]);
    }
  };

  /**
   * Manipula a seleção/deseleção de tamanhos
   * Quando um tamanho é selecionado: adiciona ao selectedSizes e adiciona a todas as cores
   * Quando um tamanho é deselecionado: remove do selectedSizes e remove de todas as cores
   * @param {string} sizeName - Nome do tamanho a ser adicionado/removido
   */
  const handleSizeChange = (sizeName) => {
    const isSelected = selectedSizes.includes(sizeName);

    if (isSelected) {
      // Remove o tamanho da seleção
      setSelectedSizes((prev) => prev.filter((size) => size !== sizeName));

      // Remove o tamanho de todas as cores no estoque
      // Mantém as cores, mas remove apenas este tamanho específico
      setStock((prev) =>
        prev.map((item) => ({
          ...item,
          sizes: item.sizes.filter((sizeItem) => sizeItem.size !== sizeName),
        }))
      );
    } else {
      // Adiciona o tamanho à seleção
      setSelectedSizes((prev) => [...prev, sizeName]);

      // Adiciona o tamanho a todas as cores existentes no estoque
      // Cada nova entrada de tamanho começa com quantidade 0
      setStock((prev) =>
        prev.map((item) => ({
          ...item,
          sizes: [...item.sizes, { size: sizeName, qty: 0 }],
        }))
      );
    }
  };

  /**
   * Atualiza a quantidade de estoque para uma cor e tamanho específicos
   * Encontra a cor no estoque, depois encontra o tamanho dentro dessa cor
   * e atualiza apenas a quantidade desse item específico
   * @param {string} colorName - Nome da cor
   * @param {string} sizeName - Nome do tamanho
   * @param {string} quantity - Nova quantidade (vem como string do input)
   */
  const handleStockQuantityChange = (colorName, sizeName, quantity) => {
    // Converte para número, defaulta para 0 se inválido
    const numQuantity = parseInt(quantity) || 0;

    setStock((prev) =>
      prev.map((item) => {
        // Só atualiza o item da cor correspondente
        if (item.nameColor === colorName) {
          return {
            ...item,
            sizes: item.sizes.map((sizeItem) =>
              // Só atualiza o tamanho correspondente
              sizeItem.size === sizeName
                ? { ...sizeItem, qty: numQuantity }
                : sizeItem
            ),
          };
        }
        // Retorna o item inalterado se não for a cor procurada
        return item;
      })
    );
  };

  /**
   * Calcula o total de estoque para uma cor específica
   * Soma todas as quantidades de todos os tamanhos dessa cor
   * @param {string} colorName - Nome da cor
   * @returns {number} Total de unidades para a cor
   */
  const getColorTotal = (colorName) => {
    const colorItem = stock.find((item) => item.nameColor === colorName);
    if (!colorItem) return 0;

    return colorItem.sizes.reduce((sum, sizeItem) => sum + sizeItem.qty, 0);
  };

  /**
   * Calcula o total geral de estoque
   * Soma todas as quantidades de todas as cores e tamanhos
   * @returns {number} Total de unidades no estoque
   */
  const getTotalStock = () => {
    return stock.reduce(
      (total, item) =>
        total + item.sizes.reduce((sum, sizeItem) => sum + sizeItem.qty, 0),
      0
    );
  };

  /**
   * Obtém a quantidade de estoque para uma cor e tamanho específicos
   * Usado para popular os valores dos inputs de quantidade
   * @param {string} colorName - Nome da cor
   * @param {string} sizeName - Nome do tamanho
   * @returns {number} Quantidade em estoque
   */
  const getStockQuantity = (colorName, sizeName) => {
    const colorItem = stock.find((item) => item.nameColor === colorName);
    if (!colorItem) return 0;

    const sizeItem = colorItem.sizes.find((size) => size.size === sizeName);
    return sizeItem ? sizeItem.qty : 0;
  };

  return (
    <section id="productSizeBody" className="borderRadius">
      <h1>Tamanhos e cores</h1>
      <hr />

      <div className="displayRow">
        {/* Seção de seleção de tamanhos */}
        <div className="displayColumn">
          <strong>Tamanhos disponíveis</strong>
          <div>
            {sizes.map((size) => (
              <p key={size.name}>
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size.name)}
                  onChange={() => handleSizeChange(size.name)}
                  name={size.name}
                  id={size.name}
                />
                <label htmlFor={size.name}>{size.label}</label>
              </p>
            ))}
          </div>
        </div>

        {/* Seção de seleção de cores */}
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
      </div>

      {/* Seção de controle de estoque - só aparece se há cores e tamanhos selecionados */}
      {selectedColors.length > 0 && selectedSizes.length > 0 && (
        <div>
          <strong>Controle de estoque</strong>

          {/* Para cada cor selecionada, mostra os inputs de quantidade */}
          {selectedColors.map((colorName) => (
            <section key={colorName} className="borderRadius">
              <p>
                {/* Indicador visual da cor */}
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

              <div className="displayRow">
                {/* Para cada tamanho selecionado, mostra input de quantidade */}
                {selectedSizes.map((sizeName) => (
                  <p key={sizeName}>
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

              {/* Total para a cor específica */}
              <p>
                Total para {colorName}: {getColorTotal(colorName)} unidades
              </p>
            </section>
          ))}

          {/* Total geral do estoque */}
          <div id="totalQntDisplay">
            <strong>Estoque total: {getTotalStock()} unidades</strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductSize;
