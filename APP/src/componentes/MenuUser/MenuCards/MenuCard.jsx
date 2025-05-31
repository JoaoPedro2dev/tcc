import "./menuCard.css";
import { useNavigate } from "react-router-dom";

function MenuCard({ icon, title, link }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(link);
      }}
      className="menu-card"
    >
      {icon}
      <p>{title}</p>
    </div>
  );
}

export default MenuCard;
