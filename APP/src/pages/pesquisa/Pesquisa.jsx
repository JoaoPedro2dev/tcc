"use client";

import { Link, useSearchParams } from "react-router-dom";
import Header from "../../componentes/Header/Header";
import Card from "../../componentes/Card/Card";
import Footer from "../../componentes/Footer/Footer.jsx";
import { SearchX, SlidersHorizontal, SquareMenu, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./pesquisa.css";

function Pesquisa() {
  const [searchParams] = useSearchParams();
  const s = searchParams.get("s").toLowerCase().trim();

  const [dataProducts, setDataProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    colors: [],
    conditions: [],
    sizes: [],
    genders: [],
  });

  const tamanhosArray = [
    "Único", // Tamanho único
    "PP",
    "P",
    "M",
    "G",
    "GG",
    "XG", // Letras para roupas
    "34",
    "35",
    "36",
    "37",
    "39",
    "40",
    "41",
    "36",
    "38",
    "40",
    "42",
    "44",
    "46", // Numéricos para roupas
    "Grande",
    "Médio",
    "Pequeno", // Descritivos
  ];

  const coresArray = [
    { name: "Preto", hex: "#000000" },
    { name: "Branco", hex: "#FFFFFF" },
    { name: "Cinza", hex: "#808080" },
    { name: "Vermelho", hex: "#DC2626" },
    { name: "Azul", hex: "#2563EB" },
    { name: "Verde", hex: "#16A34A" },
    { name: "Amarelo", hex: "#EAB308" },
    { name: "Rosa", hex: "#EC4899" },
    { name: "Marrom", hex: "#92400E" },
    { name: "Bege", hex: "#D4A574" },
    { name: "Laranja", hex: "#F97316" },
    { name: "Roxo", hex: "#8B5CF6" },
    { name: "Lilás", hex: "#C084FC" },
    { name: "Turquesa", hex: "#14B8A6" },
    { name: "Verde-oliva", hex: "#6B8E23" },
    { name: "Cinza-claro", hex: "#D1D5DB" },
    { name: "Marfim", hex: "#FFFFF0" },
    { name: "Bordô", hex: "#800020" },
    { name: "Azul-marinho", hex: "#1E3A8A" },
    { name: "Salmão", hex: "#FA8072" },
    { name: "Menta", hex: "#98FF98" },
    { name: "Mostarda", hex: "#FFDB58" },
    { name: "Caramelo", hex: "#A97142" },
    { name: "Prata", hex: "#C0C0C0" },
    { name: "Dourado", hex: "#FFD700" },
  ];

  console.log("filtro", JSON.stringify(filters ?? []));

  useEffect(() => {
    fetch(
      `http://localhost/tcc/API/search?search=${s}&condictions=${JSON.stringify(
        filters.conditions ?? []
      )}&sizes=${JSON.stringify(filters.sizes ?? [])}&genders=${JSON.stringify(
        filters.genders ?? []
      )}&colors=${JSON.stringify(filters.colors ?? [])}`
    )
      .then((r) => r.json())
      .then((data) => {
        setDataProducts(data);
        console.log("mudou", data);
      });
  }, [s, filters]);

  const handleFilterChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      colors: [],
      conditions: [],
      sizes: [],
      genders: [],
    });
  };

  return (
    <div id="pesquisaContainer">
      <Header value={s} />
      {dataProducts && dataProducts.length > 0 ? (
        <section id="searchPageContent">
          {!showFilters && (
            <button
              id="openFilterSideBar"
              onClick={() => setShowFilters(true)}
              aria-label="Abrir filtros"
            >
              <SquareMenu strokeWidth={1.5} />
            </button>
          )}
          {showFilters && (
            <aside id="filterSidebar" className={showFilters ? "show" : ""}>
              <div id="filterHeader">
                <h3>Filtros</h3>
                <button
                  id="closeFiltersBtn"
                  onClick={() => {
                    setShowFilters(false);
                    clearFilters();
                  }}
                  aria-label="Fechar filtros"
                >
                  <X size={20} />
                </button>
              </div>

              <div id="filterContent">
                <button id="clearFiltersBtn" onClick={clearFilters}>
                  Limpar filtros
                </button>

                {/* Gênero */}
                <div className="filterGroup">
                  <h4>Gênero</h4>
                  <div className="filterOptions">
                    {["Masculino", "Feminino", "Unissex"].map((gender) => (
                      <label key={gender} className="filterCheckbox">
                        <input
                          type="checkbox"
                          checked={filters.genders.includes(gender)}
                          onChange={() => handleFilterChange("genders", gender)}
                        />
                        <span>{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condição */}
                <div className="filterGroup">
                  <h4>Condição</h4>
                  <div className="filterOptions">
                    {["Novos", "Seminovos", "Usados"].map((condition) => (
                      <label key={condition} className="filterCheckbox">
                        <input
                          type="checkbox"
                          checked={filters.conditions.includes(condition)}
                          onChange={() =>
                            handleFilterChange("conditions", condition)
                          }
                        />
                        <span>{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tamanhos */}
                <div className="filterGroup">
                  <h4>Tamanhos</h4>
                  <div className="filterOptions">
                    {tamanhosArray.map((size, key) => (
                      <label key={key} className="filterCheckbox">
                        <input
                          type="checkbox"
                          checked={filters.sizes.includes(size)}
                          onChange={() => handleFilterChange("sizes", size)}
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cores */}
                <div className="filterGroup">
                  <h4>Cores</h4>
                  <div className="colorFilterOptions">
                    {coresArray.map((color) => (
                      <label key={color.name} className="colorOption">
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color.name)}
                          onChange={() =>
                            handleFilterChange("colors", color.name)
                          }
                        />
                        <span
                          className="colorSwatch"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        ></span>
                        <span className="colorName">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          <main id="productsMain">
            <div id="searchHeader">
              <div id="searchInfo">
                <h2>
                  {dataProducts.length}{" "}
                  {dataProducts.length === 1 ? "resultado" : "resultados"}
                </h2>
                <p>
                  para "
                  <span className="searchTerm">
                    {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
                  </span>
                  "
                </p>
              </div>
              <button
                id="toggleFiltersBtn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={20} />
                Filtros
              </button>
            </div>

            <div id="productsGrid">
              {dataProducts.map((item, key) => (
                <Card key={key} item={item} />
              ))}
            </div>
          </main>
        </section>
      ) : (
        <section id="emptyState">
          <div id="emptyStateCard">
            <SearchX id="emptyIcon" size={80} strokeWidth={1.5} />
            <h2>Nenhum resultado encontrado</h2>
            <p className="searchQuery">
              para "{s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}"
            </p>
            <div id="suggestions">
              <p>Sugestões:</p>
              <ul>
                <li>Verifique se a busca está correta</li>
                <li>Tente utilizar palavras mais simples</li>
                <li>Use termos mais genéricos</li>
              </ul>
            </div>
            <Link to="/" id="backHomeLink">
              Voltar para a página principal
            </Link>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}

export default Pesquisa;
