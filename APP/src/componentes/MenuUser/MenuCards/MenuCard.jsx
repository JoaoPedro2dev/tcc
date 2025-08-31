import LogoutConfirm from "../../LogoutConfirm/LogoutConfirm";
import "./menuCard.css";
import { useNavigate } from "react-router-dom";

function MenuCard({ icon, title, link, funcao, true2 }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(link);
        // funcao ? funcao() : navigate(link);
        funcao();
      }}
      className="menu-card"
    >
      {icon}
      <p>{title}</p>

      {true2 && <LogoutConfirm/>}
    </div>
  );
}

export default MenuCard;
