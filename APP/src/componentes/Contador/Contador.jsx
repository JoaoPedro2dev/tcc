import "./contador.css";
import {} from "react";

function Contador({ id, userId, maxCount, isCart, qtyIten, setQtyIten }) {
  function qtyControll(controll) {
    console.log("Id do produto ", id);
    const url = `http://localhost/tcc/API/POST/cart-item-controll?user_id=${userId}&product_id=${id}&operation=${controll}`;

    console.log("URL", url);

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data == true) {
          controll ? more() : less();
        } else {
          alert("algo deu errado");
        }
      })
      // .catch((error) => {
      //   console.error("erro", error);
      // });
  }

  function more() {
    if (qtyIten < maxCount) {
      setQtyIten(qtyIten + 1);
    }
  }

  function less() {
    if (qtyIten > 1) {
      setQtyIten(qtyIten - 1);
    }
  }

  return (
    <div className="countContainer">
      {isCart ? "" : <p>Quantidade</p>}

      <div className="countBox">
        <button
          onClick={() => {
            isCart ? qtyControll("") : less();
          }}
        >
          -
        </button>
        <span>{qtyIten}</span>
        <button
          onClick={() => {
            isCart ? qtyControll("more") : more();
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Contador;
