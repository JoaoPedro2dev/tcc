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
  // shootCartCounter,
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

  const [qtyIten, setQtyIten] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  function addToCart() {
    const url = `http://localhost/tcc/API/POST/cart-item-add?user_id=${1}&product_id=${
      data.id
    }&qty=${qtyIten ?? 1}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setBtnLoading(true);

        if (data == true) {
          setBtnLoading(false);
          setAddedToCart(true); // adiciona a classe
          setTimeout(() => {
            setAddedToCart(false); // remove a classe depois de 2s
          }, 2000);

          // shootCartCounter();
        }
      })
      .catch((error) => {
        console.log(error);
        setBtnLoading(false);
      });
  }

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

            <Contador
              isCart={false}
              maxCount={data.stockTotal}
              qtyIten={qtyIten}
              setQtyIten={setQtyIten}
            />

            <div id="buttonsBox">
              <button>Comprar agora</button>

              <button
                id="addToCartBtn"
                className={
                  btnLoading
                    ? "loading-button"
                    : addedToCart
                    ? "clicked-button"
                    : ""
                }
                onClick={addToCart}
                disabled={btnLoading || addedToCart}
              >
                {btnLoading
                  ? ""
                  : addedToCart
                  ? "Produto adicionado"
                  : "Adicionar ao carrinho"}
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

      {/* {feedback} */}
    </div>
  );
}

export default Venda;
