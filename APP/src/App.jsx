import "./App.css";
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
      <div>{criarPrateleira("casual", "Tênis Casuais")}</div>
      <div>{criarPrateleira("esportivo", "Tênis Esportivos")}</div>
      <div>{criarPrateleira("luxo", "Tênis de luxo")}</div>
      <div>{criarPrateleira("infantil", "Tênis infantis")}</div>
      <Footer />
    </div>
  );
}

export default App;
