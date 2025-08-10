import { useNavigate } from "react-router-dom";
import "./LinkPerfil.css";

function LinkPerfil({ img, name, url }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(url)} id="linkPerfilBody">
      <img src={img} alt="foto de perfil da loja" />
      <p>{name}</p>
    </div>
  );
}

export default LinkPerfil;
