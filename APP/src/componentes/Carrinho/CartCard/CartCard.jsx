import "./cartcard.css";
import Contador from "../../Contador/Contador";
import { Trash2, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { monetaryFormatting } from "../../../helpers/functions";
import { useUser } from "../../../context/UserContext";
// import /shootCartCounter/ "../../../helpers/functions";
import "./CartCard.css";

function CartCard({ item, setProductsArray }) {
  const { user } = useUser();
  const [count, setCount] = useState(1);
  const [isRemoving, setIsRemoving] = useState(false);
  const navigate = useNavigate();

  function navegarItem() {
    navigate("/venda?", { state: item.id });
  }

  function removeFromCart() {
    const url = `http://localhost/tcc/API/DELETE/cart-item?user_id=${user.id}&product_id=${item.id}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data === true) {
          setProductsArray((prev) => prev.filter((p) => p.id !== item.id));
          // shootCartCounter(-1);
          setIsRemoving(false);
        } else {
          alert("algo deu errado");
          setIsRemoving(false);
        }
      })
      .catch((error) => {
        console.error("erro", error);
        setIsRemoving(false);
      });
  }

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeFromCart();
    }, 300);
  };

  return (
    <div className={`cart-card ${isRemoving ? "removing" : ""}`}>
      <div className="cart-card-image" onClick={navegarItem}>
        <img src={JSON.parse(item.images)[0]} alt={item.name} />
      </div>

      <div className="cart-card-content">
        <div className="cart-card-details">
          <h3 className="cart-card-title">{item.productName}</h3>

          <div className="cart-card-pricing">
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
          </div>

          <div className="cart-card-attributes">
            {item.cor && (
              <div className="attribute">
                <span className="attribute-label">Cor:</span>
                <span className="attribute-value">{item.cor}</span>
              </div>
            )}
            {item.tamanho && (
              <div className="attribute">
                <span className="attribute-label">Tamanho:</span>
                <span className="attribute-value">{item.tamanho}</span>
              </div>
            )}
          </div>

          <div className="cart-card-shipping">
            <span>
              {item.shippingCost == 0 ? (
                <span className="free-shipping">Frete Grátis</span>
              ) : (
                `Frete: ${monetaryFormatting(item.shippingCost)}`
              )}
            </span>
          </div>

          <div className="cart-card-actions">
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
              className="remove-btn"
              onClick={handleRemove}
              title="Remover item"
            >
              <Trash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartCard;

// function CartCard({ item, setProductsArray }) {
// const { user } = useUser();
// const navigate = useNavigate();
// const images = JSON.parse(item.images);
// const [count, setCount] = useState(item.quantity ?? 1);

// function removeFromCart() {
// const url = http://localhost/tcc/API/DELETE/cart-item?user_id=${user.id}&product_id=${item.id};
// fetch(url)
// .then((r) => r.json())
// .then((data) => {
// console.log(data);
// if (data === true) {
// setProductsArray((prev) => prev.filter((p) => p.id !== item.id));
// // shootCartCounter(-1);
// } else {
// alert("algo deu errado");
// }
// })
// .catch((error) => {
// console.error("erro", error);
// });
// }

// return (

// <div className="cartCard"> <img src={images[0]} alt="" onClick={() => { navigate("/venda?", { state: item.id }); }} /> <div> <div className="itemInfos"> <p>{item.productName}</p>

//   {item.promotionPrice ? (
//     <div>
//       <strong>{monetaryFormatting(item.promotionPrice)}</strong>
//       <p className="line-through colorGray small">
//         {monetaryFormatting(item.price)}
//       </p>
//     </div>
//   ) : (
//     <strong>{monetaryFormatting(item.price)}</strong>
//   )}

//   <p>
//     Frete {""}
//     {item.shippingCost > 0 ? (
//       monetaryFormatting(item.shippingCost)
//     ) : (
//       <span className="colorGreen">Grátis</span>
//     )}
//   </p>
// </div>

// <Contador
//   id={item.id}
//   userId={user.id}
//   maxCount={item.stockTotal}
//   isCart={true}
//   qtyIten={count}
//   setQtyIten={(newQty) => {
//     setCount(newQty);
//     setProductsArray((prev) =>
//       prev.map((p) =>
//         p.id === item.id ? { ...p, quantity: newQty } : p
//       )
//     );
//   }}
// />

// <button
//   className="deleteCart"
//   onClick={() => {
//     removeFromCart();
//   }}
// >
//   <Trash2 />
// </button>
// </div> </div> ); }
// export default CartCard;
