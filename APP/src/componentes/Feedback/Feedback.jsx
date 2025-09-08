import React, { useEffect, useState } from "react";
import "./feedback.css";

const FeedbackPopup = ({ message, type = "info", onClose }) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => handleClose(), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // tempo da animação
  };

  return (
    <div className="feedback-overlay">
      <div className={`feedback-popup ${type} ${closing ? "closing" : ""}`}>
        <p>{message}</p>
        <button onClick={handleClose}>Ok</button>
      </div>
    </div>
  );
};

export default FeedbackPopup;
