import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./carousel.css";

const imagens = [
  "http://localhost/tcc/API/UPLOADS/carroussel/anuncio-dnv-wear-1",
  "http://localhost/tcc/API/UPLOADS/carroussel/anuncio-dnv-wear-2",
  "http://localhost/tcc/API/UPLOADS/carroussel/anuncio-dnv-wear-3",
];

// Removido o className herdado do slick
const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    <ChevronLeft size={32} color="#fff" />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    <ChevronRight size={32} color="#fff" />
  </div>
);

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings} className="slider">
        {imagens.map((src, index) => (
          <div key={index} id="imgContainer">
            <img
              src={src}
              alt={`Slide ${index}`}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                outline: "none",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
