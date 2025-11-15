import { ShoppingBasket } from "lucide-react";

function CarrinhoVazil() {
  return (
    <div id="emptyCart">
      <div>
        <ShoppingBasket size={100} strokeWidth={1.5} />
        <div>
          <strong>Seu carrinho está vazio</strong>
          <p>Aproveite nossas promoções e ofertas para você</p>
        </div>
      </div>
    </div>
  );
}

export default CarrinhoVazil;
