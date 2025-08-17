import { useEffect, useState } from "react";
import "./App.css";
import Carousel from "./componentes/Carousel/Carousel.jsx";
import Footer from "./componentes/Footer/Footer.jsx";
import Header from "./componentes/Header/Header.jsx";
import Prateleira from "./componentes/Prateleira/Prateleira.jsx";
import Loading from "./componentes/Loading/Loading.jsx";

const categorys = [
  "Camisetas",
  "Calças",
  "Calçados",
  "Acessórios",
  "Shorts",
  "Infantil",
];

function App() {
  function criarPrateleira(categoria, itens) {
    const cards = itens.filter((item) => item.category === categoria);
    return <Prateleira title={categoria} itens={cards} />;
  }

  const [dataProducts, setDataProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost/tcc/API/")
      .then((r) => r.json())
      .then((data) => {
        setLoading(true);
        if (data) {
          setLoading(false);
          setDataProducts(data);
          console.log(data);
        }
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Header />
      <Carousel />
      <section>
        {dataProducts.length > 0 &&
          categorys.map((category, index) => (
            <div key={index}>{criarPrateleira(category, dataProducts)}</div>
          ))}
      </section>
      <Footer />
    </div>
  );
}

export default App;
