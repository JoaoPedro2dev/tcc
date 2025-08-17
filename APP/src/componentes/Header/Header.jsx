import { SearchIcon, ShoppingCart, User, MapPin } from "lucide-react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Carrinho from "../Carrinho/Carrinho";
import MenuUser from "../MenuUser/MenuUser";

function Header({ value }) {
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

  const userLogged = true;

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

      {userLogged ? (
        <button className="usser-account-btn" onClick={menu}>
          <img
            src="http://localhost/tcc/API/UPLOADS/images/imagem3.png"
            alt=""
          />
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

      <button id="buttonCart" onClick={cart}>
        <div id="cartCount">0</div>
        <ShoppingCart />
      </button>

      {openCart && (
        <Carrinho
          funcao={() => {
            cart();
          }}
        />
      )}

      {openMenu && (
        <MenuUser
          funcao={() => {
            menu();
          }}
        />
      )}
    </header>
  );
}

export default Header;
