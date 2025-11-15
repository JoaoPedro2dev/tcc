import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../componentes/Header/Header";
import TrackCard from "../../../componentes/TrackCard/TrackCard";
import "./Track.css";

function Track() {
  const navigate = useNavigate();

  const location = useLocation();
  const compraId = location.state;

  console.log(compraId);

  // return;

  if (!compraId) {
    return <></>;
  }

  return (
    <div id="trackBody">
      <Header title={"Acompanhar pedido"} />
      <main>
        <TrackCard compraId={compraId} />
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
