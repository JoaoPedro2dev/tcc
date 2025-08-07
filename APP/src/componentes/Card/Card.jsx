import { useNavigate } from "react-router-dom";
import "./card.css";
import { ShoppingCart } from "lucide-react";
import Feedback from "../Feedback/Feedback";
import { useState } from "react";

function Card({ item }) {
  const navigate = useNavigate();

  const priceFormat = item.price.toFixed(2).toString().replace(".", ",");

  const promotionFormat = item.promotionPrice
    .toFixed(2)
    .toString()
    .replace(".", ",");

  const deliveryFormat = item.shippingCost
    .toFixed(2)
    .toString()
    .replace(".", ",");

  const colorsArray = JSON.parse(item.availableColors);

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

  const images = JSON.parse(item.images);

  return (
    <div
      className="card borderRadius"
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
      <img src={images[0]} alt="" />

      <div className="arrayColorsLength">{colorsArray.length} Cores</div>
      <div className="text">
        <p>{item.productName}</p>
        {item.promotionPrice ? (
          <div>
            <strong>R${promotionFormat}</strong>
            <p className="line-through colorGray small">R${priceFormat}</p>
          </div>
        ) : (
          <strong>R${priceFormat}</strong>
        )}
        <div>
          <p className="colorGray small">
            {item.category} - {item.condition}
          </p>
          <p
            className="colorGray small"
            style={{ color: item.stockTotal === 0 && "red" }}
          >
            {item.stockTotal} em estoque
          </p>
        </div>

        <p>
          Frete
          {item.shippingCost === 0 ? (
            <span className="colorGreen"> Grátis</span>
          ) : (
            " " + deliveryFormat
          )}
        </p>
      </div>

      {feedback}
    </div>
  );
}

export default Card;
