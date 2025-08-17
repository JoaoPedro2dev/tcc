import "./prateleira.css";
import Card from "../Card/Card";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

function Prateleira({ title, itens }) {
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
    <div className="prateleira boxShadow">
      <h2>{title}</h2>
      <Slider {...settings} className="carroussel">
        {itens.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </Slider>
    </div>
  );
}

export default Prateleira;
