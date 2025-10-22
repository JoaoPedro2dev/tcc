import { useNavigate } from "react-router-dom";
import "./card.css";
import { ShoppingCart } from "lucide-react";
import Feedback from "../Feedback/Feedback";
import { useState } from "react";
import { calcStockTotal, monetaryFormatting } from "../../helpers/functions";
import { useUser } from "../../context/UserContext";
// import /*shootCartCounter*/ "../../helpers/functions";

function Card({ item, showPorcentage = false, isProfile = false }) {
  const navigate = useNavigate();

  const colorsArray = item.itenStock?.length ?? 1;

  const [addedToCart, setAddedToCart] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { user } = useUser();

  if (showPorcentage) {
    item.porcentage =
      item.price > 0
        ? (((item.price - item.promotionPrice) / item.price) * 100).toFixed(0)
        : 0;
  }

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

  let images = JSON.parse(item.images);

  if (typeof images === "string") {
    images = JSON.parse(images);
  }

  const stockTotal = calcStockTotal(item);

  return (
    <div
      className="card borderRadius"
      onClick={() => {
        navigate("/venda?", { state: item.id });
      }}
    >
      {user?.seller_id ? (
        user.seller_id != item.sellerId && (
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
        )
      ) : (
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
      )}

      <img src={images[0]} alt="" />

      <div className="arrayColorsLength">
        {colorsArray} {colorsArray > 1 ? "Cores" : "Cor"}
      </div>
      <div className="text">
        <p>{item.productName}</p>
        {item.promotionPrice ? (
          <div className="price-content">
            <strong>{monetaryFormatting(item.promotionPrice)}</strong>
            <p className="line-through colorGray small">
              {monetaryFormatting(item.price)}
            </p>
          </div>
        ) : (
          <strong>{monetaryFormatting(item.price)}</strong>
        )}

        {item.porcentage && (
          <div>
            <p className="colorGreen">{item.porcentage}% OFF</p>
          </div>
        )}

        <div>
          <p className="colorGray small">
            {item.category} - {item.style} - {item.condition}
          </p>
          <p
            className="colorGray small"
            style={{ color: item.stockTotal === 0 && "red" }}
          >
            {stockTotal} em estoque
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
      {isProfile && user?.seller_id === item.sellerId && (
        <div
          className="edit-buttons"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            onClick={() => {
              navigate("/paginavendedor/editar-produto?", { state: item.id });
            }}
          >
            Editar Produto
          </button>
        </div>
      )}

      {/* {feedback} */}
    </div>
  );
}

export default Card;
