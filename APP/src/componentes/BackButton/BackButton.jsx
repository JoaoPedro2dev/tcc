import { useNavigate } from "react-router-dom";
import "./BackButton.css";
import { ArrowLeft } from "lucide-react";

function BackButton({ backTo }) {
  const navigate = useNavigate();

  return (
    <button
      id="backButton"
      onClick={() => {
        navigate(backTo ?? -1);
      }}
    >
      <ArrowLeft />
    </button>
  );
}

export default BackButton;
