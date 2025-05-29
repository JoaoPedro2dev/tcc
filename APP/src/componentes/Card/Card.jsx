import { useNavigate } from "react-router-dom";
import "./card.css";
import { ShoppingCart } from "lucide-react";
import Feedback from "../Feedback/Feedback";
import { useState } from "react";

function Card({ item }) {
  const navigate = useNavigate();

  const precoFormat = item.preco.toFixed(2);

  const [feedback, setFeedback] = useState("");

  function addCart(e) {
    e.stopPropagation();

    const btn = e.currentTarget;

    btn.classList.add("clicked");
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove("clicked");
      btn.disabled = false;
    }, 1000);

    let storage = localStorage.getItem("idItem");

    let itensCart;

    if (storage) {
      itensCart = JSON.parse(storage);
    } else {
      itensCart = [];
    }

    if (!itensCart.some((it) => it.id === item.id)) {
      itensCart.push({ id: item.id, qnt: 1 });
      localStorage.setItem("idItem", JSON.stringify(itensCart));
      window.dispatchEvent(new Event("CarrinhoAtualizado"));
      window.dispatchEvent(new Event("countUpdate"));
    } else {
      const novosItens = itensCart.map((it) => {
        if (it.id === item.id) {
          const novaQnt = it.qnt + 1 <= 100 ? it.qnt + 1 : it.qnt;
          return { ...it, qnt: novaQnt };
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

  return (
    <div
      className="card"
      onClick={() => {
        navigate("/venda?", { state: item });
      }}
    >
      <button
        className="likeBtn"
        onClick={(e) => {
          addCart(e);
        }}
      >
        <ShoppingCart />
      </button>
      <img
        src={"http://localhost/tcc/tcc/API/UPLOADS/images/imagem1.png"}
        alt=""
      />
      <div className="text">
        <p>{item.nome}</p>
        <span>{item.categoria}</span>
        <strong>R${precoFormat.replace(".", ",")} em até 3x sem juros</strong>
      </div>

      {feedback}
    </div>
  );
}

export default Card;
