import React, { useRef, useState } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./imagesCarroussel.css";

const PrevArrow = ({ onClick }) => (
  <div className="ic-arrow ic-prev" onClick={onClick}>
    <ChevronLeft size={30} strokeWidth={1.5} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div className="ic-arrow ic-next" onClick={onClick}>
    <ChevronRight size={30} strokeWidth={1.5} />
  </div>
);

function ImagesCarroussel({ images }) {
  images = Array.isArray(images) ? images : images ? [images] : [];

  const sliderRef = useRef(null);
  const [slideAtual, setSlideAtual] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: images.length > 1 ? <NextArrow /> : null,
    prevArrow: images.length > 1 ? <PrevArrow /> : null,
    beforeChange: (_, next) => setSlideAtual(next),
  };

  const irParaSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  return (
    <div id="ic-body" className="ic-container">
      <Slider {...settings} ref={sliderRef} className="ic-slider">
        {images.length === 0 ? (
          <div className="ic-img-container ic-radius">
            <img
              src="/placeholder.png"
              alt="Sem imagem"
              style={{ width: "100%", height: "340px", objectFit: "contain" }}
            />
          </div>
        ) : (
          images.map((src, index) => (
            <div key={index} className="ic-img-container ic-radius">
              <img
                src={src}
                alt={`Slide ${index}`}
                style={{ width: "100%", height: "340px", objectFit: "contain" }}
              />
            </div>
          ))
        )}
      </Slider>

      {images.length > 1 && (
        <div className="ic-thumbs">
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Miniatura ${index}`}
              onClick={() => irParaSlide(index)}
              className={slideAtual === index ? "active" : ""}
              style={{
                width: 60,
                height: 50,
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImagesCarroussel;
