import { useEffect, useState } from "react";
import "./App.css";
import Carousel from "./componentes/Carousel/Carousel.jsx";
import Footer from "./componentes/Footer/Footer.jsx";
import Header from "./componentes/Header/Header.jsx";
import Prateleira from "./componentes/Prateleira/Prateleira.jsx";
import Loading from "./componentes/Loading/Loading.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import SpecialShelf from "./componentes/specialShelf/specialShelf.jsx";

const categorys = [
  "Camisas",
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
    setLoading(true);

    fetch("http://localhost/tcc/API/")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setLoading(false);
          setDataProducts(data);
        }
      })
      .catch((error) => {
        console.log("erro API", error);
      });
  }, []);

  // const [user, setUser] = useState();

  // useEffect(() => {
  //   fetch("http://localhost/tcc/API/GET/me", {
  //     credentials: "include", // MUITO IMPORTANTE para enviar cookies
  //   })
  //     .then((res) => res.json())
  //     .then((dataUser) => {
  //       if (dataUser.success === true) {
  //         console.log("Usuário logado: HEADER", dataUser.user);
  //         setUser(dataUser.user); // Exemplo: { id: 1, username: "teste" }
  //       } else {
  //         console.log("Erro:", dataUser);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [setUser]);

  if (loading) {
    return <Loading />;
  }

  // console.log(user);

  return (
    <div>
      <Header />
      <Carousel />
      <section>
        <SpecialShelf />
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
