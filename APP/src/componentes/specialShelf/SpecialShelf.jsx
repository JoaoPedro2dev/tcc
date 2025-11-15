import "./SpecialShelf.css";
import Card from "../Card/Card";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import Carrinho from "../Carrinho/Carrinho.jsx";

// Botão personalizado anterior
const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow-prateleira prev-prateleira" onClick={onClick}>
    <ArrowLeft size={20} strokeWidth={1.5} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow-prateleira next-prateleira" onClick={onClick}>
    <ArrowRight size={20} strokeWidth={1.5} />
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
      .then((dataPromotion) => {
        console.log("promoções", dataPromotion);
        if (dataPromotion.length > 0) {
          setItens(dataPromotion);
        }
      });
  }

  useEffect(() => {
    getPromotions();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    fetch("http://localhost/tcc/API/GET/shelf", {
      method: "POST",
      body: new URLSearchParams({ user_id: user.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("prateleira especial", data);
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
      .then((dataCart) => {
        if (dataCart.length > 0) {
          setImages(dataCart);
        }
      });
  }, [user?.id]);

  function handlerCart() {
    setOpenCart(true);
  }

  if (itens.length === 0) {
    return;
  }

  const promotionDayIten = itens.find(
    (iten) => iten.promotionPrice !== null && iten.promotionPrice > 0
  );

  return (
    <div className="specialShelf-container">
      {images.length > 0 ? (
        <div className="prateleira">
          {openCart && (
            <Carrinho
              funcao={() => {
                setOpenCart(false);
              }}
            />
          )}

          <h1>Seu carrinho</h1>
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
        promotionDayIten && (
          <div className="prateleira oferta-dia">
            <h1>Oferta do dia</h1>
            {<Card item={promotionDayIten} showPorcentage={true} />}
          </div>
        )
      )}

      <div className="prateleira">
        <h1>{title}</h1>
        <Slider {...settings} className="carroussel">
          {itens.map((item) => {
            if (item.id === promotionDayIten?.id) return null;

            return <Card key={item.id} item={item} />;
          })}
        </Slider>
        {itens.length > 2 && <hr className="divisa" />}
      </div>
    </div>
  );
}

export default SpecialShelf;
