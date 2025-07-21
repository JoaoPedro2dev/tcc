import { useNavigate } from "react-router-dom";
import Header from "../../../componentes/Header/Header";
import TrackCard from "../../../componentes/TrackCard/TrackCard";
import "./Track.css";

function Track() {
  const navigate = useNavigate();

  return (
    <div id="trackBody">
      <Header />
      <main>
        <TrackCard />
      </main>

      <button
        id="backBtn"
        onClick={() => {
          navigate("/minhas-compras");
        }}
      >
        Voltar a meus produtos
      </button>
    </div>
  );
}

export default Track;
