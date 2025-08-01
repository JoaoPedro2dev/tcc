import { useLocation } from "react-router-dom";
import Contador from "../../componentes/Contador/Contador.jsx";
import Footer from "../../componentes/Footer/Footer.jsx";
import Header from "../../componentes/Header/Header.jsx";
import Prateleira from "../../componentes/Prateleira/Prateleira.jsx";
import "./venda.css";
import { useState } from "react";
import Feedback from "../../componentes/Feedback/Feedback";
import Comentarios from "../../componentes/Comentarios/Comentarios.jsx";

import tenis from "../../json/tenis.json";
import LinkPerfil from "../../componentes/LinkPerfil/LinkPerfil.jsx";

function Venda() {
  const location = useLocation();
  const data = location.state;

  console.log(data);

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

  return (
    <div id="telaVenda">
      <Header />
      <section>
        <div id="content">
          <img
            src={"http://localhost/tcc/API/UPLOADS/images/imagem1.png"}
            alt="Imagem do Produto"
          />

          <div id="infosProduto">
            <LinkPerfil />
            <strong>{data.nome}</strong>
            <p>{data.descricao}</p>
            <strong>
              R${data.preco.toFixed(2).toString().replace(".", ",")}
            </strong>

            <div className="selectBox">
              <label htmlFor="sizeSeelct">Tamanho</label>
              <select id="sizeSeelct">
                {data.tamanhos.map((tamanho, key) => {
                  return (
                    <option key={key} value={tamanho}>
                      {tamanho}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="selectBox">
              <label htmlFor="colorSelect">Cor</label>
              <select id="colorSelect">
                {data.cores.map((cor, key) => {
                  return (
                    <option key={key} value={cor}>
                      {cor}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div id="compraBox">
            <span>+{data.vendas - 1} vendas</span>
            <p>Chegara até o dia 22/02/2025 comprando dentro de 24 horas</p>
            <p>
              Frete de R${data.frete.toFixed(2).toString().replace(".", ",")}
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
        {criarPrateleira(data.categoria, "Itens parecidos")}
      </section>

      <Footer />

      {feedback}
    </div>
  );
}

export default Venda;
