import {
  SearchIcon,
  User,
  MapPin,
  ShoppingBag,
  SearchX,
  ChevronRight,
} from "lucide-react";
import "./header.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Carrinho from "../Carrinho/Carrinho";
import MenuUser from "../MenuUser/MenuUser";
import { useUser } from "../../context/UserContext";

function Header({ value, title = false, link = false }) {
  const { user } = useUser();
  const location = useLocation();

  const navigate = useNavigate();
  const [url, setUrl] = useState(value ?? "");
  const [showSearch, setShowSearch] = useState(
    location.pathname === "/pesquisa" ? true : false
  );

  const handleSearch = () => {
    if (showSearch) {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  };

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

  // if (openCart || openMenu) {
  //   document.body.style.overflow = "hidden";
  // } else {
  //   document.body.style.overflow = "";
  // }

  return (
    <header id="principal-header">
      {showSearch ? (
        <>
          <strong
            onClick={() => {
              navigate(link ? link : "sadasdasd");
            }}
          >
            DNV WEAR
          </strong>
          <div className="inputBox">
            <div onClick={handleSearch}>
              <SearchX className="searchIcon" />
            </div>
            <input
              type="text"
              className="searchIcon"
              placeholder="Pesquise por um produto da moda"
              id="inputSearch"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              onKeyDown={(e) => {
                e.key === "Enter" && navegarUrl();
              }}
            />
            <div onClick={navegarUrl}>
              <ChevronRight />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="infosUser">
            <strong
              onClick={() => {
                navigate(-1);
              }}
            >
              DNV WEAR
            </strong>

            {title ? (
              <div id="appBar">
                <hr />
                <p>{title}</p>
              </div>
            ) : (
              user && (
                <p
                  className="cepBtn"
                  onClick={() => {
                    navigate("/cadastrarcep");
                  }}
                >
                  {user.cep ? (
                    <span>
                      {user.cep} <MapPin height={"20px"} />
                    </span>
                  ) : (
                    <>
                      Meu endereço
                      <span>
                        <MapPin height={"20px"} />
                        CEP
                      </span>
                    </>
                  )}
                </p>
              )
            )}
          </div>

          <ul>
            {location.pathname === "/" && (
              <>
                <li>
                  <a href="#Camisas">Camisas</a>
                </li>
                <li>
                  <a href="#Calças">Calças</a>
                </li>
                <li>
                  <a href="#Calçados">Calçados</a>
                </li>
                <li>
                  <a href="#Acessórios">Acessórios</a>
                </li>
                <li>
                  <a href="#Shorts">Shorts</a>
                </li>
                <li>
                  <a href="#Infantil">Infantil</a>
                </li>
              </>
            )}
          </ul>

          <div className="infosUser">
            <button className="searchbtn" onClick={handleSearch}>
              <SearchIcon className="searchIcon" strokeWidth={1.5} />
            </button>

            {user ? (
              <button className="usser-account-btn" onClick={menu}>
                <img src={user.profile_photo} alt="" />
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
              <ShoppingBag size={32} strokeWidth={1.2} />
            </button>
          </div>

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
              access={user.nivel_acesso}
              userUrl={user.url}
            />
          )}
        </>
      )}
    </header>
  );
}

export default Header;
