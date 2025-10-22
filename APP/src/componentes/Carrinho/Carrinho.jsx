import "./carrinho.css";
import { X } from "lucide-react";
import CartCard from "./CartCard/CartCard";
import { useEffect, useState } from "react";
import CarrinhoVazil from "./CarrinhoVazil/CarrinhoVazil";
import ProdutosInfos from "./ProdutosInfos/ProdutosInfos";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useSales } from "../../context/SalesContext";

function Carrinho({ funcao }) {
  const [products, setProducts] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    const url = `http://localhost/tcc/API/GET/cartItens?user_id=${user.id}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        console.log("carrinho", data);
        setProducts(data);
      });
  }, []);

  function close(event) {
    const cart =
      document.querySelector("#cartBox") ??
      document.querySelector("#emptyCart");

    const arrow = funcao;

    if (!cart.contains(event.target)) {
      arrow();
    }
  }

  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    if (products.length > 0) {
      const soma = products.reduce(
        (sum, item) =>
          sum +
          (item.promotionPrice ? item.promotionPrice : item.price) *
            item.quantity +
          item.shippingCost,
        0
      );

      setTotalValue(
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(soma)
      );
    }
  }, [products]);

  const navigate = useNavigate();

  const { setSales } = useSales();

  function handleBuy() {
    const array = products.map((item) => ({
      id_item: item.id,
      quantidade_item: 1,
    }));

    setSales(array);

    console.log(array);

    navigate(user && user.id ? "/venda/finalizar-compra" : "/login");
  }

  return (
    <div
      id="cartContainer"
      onClick={(event) => {
        close(event);
      }}
    >
      <button>
        <X />
      </button>

      {products.length === 0 ? (
        <CarrinhoVazil />
      ) : (
        <div id="cartBox">
          <div>
            <p>Seus itens salvos</p>

            <p>{`(${products.length})`}</p>
          </div>

          {products.map((item) => (
            <CartCard
              userI={user.id}
              key={item.id}
              item={{ ...item }}
              setProductsArray={setProducts}
            />
          ))}

          <ProdutosInfos
            valorTotal={totalValue}
            handleBuy={() => {
              handleBuy();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Carrinho;
