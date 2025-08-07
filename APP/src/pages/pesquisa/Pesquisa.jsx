import { Link, useSearchParams } from "react-router-dom";
import Header from "../../componentes/Header/Header";
import Card from "../../componentes/Card/Card";
import FilterMenu from "./FilterMenu/FilterMenu.jsx";
import "./pesquisa.css";
import Footer from "../../componentes/Footer/Footer.jsx";
import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";

function Pesquisa() {
  const [searchParams] = useSearchParams();
  const s = searchParams.get("s").toLowerCase().trim();

  const [dataProducts, setDataProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/tcc/API/search?search=${s}`)
      .then((r) => r.json())
      .then((data) => {
        setDataProducts(data);
        console.log(data);
      });
  }, [s]);

  return (
    <div id="pesquisaContainer">
      <Header value={s} />
      {dataProducts && dataProducts.length > 0 ? (
        <section id="itensInfos">
          <div id="itensQnt">
            <p>
              {dataProducts.length} Resultados encontrados para "
              <span>
                {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
              </span>
              "
            </p>
          </div>
          <div className="boxShadow">
            <FilterMenu />
            <div id="itensContain">
              {dataProducts.map((item, key) => (
                <Card key={key} item={item} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section id="msgmContainer">
          <div id="msgm">
            <SearchX id="searchIcon" />
            <div>
              <strong>
                Não encontramos produtos relacionados a{" "}
                {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
              </strong>
              <ul>
                <li>Sua busca esta correta?</li>
                <li>Tente utilizar palavras mais simples</li>
                <li>
                  Caso não consiga procure na{" "}
                  <Link id="link" to={"/"}>
                    página principal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}

export default Pesquisa;
