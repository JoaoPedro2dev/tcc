import { useLocation } from "react-router-dom";
import Contador from "../../componentes/Contador/Contador.jsx";
import Footer from "../../componentes/Footer/Footer.jsx";
import Header from "../../componentes/Header/Header.jsx";
import Prateleira from "../../componentes/Prateleira/Prateleira.jsx";
import "./venda.css";
import { useEffect, useState } from "react";
import Feedback from "../../componentes/Feedback/Feedback";
import Comentarios from "../../componentes/Comentarios/Comentarios.jsx";

import tenis from "../../json/tenis.json";
import LinkPerfil from "../../componentes/LinkPerfil/LinkPerfil.jsx";
import {
  calculatinDelivery,
  monetaryFormatting,
} from "../../helpers/functions.jsx";
import Loading from "../../componentes/Loading/Loading.jsx";
import NotFound from "../notFound/NotFound.jsx";

import ImagesCarroussel from "./ImagesCarroussel/ImagesCarroussel.jsx";

function Venda() {
  const location = useLocation();
  const id = location.state;

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({});

  useEffect(() => {
    const url = `http://localhost/tcc/API/GET?id=${id}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        console.log("DATA API", data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const [feedback, setFeedback] = useState("");

  function addCart() {
    const addBtn = document.querySelector("#addToCart");

    addBtn.classList.add("clicked");
    addBtn.disabled = true;
    addBtn.textContent = "Produto adicionado";

    setTimeout(() => {
      addBtn.classList.remove("clicked");
      addBtn.disabled = false;
      addBtn.textContent = "Adicionar ao carrinho";
    }, 1200);

    let storage = localStorage.getItem("idItem");

    let itensCart;

    if (storage) {
      itensCart = JSON.parse(storage);
    } else {
      itensCart = [];
    }

    if (!itensCart.some((item) => item.id === data.id)) {
      itensCart.push({ id: data.id, qnt: qntItem });

      localStorage.setItem("idItem", JSON.stringify(itensCart));
      window.dispatchEvent(new Event("CarrinhoAtualizado"));
      window.dispatchEvent(new Event("countUpdate"));
    } else {
      const novosItens = itensCart.map((it, i) => {
        if (it.id === data.id) {
          let qnt = Number(qntItem);

          if (itensCart[i].qnt + qnt > 100) {
            if (itensCart[i].qnt + 1 <= 100) {
              return { ...it, qnt: itensCart[i].qnt + 1 };
            }

            return { ...it, qnt: itensCart[i].qnt };
          }

          return { ...it, qnt: itensCart[i].qnt + qnt };
        }

        return it;
      });

      localStorage.setItem("idItem", JSON.stringify(novosItens));
    }

    setFeedback(<Feedback text={"Produto adicionado!"} emoji={"🥳"} />);

    setTimeout(() => {
      setFeedback("");
    }, 1000);
  }

  let qntItem = 0;

  const qntValue = (value) => {
    qntItem = value;
  };

  function criarPrateleira(categoria, title) {
    const itens = tenis.filter((item) => item.categoria === categoria);
    return <Prateleira title={title} itens={itens} />;
  }

  if (loading) return <Loading />;

  if (!data) return <NotFound />;

  return (
    <div id="telaVenda">
      <Header />
      <section>
        <div id="content">
          <ImagesCarroussel images={data.images} />

          <div id="infosProduto">
            <LinkPerfil
              img={data.profilePhoto}
              name={data.sellerName}
              url={"/"}
            />
            <strong>{data.productName}</strong>
            <p>{data.description}</p>
            <strong>R${monetaryFormatting(data.price)}</strong>

            <div className="selectBox">
              <label htmlFor="sizeSeelct">Tamanho</label>
              <select id="sizeSeelct">
                {data.availableSizes.map((size, key) => (
                  <option key={key} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="selectBox">
              <label htmlFor="colorSelect">Cor</label>
              <select id="colorSelect">
                {data.availableColors.map((color, key) => (
                  <option key={key} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div id="compraBox">
            <span className="colorGray">
              {data.salesQuantity > 0
                ? "+" + (data.salesQuantity - 1)
                : data.salesQuantity}{" "}
              vendas
            </span>

            <p>
              Chegara até o dia{" "}
              <strong className="strong">
                {calculatinDelivery(data.deliveryTime)}
              </strong>{" "}
              comprando dentro de 24 horas
            </p>

            <p>
              Frete{" "}
              {data.shippingCost === 0 ? (
                <span className="colorGreen">Grátis</span>
              ) : (
                "de " + monetaryFormatting(data.shippingCost)
              )}
            </p>

            <Contador isCart={false} valueCont={qntValue} />

            <div id="buttonsBox">
              <button>Comprar agora</button>
              <button id="addToCart" onClick={addCart}>
                Adicionar ao carrinho
              </button>
            </div>

            <p>Garantia de até 30 dias após receber o produto</p>
          </div>
        </div>
      </section>

      <section>
        <Comentarios />
      </section>

      <section id="similar-items">
        {criarPrateleira("Camisetas", "Itens parecidos")}
      </section>

      <Footer />

      {feedback}
    </div>
  );
}

export default Venda;
