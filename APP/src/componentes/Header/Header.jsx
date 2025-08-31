import { SearchIcon, ShoppingCart, User, MapPin } from "lucide-react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Carrinho from "../Carrinho/Carrinho";
import MenuUser from "../MenuUser/MenuUser";
import { useUser } from "../../context/UserContext";

function Header({ value }) {
  const { user } = useUser();

  const navigate = useNavigate();
  const [url, setUrl] = useState(value ?? "");
  function navegarUrl() {
    if (url.trim() !== "") {
      navigate(`/pesquisa?s=${url.toLowerCase().trim()}`);
    }
  }

  const [openCart, setOpenCart] = useState(false);
  function cart() {
    !openCart ? setOpenCart(true) : setOpenCart(false);
  }

  const [openMenu, setOpenMenu] = useState(false);
  function menu() {
    !openMenu ? setOpenMenu(true) : setOpenMenu(false);
  }

  // console.log(user.cep);
  // const [cartCount, setCartCount] = useState(0);

  return (
    <header>
      <strong
        onClick={() => {
          navigate("/");
        }}
      >
        DNV WEAR
      </strong>

      {user &&
        (user.cep ? (
          <p className="cepBtn">{user.cep}</p>
        ) : (
          <p
            className="cepBtn"
            onClick={() => {
              navigate("/cadastrarcep");
            }}
          >
            Meu endereço
            <span>
              <MapPin height={"20px"} />
              CEP
            </span>
          </p>
        ))}

      <div className="inputBox">
        <input
          type="text"
          className="searchIcon"
          placeholder="Pesquise um tênis"
          id="inputSearch"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          onKeyDown={(e) => {
            e.key === "Enter" && navegarUrl();
          }}
        />

        <label htmlFor="inputSearch" onClick={navegarUrl}>
          <SearchIcon className="searchIcon" />
        </label>
      </div>

      {user ? (
        <button className="usser-account-btn" onClick={menu}>
          <img src={user.img} alt="" />
        </button>
      ) : (
        <button
          id="buttonLogin"
          onClick={() => {
            navigate("/login");
          }}
        >
          <User />
          <p>Entrar</p>
        </button>
      )}

      <button
        id="buttonCart"
        onClick={
          user
            ? cart
            : () => {
                navigate("/login");
              }
        }
      >
        <div id="cartCount">0</div>
        <ShoppingCart />
      </button>

      {openCart && (
        <Carrinho
          funcao={() => {
            cart();
          }}
          userId={user.id}
        />
      )}

      {openMenu && user && (
        <MenuUser
          funcao={() => {
            menu();
          }}
          name={user.name}
          access={user.access}
        />
      )}
    </header>
  );
}

export default Header;
