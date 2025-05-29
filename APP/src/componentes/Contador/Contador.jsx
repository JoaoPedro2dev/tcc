import "./contador.css";
import { useEffect, useState } from "react";

function Contador({ id, isCart, valueCont, qnt }) {
  const [i, setI] = useState(qnt ?? 1);

  function more() {
    if (i < 100) {
      setI(i + 1);
    }
  }

  function less() {
    if (i > 1) {
      setI(i - 1);
    }
  }

  useEffect(() => {
    if (valueCont) {
      valueCont(i);
    }

    if (isCart) {
      qntStorage(i, id);
    }
  }, [i, valueCont, isCart, id]);

  function qntStorage(quantidade, idItem) {
    const storage = localStorage.getItem("idItem");

    let itens = [];

    if (!storage) return;

    itens = JSON.parse(storage);

    const novosItens = itens.map((it) => {
      if (it.id === idItem) {
        return { ...it, qnt: quantidade };
      }

      return it;
    });

    localStorage.setItem("idItem", JSON.stringify(novosItens));
    window.dispatchEvent(new Event("CarrinhoAtualizado"));
  }

  return (
    <div className="countContainer">
      {isCart ? "" : <p>Quantidade</p>}
      <div className="countBox">
        <button
          onClick={() => {
            less();
          }}
        >
          -
        </button>
        <span>{i}</span>
        <button
          onClick={() => {
            more();
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Contador;
