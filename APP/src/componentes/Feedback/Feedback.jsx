import React, { useEffect, useState } from "react";
import "./feedback.css";
import { useNavigate } from "react-router-dom";

const FeedbackPopup = ({ message, type = "info", onClose, link }) => {
  const navigate = useNavigate();

  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose ? onClose() : navigate(link);
    }, 500); // tempo da animação
  };

  return (
    <div className="feedback-overlay">
      <div className={`feedback-popup ${type} ${closing ? "closing" : ""}`}>
        <p>{message}</p>
        <button onClick={handleClose}>Entendi!</button>
      </div>
    </div>
  );
};

export default FeedbackPopup;
