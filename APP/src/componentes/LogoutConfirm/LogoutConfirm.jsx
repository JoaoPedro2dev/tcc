import React, { useState } from "react";
import "./LogoutConfirm.css";
import { useUser } from "../../context/UserContext";

export default function LogoutConfirm() {
  const [showPopup, setShowPopup] = useState(true);
  const { setUser } = useUser();

  const handleConfirm = () => {
    console.log("Usuário confirmou o logout!");
    fetch("http://localhost/tcc/API/POST/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setUser(null);
          setShowPopup(false);
        } else {
          alert("Logout não realizado");
        }
      });
  };

  const handleCancel = () => {
    console.log("Usuário cancelou o logout!");
    setShowPopup(false);
    // aqui você coloca a lógica se o usuário clicar em "Não"
  };

  return (
    showPopup && (
      <div className="logout-confirm-container">
        <div className="popup-overlay">
          <div className="popup">
            <h2>Deseja realmente sair?</h2>
            <p>Se você confirmar, será desconectado da sua conta.</p>
            <div className="popup-actions">
              <button className="btn-confirm" onClick={handleConfirm}>
                Sim
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                Não
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
