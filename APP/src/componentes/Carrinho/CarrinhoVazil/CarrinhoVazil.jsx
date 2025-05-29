import { ShoppingCart } from "lucide-react";

function CarrinhoVazil() {
  return (
    <div id="emptyCart">
      <div>
        <ShoppingCart size={100} />
        <div>
          <strong>Seu carrinho esta vazio</strong>
          <p>Aproveite nossas promoções e ofertas para você</p>
        </div>
      </div>
    </div>
  );
}

export default CarrinhoVazil;
