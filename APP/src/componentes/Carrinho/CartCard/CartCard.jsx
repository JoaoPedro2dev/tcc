import "./cartcard.css";
import Contador from "../../Contador/Contador";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { monetaryFormatting } from "../../../helpers/functions";
import { useUser } from "../../../context/UserContext";
// import /*shootCartCounter*/ "../../../helpers/functions";

function CartCard({ item, setProductsArray }) {
  const { user } = useUser();

  const navigate = useNavigate();

  function removeFromCart() {
    const url = `http://localhost/tcc/API/DELETE/cart-item?user_id=${user.id}&product_id=${item.id}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data === true) {
          setProductsArray((prev) => prev.filter((p) => p.id !== item.id));
          // shootCartCounter(-1);
        } else {
          alert("algo deu errado");
        }
      })
      .catch((error) => {
        console.error("erro", error);
      });
  }

  const images = JSON.parse(item.images);

  const [count, setCount] = useState(item.quantity ?? 1);

  return (
    <div className="cartCard">
      <img
        src={images[0]}
        alt=""
        onClick={() => {
          navigate("/venda?", { state: item.id });
        }}
      />

      <div>
        <div className="itemInfos">
          <p>{item.productName}</p>

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

          <p>
            Frete {""}
            {item.shippingCost > 0 ? (
              monetaryFormatting(item.shippingCost)
            ) : (
              <span className="colorGreen">Grátis</span>
            )}
          </p>
        </div>

        <Contador
          id={item.id}
          userId={user.id}
          maxCount={item.stockTotal}
          isCart={true}
          qtyIten={count}
          setQtyIten={(newQty) => {
            setCount(newQty);
            setProductsArray((prev) =>
              prev.map((p) =>
                p.id === item.id ? { ...p, quantity: newQty } : p
              )
            );
          }}
        />

        <button
          className="deleteCart"
          onClick={() => {
            removeFromCart();
          }}
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
}

export default CartCard;
