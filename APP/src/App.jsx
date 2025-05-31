import "./App.css";
import Carousel from "./componentes/Carousel/Carousel.jsx";
import Footer from "./componentes/Footer/Footer.jsx";
import Header from "./componentes/Header/Header.jsx";
import Prateleira from "./componentes/Prateleira/Prateleira.jsx";
import tenis from "./json/tenis.json";

function App() {
  function criarPrateleira(categoria, title) {
    const itens = tenis.filter((item) => item.categoria === categoria);
    return <Prateleira title={title} itens={itens} />;
  }

  return (
    <div>
      <Header />
      <Carousel />
      <section>
        <div>{criarPrateleira("casual", "Ofertas")}</div>
        <div>{criarPrateleira("esportivo", "Camisetas")}</div>
        <div>{criarPrateleira("luxo", "Calças")}</div>
        <div>{criarPrateleira("infantil", "Shorts")}</div>
        <div>{criarPrateleira("luxo", "Calçados")}</div>
        <div>{criarPrateleira("infantil", "Acessórios")}</div>
        <div>{criarPrateleira("infantil", "Infantil")}</div>
      </section>
      <Footer />
    </div>
  );
}

export default App;
