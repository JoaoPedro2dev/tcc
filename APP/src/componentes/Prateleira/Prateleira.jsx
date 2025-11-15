import "./prateleira.css";
import Card from "../Card/Card";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

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

function Prateleira({ title, itens }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 250,
    slidesToShow: 3.5,
    slidesToScroll: 2,
    initialSlide: 0, // 🔹 garante que sempre comece do início
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    draggable: true, // 👈 permite arrastar com o mouse (desktop)
    swipeToSlide: true, // 👈 permite parar em qualquer slide (mobile ou desktop)
    // cancelable: false,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3.5,
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

  return (
    <div className="prateleira" id={title}>
      <h1>{title}</h1>
      <Slider {...settings} className="carroussel">
        {itens.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </Slider>
      {/* <div className="divisa"> */}
      {/* </div> */}
      {itens.length > 3 && <hr className="divisa" />}
    </div>
  );
}

export default Prateleira;
