import { useNavigate } from "react-router-dom";
import "./card.css";
import { ShoppingBag } from "lucide-react";
import Feedback from "../Feedback/Feedback";
import { useState } from "react";
import { calcStockTotal, monetaryFormatting } from "../../helpers/functions";
import { useUser } from "../../context/UserContext";
import AddToCartModal from "../AddCartModal/AddCartModal";
import FeedbackPopup from "../Feedback/Feedback";
// import /*shootCartCounter*/ "../../helpers/functions";

function Card({ item, showPorcentage = false, isProfile = false }) {
  const navigate = useNavigate();

  const colorsArray = item.itenStock?.length ?? 1;
  const [openAddCartModal, setOpenAddCartModal] = useState(false);

  const { user } = useUser();

  if (showPorcentage) {
    item.porcentage =
      item.price > 0
        ? (((item.price - item.promotionPrice) / item.price) * 100).toFixed(0)
        : 0;
  }

  let images = JSON.parse(item.images);
  if (typeof images === "string") {
    images = JSON.parse(images);
  }
  const stockTotal = calcStockTotal(item);

  return (
    <>
      <div
        className="card"
        onClick={() => {
          navigate("/venda?", { state: item.id });
        }}
      >
        {user?.seller_id ? (
          user.seller_id != item.sellerId && (
            <button
              className="likeBtn"
              onClick={(e) => {
                e.stopPropagation();
                setOpenAddCartModal(true);
              }}
              // disabled={btnLoading || addedToCart}
            >
              <ShoppingBag strokeWidth={1.5} />
            </button>
          )
        ) : (
          <button
            className="likeBtn"
            onClick={(e) => {
              // addToCart(e);
              e.stopPropagation();
              setOpenAddCartModal(true);
            }}
            // disabled={btnLoading || addedToCart}
          >
            {/* <ShoppingCart /> */}
            <ShoppingBag strokeWidth={1.5} />
          </button>
        )}

        <img src={images[0]} alt="" />

        <div className="arrayColorsLength">
          {colorsArray} {colorsArray > 1 ? "Cores" : "Cor"}
        </div>
        <div className="text">
          <strong>{item.productName}</strong>
          {item.promotionPrice ? (
            <div className="card-price-content">
              <p className="line-through colorGray small">
                {monetaryFormatting(item.price)}
              </p>
              <p>{monetaryFormatting(item.promotionPrice)}</p>
            </div>
          ) : (
            <p>{monetaryFormatting(item.price)}</p>
          )}

          {item.porcentage < 100 && (
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
              style={{ color: stockTotal === 0 && "red" }}
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

      {openAddCartModal && (
        <AddToCartModal
          product={item}
          onClose={() => {
            setOpenAddCartModal(false);
          }}
          user={user}
        />
      )}
    </>
  );
}

export default Card;
