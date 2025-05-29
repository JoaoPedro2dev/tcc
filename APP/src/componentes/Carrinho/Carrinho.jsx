import "./carrinho.css";
import { X } from "lucide-react";
import CartCard from "./CartCard/CartCard";
import { useEffect, useState } from "react";
import tenis from "../../json/tenis.json";
import CarrinhoVazil from "./CarrinhoVazil/CarrinhoVazil";
import ProdutosInfos from "./ProdutosInfos/ProdutosInfos";

function Carrinho({ funcao }) {
  const [view, setView] = useState(<CarrinhoVazil />);

  function viewCart() {
    const storage = localStorage.getItem("idItem");

    if (!storage) {
      setView(<CarrinhoVazil />);
      return;
    }

    const itens = JSON.parse(storage);

    if (itens.length === 0) {
      setView(<CarrinhoVazil />);
      return;
    }

    const itensSelecionados = itens
      .map((it) => {
        const produto = tenis.find((t) => t.id === it.id);
        return produto ? { ...produto, quantidade: it.qnt } : null;
      })
      .filter(Boolean);

    let total = itensSelecionados.reduce(
      (soma, item) => soma + (item.preco + item.frete) * item.quantidade,
      0
    );

    setView(
      <div id="cartBox">
        <div>
          <p>Seus itens salvos</p>

          <p>{`(${itensSelecionados.length})`}</p>
        </div>

        {itensSelecionados.map((item) => {
          return (
            <CartCard
              key={item.id}
              item={item}
              idItem={item.id}
              img={item.imagem}
              nome={item.nome}
              preco={item.preco}
              frete={item.frete}
              qnt={item.quantidade}
            />
          );
        })}

        <ProdutosInfos total={Number(total)} />
      </div>
    );
  }

  useEffect(() => {
    viewCart();

    function verificarCarrinho() {
      viewCart();
    }

    window.addEventListener("CarrinhoAtualizado", verificarCarrinho);

    return () => {
      window.removeEventListener("CarrinhoAtualizado", verificarCarrinho);
    };
  }, []);

  function close(event) {
    const cart =
      document.querySelector("#cartBox") ??
      document.querySelector("#emptyCart");

    const arrow = funcao;

    if (!cart.contains(event.target)) {
      arrow();
    }
  }

  return (
    <div
      id="cartContainer"
      onClick={(event) => {
        close(event);
      }}
    >
      <button>
        <X />
      </button>

      {view}
    </div>
  );
}

export default Carrinho;
