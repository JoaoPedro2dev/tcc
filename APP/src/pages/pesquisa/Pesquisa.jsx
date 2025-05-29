import { Link, useSearchParams } from "react-router-dom";
import Header from "../../componentes/Header/Header";
import tenis from "../../json/tenis.json";
import Card from "../../componentes/Card/Card";
import "./pesquisa.css";
import Footer from "../../componentes/Footer/Footer.jsx";
import { SearchX } from "lucide-react";

function Pesquisa() {
  const [searchParams] = useSearchParams();
  const s = searchParams.get("s").toLowerCase().trim();

  const itens = tenis.filter((i) => {
    return (
      i.nome.toLowerCase().includes(s) ||
      i.categoria.toLowerCase().includes(s) ||
      i.descricao.toLowerCase().includes(s) ||
      i.cores.some((cor) => cor.toLowerCase().includes(s))
    );
  });

  return (
    <div id="pesquisaContainer">
      <Header value={s} />
      {itens.length > 0 ? (
        <section id="itensInfos">
          <div id="itensQnt">
            <p>
              {itens.length} Resultados encontrados para "
              <span>
                {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
              </span>
              "
            </p>
          </div>
          <div id="itensContain">
            {itens.map((item, key) => (
              <Card key={key} item={item} />
            ))}
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
