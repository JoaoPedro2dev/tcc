import "./FilterMenu.css";

function FilterMenu() {
  const filterCategories = {
    condition: {
      title: "Condição",
      options: ["Novo", "Seminovo", "Usado"],
    },
    gender: {
      title: "Gênero",
      options: ["Masculino", "Feminino", "Unissex", "Infantil"],
    },
    colors: {
      title: "Cores",
      options: [
        "Preto",
        "Branco",
        "Azul",
        "Vermelho",
        "Verde",
        "Rosa",
        "Amarelo",
        "Cinza",
        "Marrom",
      ],
    },
    sizes: {
      title: "Tamanhos",
      options: ["PP", "P", "M", "G", "GG", "XG", "XXG"],
    },
  };

  return (
    <>
      <button className="mobile-filter-toggle">Filtros (3)</button>

      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Filtros</h2>
          <button className="clear-filters-btn">Limpar Tudo</button>
        </div>

        <div className="sidebar-content">
          {Object.entries(filterCategories).map(([categoryKey, category]) => (
            <div key={categoryKey} className="filter-section">
              <h3 className="filter-title">{category.title}</h3>
              <div className="filter-options">
                {category.options.map((option) => {
                  return (
                    <label key={option} className="filter-option">
                      <input type="checkbox" className="filter-checkbox" />
                      <span className="checkmark"></span>
                      <span className="option-text">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="apply-filters-btn">Aplicar Filtros (3)</button>
        </div>

        <div className="sidebar-overlay"></div>
      </div>
    </>
  );
}

export default FilterMenu;
