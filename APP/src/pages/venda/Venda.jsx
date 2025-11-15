import { useLocation, useNavigate } from "react-router-dom";
import Contador from "../../componentes/Contador/Contador.jsx";
import Footer from "../../componentes/Footer/Footer.jsx";
import Header from "../../componentes/Header/Header.jsx";
import Prateleira from "../../componentes/Prateleira/Prateleira.jsx";
import "./venda.css";
import { useEffect, useState } from "react";
import Feedback from "../../componentes/Feedback/Feedback";
import Comentarios from "../../componentes/Comentarios/Comentarios.jsx";

import LinkPerfil from "../../componentes/LinkPerfil/LinkPerfil.jsx";
import {
  calculatinDelivery,
  monetaryFormatting,
  // shootCartCounter,
} from "../../helpers/functions.jsx";
import Loading from "../../componentes/Loading/Loading.jsx";
import NotFound from "../notFound/NotFound.jsx";
import ImagesCarroussel from "./ImagesCarroussel/ImagesCarroussel.jsx";
import { useUser } from "../../context/UserContext.jsx";
import { useSales } from "../../context/SalesContext.jsx";

function Venda() {
  const { user } = useUser();

  const { setSales } = useSales();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state;

  const coresMap = {
    Vermelho: "#ff4d4d",
    Azul: "#4d79ff",
    Preto: "#000",
    Branco: "#fff",
  };

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  const [qtyIten, setQtyIten] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [corSelecionada, setCorSelecionada] = useState("");
  const [sizeSelecionado, setSizeSelecionado] = useState("");

  const [similarItems, setSimilarItems] = useState([]);

  const [fullDescription, setFullDescription] = useState(false);

  const tamanhosDaCor =
    data?.itenStock?.find((item) => item.cor === corSelecionada)?.tamanhos ||
    [];

  const stockDoTamanho =
    data?.itenStock
      ?.find((item) => item.cor === corSelecionada)
      ?.tamanhos.find((size) => size.tamanho === sizeSelecionado)?.qnt || 1;

  useEffect(() => {
    const url = `http://localhost/tcc/API/GET?id=${id}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setData(data);

        console.log("venda", data);
        if (data) {
          if (user?.id) {
            fetch("http://localhost/tcc/API/POST/historico", {
              method: "POST",
              body: new URLSearchParams({
                id_usuario: user.id,
                id_produto: data.id,
              }),
            });
          }

          getSimilarItems(data);
        }
        setLoading(false);
      });
    // .catch((error) => console.log(error));
  }, [id]);

  const getSimilarItems = (item) => {
    console.log("item ID", item);

    fetch(
      `http://localhost/tcc/API/GET/produtos/similar_items?category=${item.category}&id_produto=${item.id}`
    )
      .then((r) => r.json())
      .then((data) => {
        console.log("itens similares", data);
        if (data.length) {
          setSimilarItems(data);
        }
      });
    // .catch((error) => console.error(error));
  };

  function criarPrateleira(itens) {
    return <Prateleira title={"Itens parecidos"} itens={itens} />;
  }

  useEffect(() => {
    if (data?.itenStock?.length) {
      setCorSelecionada(data.itenStock[0].cor);
      setSizeSelecionado(data.itenStock[0].tamanhos[0].tamanho);
    }
  }, [data]);

  useEffect(() => {
    if (data?.itenStock?.length && corSelecionada) {
      const itemCor = data.itenStock.find(
        (item) => item.cor === corSelecionada
      );
      if (itemCor?.tamanhos?.length) {
        // Define automaticamente o primeiro tamanho da nova cor
        setSizeSelecionado(itemCor.tamanhos[0].tamanho);
      }
    }
  }, [corSelecionada, data]);

  useEffect(() => {
    setQtyIten(1);
  }, [stockDoTamanho]);

  function addToCart() {
    const url = `http://localhost/tcc/API/POST/cart/insert?user_id=${
      user.id
    }&product_id=${
      data.id
    }&cor=${corSelecionada}&tamanho=${sizeSelecionado}&qty=${qtyIten ?? 1}`;

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
      });
    // .catch((error) => {
    //   console.log(error);
    //   setBtnLoading(false);
    // });
  }

  function handleBuy() {
    setSales([
      {
        id_item: id,
        quantidade_item: qtyIten ?? 1,
        cor: corSelecionada,
        tamanho: sizeSelecionado,
      },
    ]);

    navigate(user && user.id ? "/venda/finalizar-compra" : "/login");
  }

  if (loading) return <Loading />;

  if (!data || !data.id) return <NotFound />;

  const productImages = JSON.parse(data.images);

  return (
    <div id="telaVenda">
      <Header />
      <section>
        <div id="content">
          <div className="produto-content">
            {productImages.length > 1 ? (
              <ImagesCarroussel images={productImages} />
            ) : (
              <div className="one-img-container">
                <img src={productImages} alt="imagem de exemplo do produto" />
              </div>
            )}

            <div className="characteristics-container">
              <p>Características</p>
              <ul>
                <li>
                  Marca: <span>{data.brand}</span>
                </li>
                <li>
                  Gênero: <span>{data.gender}</span>
                </li>
                <li>
                  Condição: <span>{data.condition}</span>
                </li>
                <li>
                  Estilo: <span>{data.style}</span>
                </li>
              </ul>
            </div>
            <div>
              <p>Descrição</p>

              <p
                className={fullDescription ? "descricao full" : "descricao"}
                id="descricao"
              >
                {data.description}
              </p>

              {data.description.length > 303 && (
                <p
                  className="verDescricao"
                  onClick={() => {
                    if (fullDescription) {
                      setFullDescription(false);
                    } else {
                      setFullDescription(true);
                    }
                  }}
                >
                  {fullDescription
                    ? "Ver menos descrição"
                    : "Ver mais descrição"}
                </p>
              )}
            </div>
          </div>

          <div id="infosProduto">
            <LinkPerfil
              img={data.profile_photo}
              name={data.store_name}
              url={`/paginaVendedor?seller=${data.seller_url}`}
            />

            <p>
              Chegara até o dia
              {" " + calculatinDelivery(data.deliveryTime) + " "}
              comprando dentro de 24 horas
            </p>

            <p className="productName">{data.productName}</p>

            {data.promotionPrice ? (
              <div>
                <p className="line-through colorGray">
                  {monetaryFormatting(data.price)}
                </p>
                <strong className="xx-large weigth-500">
                  {monetaryFormatting(data.promotionPrice)}
                </strong>
              </div>
            ) : (
              <strong className="weigth-500">
                {monetaryFormatting(data.price)}
              </strong>
            )}

            <div className="opcoesCores">
              <p>Cores</p>
              <div>
                {data.itenStock.map((item, key) => (
                  <div
                    key={key}
                    className={`corItem ${
                      corSelecionada === item.cor ? "ativo" : ""
                    }`}
                    onClick={() => setCorSelecionada(item.cor)}
                  >
                    {/* Mostra um círculo colorido + nome da cor */}
                    <div
                      className="circuloCor"
                      style={{ backgroundColor: coresMap[item.cor] || "#ccc" }}
                    ></div>
                    <span>{item.cor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="opcoesTamanhos">
              <p>Tamanhos</p>
              <div>
                {tamanhosDaCor.map((size, key) => (
                  <div
                    key={key}
                    className={`tamanhoItem ${
                      sizeSelecionado === size.tamanho ? "ativo" : ""
                    }`}
                    onClick={() => setSizeSelecionado(size.tamanho)}
                  >
                    {size.tamanho}
                  </div>
                ))}
              </div>
            </div>

            <div id="compraBox">
              <span className="colorGray">
                {data.salesQuantity > 0 &&
                  "+" + (data.salesQuantity - 1) + "vendas"}
              </span>

              <p className="productFrete">
                Frete{" "}
                {data.shippingCost === 0 ? (
                  <span className="colorGreen">Grátis</span>
                ) : (
                  "de " + monetaryFormatting(data.shippingCost)
                )}
              </p>

              <Contador
                isCart={false}
                maxCount={stockDoTamanho}
                qtyIten={qtyIten}
                setQtyIten={setQtyIten}
              />

              <p className="small">
                <span className="colorGray">Estoque disponível:</span>{" "}
                {stockDoTamanho} unidade{stockDoTamanho > 1 && "s"}
              </p>

              {user?.seller_id ? (
                user?.seller_id !== data.sellerId && (
                  <div id="buttonsBox">
                    <button
                      onClick={() => {
                        handleBuy();
                      }}
                    >
                      Comprar agora
                    </button>

                    <button
                      id="addToCartBtn"
                      className={
                        btnLoading
                          ? "loading-button"
                          : addedToCart
                          ? "clicked-button"
                          : ""
                      }
                      onClick={() => {
                        user && user.id ? addToCart() : navigate("/login");
                      }}
                      disabled={btnLoading || addedToCart}
                    >
                      {btnLoading
                        ? ""
                        : addedToCart
                        ? "Produto adicionado"
                        : "Adicionar ao carrinho"}
                    </button>
                  </div>
                )
              ) : (
                <div id="buttonsBox">
                  <button
                    onClick={() => {
                      handleBuy();
                    }}
                  >
                    Comprar agora
                  </button>

                  <button
                    id="addToCartBtn"
                    className={
                      btnLoading
                        ? "loading-button"
                        : addedToCart
                        ? "clicked-button"
                        : ""
                    }
                    onClick={() => {
                      user && user.id ? addToCart() : navigate("/login");
                    }}
                    disabled={btnLoading || addedToCart}
                  >
                    {btnLoading
                      ? ""
                      : addedToCart
                      ? "Produto adicionado"
                      : "Adicionar ao carrinho"}
                  </button>
                </div>
              )}

              {/* <p>Garantia de até 30 dias após receber o produto</p> */}
            </div>
          </div>
        </div>
      </section>

      {similarItems && (
        <section id="similar-items">{criarPrateleira(similarItems)}</section>
      )}

      <section>
        <Comentarios />
      </section>

      <Footer />
    </div>
  );
}

export default Venda;
