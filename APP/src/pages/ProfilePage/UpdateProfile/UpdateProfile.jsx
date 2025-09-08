import React, { useState, useRef } from "react";
import { User, Camera, Save, X } from "lucide-react";
import "./UpdateProfile.css";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import FeedbackPopup from "../../../componentes/Feedback/Feedback";

export default function UpdateProfile() {
  const [showPopup, setShowPopup] = useState();
  const { user, setUser } = useUser();

  //   console.log("Form data", user);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    let processedValue = value;

    // Aplicar validações específicas para firstName e lastName
    if (field === "firstName" || field === "lastName") {
      // Remover números e espaços
      processedValue = value.replace(/[^\p{L}]/gu, "");

      // Capitalizar primeira letra
      if (processedValue.length > 0) {
        processedValue =
          processedValue.charAt(0).toUpperCase() +
          processedValue.slice(1).toLowerCase();
      }
    }

    setUser((prev) => ({ ...prev, [field]: processedValue }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setUser((prev) => ({ ...prev, img: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!user.firstName.trim()) {
      newErrors.first_name = "Primeiro nome é obrigatório";
    }

    if (!user.lastName.trim()) {
      newErrors.last_name = "Último nome é obrigatório";
    }

    if (!user.username.trim()) {
      newErrors.username = "Nome de usuário é obrigatório";
    } else if (user.username.length < 3) {
      newErrors.username = "Nome de usuário deve ter pelo menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(user.username)) {
      newErrors.username =
        "Nome de usuário pode conter apenas letras, números e underscore";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateCookie = () => {
    fetch("http://localhost/tcc/API/GET/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((dataUser) => {
        if (dataUser.success) {
          console.log("Usuário logado Update:", dataUser.user);
          setUser(dataUser.user);
          console.log("Atualizado");
        } else {
          console.log("Erro usuário:", dataUser);
        }

        console.log("função");
      })
      .catch((err) => console.error("Erro API user:", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData(e.target);
    // Simular delay de API

    console.log(formData);

    formData.set("last_photo", user.img);

    console.log(formData.last_photo);

    fetch(
      `http://localhost/tcc/API/POST/usuario/profileUpdate?nivel_acesso=${user.nivel_acesso}&id=${user.id}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((r) => r.json())
      .then((data) => {
        setIsSubmitting(true);

        console.log(data);

        if (data.success === false) {
          const newError = {};
          newError[data.field] = data.status;
          setErrors(newError);
          setIsSubmitting(false);
          return Object.keys(newError).length === 0;
        } else if (data === true) {
          setShowPopup(true);
          setIsSubmitting(false);
          updateCookie();
          console.log(data);
        }
      });
    // .catch((error) => {
    //   console.error(error);
    // });
  };

  const navigate = useNavigate();

  const handleReset = () => {
    // setUser();
    // setErrors({});
    navigate("/minhaconta");
  };

  if (!user) return <div>Error</div>;

  return (
    <div className="UpdateProfileContainer">
      {showPopup && (
        <FeedbackPopup
          message="Dados alterados com sucesso!"
          type="success" // pode ser "info", "success", "error"
          onClose={() => setShowPopup(false)}
        />
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="photo-section">
          <div className="photo-container">
            <div
              className="photo-preview"
              style={{
                backgroundImage: user.img ? `url(${user.img})` : "none",
              }}
            >
              {!user.img && <User className="default-avatar" size={48} />}
              <button
                type="button"
                className="photo-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: "none" }}
              name="profile_photo"
            />
          </div>
          <div className="photo-info">
            <h3>Foto de Perfil</h3>
            <p>Clique no ícone da câmera para alterar sua foto</p>
            {errors.profile_photo && (
              <span className="error-message">{errors.profile_photo}</span>
            )}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="first_name">Primeiro Nome</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={user.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={errors.first_name ? "error" : ""}
              placeholder="Digite seu primeiro nome"
            />
            {errors.first_name && (
              <span className="error-message">{errors.first_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Último Nome</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={user.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={errors.last_name ? "error" : ""}
              placeholder="Digite seu último nome"
            />
            {errors.last_name && (
              <span className="error-message">{errors.last_name}</span>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="username">Nome de Usuário</label>
            <input
              id="username"
              name="username"
              type="text"
              value={user.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={errors.username ? "error" : ""}
              placeholder="Digite seu nome de usuário"
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="button secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            type="submit"
            className="button primary"
            disabled={isSubmitting}
          >
            <Save size={16} />
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}

// export default ProfileForm;
