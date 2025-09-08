import { useNavigate } from "react-router-dom";
import "./card.css";
import { ShoppingCart } from "lucide-react";
import Feedback from "../Feedback/Feedback";
import { useState } from "react";
import { monetaryFormatting } from "../../helpers/functions";
import { useUser } from "../../context/UserContext";
// import /*shootCartCounter*/ "../../helpers/functions";

function Card({ item }) {
  const navigate = useNavigate();

  const colorsArray = JSON.parse(item.availableColors);

  // const [feedback, setFeedback] = useState("");

  const [addedToCart, setAddedToCart] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { user } = useUser();

  function addToCart(e) {
    e.stopPropagation();
    const url = `http://localhost/tcc/API/POST/cart/insert?user_id=${
      user.id
    }&product_id=${item.id}&qty=${1}`;

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
        console.error(error);
        setBtnLoading(false);
      });
  }

  const images = JSON.parse(item.images);

  return (
    <div
      className="card borderRadius"
      onClick={() => {
        navigate("/venda?", { state: item.id });
      }}
    >
      <button
        className={
          btnLoading
            ? "likeBtn loading-card-btn"
            : addedToCart
            ? "likeBtn clicked-button"
            : "likeBtn"
        }
        onClick={(e) => {
          addToCart(e);
        }}
        disabled={btnLoading || addedToCart}
      >
        <ShoppingCart />
      </button>

      <img src={images[0]} alt="" />

      <div className="arrayColorsLength">{colorsArray.length} Cores</div>
      <div className="text">
        <p>{item.productName}</p> teste
        {item.promotionPrice ? (
          <div>
            <strong>{monetaryFormatting(item.promotionPrice)}</strong>
            <p className="line-through colorGray small">
              {monetaryFormatting(item.price)}
            </p>
          </div>
        ) : (
          <strong>{monetaryFormatting(item.price)}</strong>
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
          Frete{" "}
          {item.shippingCost === 0 ? (
            <span className="colorGreen"> Grátis </span>
          ) : (
            monetaryFormatting(item.shippingCost)
          )}
        </p>
      </div>

      {/* {feedback} */}
    </div>
  );
}

export default Card;
