import "./SpecialShelf.css";
import Card from "../Card/Card";
import Slider from "react-slick";
import { Car, ChevronLeft, ChevronRight, ImageMinus } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import Carrinho from "../Carrinho/Carrinho.jsx";

// Botão personalizado anterior
const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow-prateleira prev-prateleira" onClick={onClick}>
    <ChevronLeft size={32} color="#fff" />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow-prateleira next-prateleira" onClick={onClick}>
    <ChevronRight size={32} color="#fff" />
  </div>
);

function SpecialShelf() {
  const { user } = useUser();
  const [itens, setItens] = useState([]);
  const [images, setImages] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [title, setTitle] = useState("Ofertas para você");
  const settings = {
    dots: false,
    infinite: false,
    speed: 250,
    slidesToScroll: 2,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    // cancelable: false,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 2.6,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          arrows: false, // Remove as setas no mobile
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5,
          arrows: false,
          swipeToSlide: true,
        },
      },
    ],
  };

  function getPromotions() {
    fetch("http://localhost/tcc/API/GET/promotions")
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          setItens(data);
        }
      });
  }

  useEffect(() => {
    if (!user?.id) {
      getPromotions();
      return;
    }

    fetch("http://localhost/tcc/API/GET/shelf", {
      method: "POST",
      body: new URLSearchParams({ user_id: user.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("prateleira", data);
        if (data.length > 0) {
          setItens(data);
          setTitle("Inspirado nos últimos vistos");
        } else {
          getPromotions();
        }
      });

    fetch("http://localhost/tcc/API/GET/carttohshelf", {
      method: "POST",
      body: new URLSearchParams({ user_id: user.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          setImages(data);
        }
      });
  }, [user?.id]);

  function handlerCart() {
    setOpenCart(true);
  }

  if (itens.length === 0) {
    return;
  }

  return (
    <div className="specialShelf-container">
      {images.length > 0 ? (
        <div className="prateleira boxShadow">
          {openCart && (
            <Carrinho
              funcao={() => {
                setOpenCart(false);
              }}
            />
          )}

          <h2>Seu carrinho</h2>
          <div
            className={`image-content count-${images.length}`}
            onClick={handlerCart}
          >
            {images.map((image, key) => (
              <img key={key} src={image} alt={`Imagem ${key + 1}`} />
            ))}
          </div>
          <p className="colorGray small">
            Seus produtos te esperam, aproveite.
          </p>
        </div>
      ) : (
        <div className="prateleira boxShadow oferta-dia">
          <h2>Oferta do dia</h2>
          <Card item={itens[0]} showPorcentage={true} />
        </div>
      )}

      <div className="prateleira boxShadow">
        <h2>{title}</h2>
        <Slider {...settings} className="carroussel">
          {itens.map((item, key) => (
            <Card key={key} item={item} showPorcentage={true} />
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default SpecialShelf;
