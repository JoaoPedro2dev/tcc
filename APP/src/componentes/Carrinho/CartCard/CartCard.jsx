import "./cartcard.css";
import Contador from "../../Contador/Contador";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CartCard({ item, idItem, nome, preco, frete, qnt }) {
  const storage = localStorage.getItem("idItem");
  const navigate = useNavigate();

  let itens = [];

  if (storage) {
    itens = JSON.parse(storage);
  } else {
    itens = [];
  }

  function removeCart(id) {
    if (itens.some((i) => i.id === id)) {
      const novosItens = itens.filter((item) => item.id !== id);

      localStorage.setItem("idItem", JSON.stringify(novosItens));

      window.dispatchEvent(new Event("CarrinhoAtualizado"));
      window.dispatchEvent(new Event("countUpdate"));
    }
  }

  return (
    <div className="cartCard">
      <img
        src={"http://localhost/tcc/API/UPLOADS/images/imagem1.png"}
        alt=""
        onClick={() => {
          navigate("/venda?", { state: item });
        }}
      />

      <div>
        <div className="itemInfos">
          <p>{nome}</p>
          <strong>R${preco.toFixed(2).toString().replace(".", ",")}</strong>
          <p>Frete de R${frete.toFixed(2).toString().replace(".", ",")}</p>
        </div>

        <Contador id={idItem} isCart={true} qnt={qnt} />

        <button
          className="deleteCart"
          onClick={() => {
            removeCart(idItem);
          }}
        >
          <Trash2 />
        </button>
      </div>
    </div>
  );
}

export default CartCard;
