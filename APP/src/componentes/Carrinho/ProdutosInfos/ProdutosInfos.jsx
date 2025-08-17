import "./produtosInfos.css";

function ProdutosInfos({ valorTotal }) {
  return (
    <div id="produtosInfos">
      <div>
        <p>Total</p>
        <strong>{valorTotal}</strong>
      </div>
      <button>Comprar tudo</button>
    </div>
  );
}

export default ProdutosInfos;
