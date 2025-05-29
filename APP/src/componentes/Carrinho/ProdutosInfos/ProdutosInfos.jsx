import "./produtosInfos.css";

function ProdutosInfos({ total }) {
  return (
    <div id="produtosInfos">
      <div>
        <p>Total</p>
        <strong>R${total.toFixed(2).toString().replace(".", ",")}</strong>
      </div>
      <button>Comprar tudo</button>
    </div>
  );
}

export default ProdutosInfos;
