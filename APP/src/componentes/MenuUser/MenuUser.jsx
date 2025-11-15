import {
  CircleUser,
  Layout,
  ShoppingBasket,
  History,
  X,
  Headset,
  LogOut,
  ThumbsUp,
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
          title={"Minha Conta"}
          link={"/minhaConta"}
        />

        {access === "vendedor" && (
          <>
            <MenuCard
              icon={<ThumbsUp className="menu-icon" />}
              title={"Meu Perfil"}
              link={`/paginavendedor?seller=${userUrl}`}
            />

            <MenuCard
              icon={<Layout className="menu-icon" />}
              title={"Painel Administrativo"}
              link={`/perfil-vendedor/dashboard`}
            />
          </>
        )}

        <MenuCard
          icon={<ShoppingBasket className="menu-icon" />}
          title={"Minhas Compras"}
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
