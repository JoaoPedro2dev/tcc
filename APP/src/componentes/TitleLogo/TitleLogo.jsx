import { useNavigate } from "react-router-dom";
import "./TitleLogo.css";

function TitleLogo({ link = "/" }) {
  const navigate = useNavigate();
  return (
    <h1
      className="title-logo"
      onClick={() => {
        navigate(link);
      }}
    >
      Marketplace
    </h1>
  );
}

export default TitleLogo;
