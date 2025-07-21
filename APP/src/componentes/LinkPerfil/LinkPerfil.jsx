import { useNavigate } from "react-router-dom";
import "./LinkPerfil.css";

function LinkPerfil() {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/")} id="linkPerfilBody">
      <img
        src="http://localhost/tcc/API/UPLOADS/images/imagem2.png"
        alt="foto de perfil da loja"
      />
      <p>Nome da loja</p>
    </div>
  );
}

export default LinkPerfil;
