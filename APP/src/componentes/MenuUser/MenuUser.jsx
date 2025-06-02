import {
  CircleUser,
  Layout,
  ShoppingBasket,
  History,
  X,
  Headset,
  LogOut,
} from "lucide-react";
import "./menuUser.css";
import MenuCard from "./MenuCards/MenuCard";
import { useEffect } from "react";

function MenuUser({ funcao }) {
  useEffect(() => {
    const container = document.querySelector("#menu-user-container");

    function handleClick(event) {
      if (!document.querySelector("#menu-user-box").contains(event.target)) {
        funcao();
      }
    }

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [funcao]);

  return (
    <div id="menu-user-container">
      <button>
        <X />
      </button>

      <div id="menu-user-box">
        <h2>Olá usuario</h2>

        <MenuCard
          icon={<CircleUser className="menu-icon" />}
          title={"Minha conta"}
          link={"/minhaConta"}
        />
        <MenuCard
          icon={<Layout className="menu-icon" />}
          title={"Painel"}
          link={"/paginavendedor"}
        />
        <MenuCard
          icon={<ShoppingBasket className="menu-icon" />}
          title={"Minhas compras"}
          link={"/minhaConta"}
        />
        <MenuCard
          icon={<History className="menu-icon" />}
          title={"Minhas compras"}
          link={"/minhaConta"}
        />
        <MenuCard
          icon={<Headset className="menu-icon" />}
          title={"Precisa de ajuda?"}
          link={"/minhaConta"}
        />
        <MenuCard
          icon={<LogOut className="menu-icon" />}
          title={"Sair"}
          link={"/minhaConta"}
        />
      </div>
    </div>
  );
}

export default MenuUser;
