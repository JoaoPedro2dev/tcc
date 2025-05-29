import { SearchIcon, ShoppingCart } from "lucide-react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Carrinho from "../Carrinho/Carrinho";

function Header({ value }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const atualizarCount = () => {
      const storage = localStorage.getItem("idItem");

      setCartCount(storage ? JSON.parse(storage).length : 0);
    };

    atualizarCount();

    window.addEventListener("countUpdate", atualizarCount);

    return () => {
      window.removeEventListener("countUpdate", atualizarCount);
    };
  }, []);

  const navigate = useNavigate();

  const [url, setUrl] = useState(value ?? "");

  function navegarUrl() {
    if (url.trim() !== "") {
      navigate(`/pesquisa?s=${url.toLowerCase().trim()}`);
    }
  }

  const [openCart, setOpenCart] = useState(false);

  function cart() {
    if (!openCart) {
      setOpenCart(true);
    } else {
      setOpenCart(false);
    }
  }

  return (
    <header>
      <strong
        onClick={() => {
          navigate("/");
        }}
      >
        DNV WEAR
      </strong>

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

      <button id="buttonCart" onClick={cart}>
        <div id="cartCount">{cartCount}</div>
        <ShoppingCart />
      </button>

      {openCart ? (
        <Carrinho
          funcao={() => {
            cart();
          }}
        />
      ) : (
        ""
      )}
    </header>
  );
}

export default Header;
