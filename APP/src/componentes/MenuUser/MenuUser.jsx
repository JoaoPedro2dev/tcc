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
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
// import { useUser } from "../../context/UserContext";

function MenuUser({ funcao, name, access, userUrl }) {
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

  const [openLogout, setOpenLogout] = useState(false);

  const { user } = useUser();

  if (!user?.id) return;

  return (
    <div id="menu-user-container">
      <button>
        <X />
      </button>

      <div id="menu-user-box">
        <h2>Olá {name}</h2>

        <MenuCard
          icon={<CircleUser className="menu-icon" />}
          title={"Minha conta"}
          link={"/minhaConta"}
        />

        {access === "vendedor" && (
          <MenuCard
            icon={<Layout className="menu-icon" />}
            title={"Painel"}
            link={`/paginavendedor?seller=${userUrl}`}
          />
        )}

        <MenuCard
          icon={<ShoppingBasket className="menu-icon" />}
          title={"Minhas compras"}
          link={"/minhas-compras"}
        />
        <MenuCard
          icon={<History className="menu-icon" />}
          title={"Histórico"}
          link={"/historico"}
        />
        <MenuCard
          icon={<Headset className="menu-icon" />}
          title={"Precisa de ajuda?"}
          link={"/minhaConta"}
        />
        <MenuCard
          icon={<LogOut className="menu-icon" />}
          title={"Sair"}
          funcao={() => {
            setOpenLogout(true);
          }}
          true2={openLogout}
        />
      </div>
    </div>
  );
}

export default MenuUser;
