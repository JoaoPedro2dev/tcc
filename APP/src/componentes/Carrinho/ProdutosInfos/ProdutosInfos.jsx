import "./produtosInfos.css";

function ProdutosInfos({ valorTotal, handleBuy }) {
  return (
    <div id="produtosInfos">
      <div>
        <p>Total</p>
        <strong>{valorTotal}</strong>
      </div>
      <button onClick={handleBuy}>Comprar tudo</button>
    </div>
  );
}

export default ProdutosInfos;
