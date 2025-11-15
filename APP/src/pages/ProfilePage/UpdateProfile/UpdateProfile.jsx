import React, { useState, useRef, useEffect } from "react";
import { User, Camera, Save, X } from "lucide-react";
import "./UpdateProfile.css";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import FeedbackPopup from "../../../componentes/Feedback/Feedback";
import Header from "../../../componentes/Header/Header";
import Loading from "../../../componentes/Loading/Loading";

export default function UpdateProfile() {
  const [showPopup, setShowPopup] = useState(false);
  const { user, setUser } = useUser();
  const [dataUser, setDataUser] = useState(null); // começa como null até carregar
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Buscar usuário logado ao carregar a página
  useEffect(() => {
    // if (!user) {
    fetch("http://localhost/tcc/API/GET/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          // setUser();
          // user.foto_antiga = data.user.profile_photo;
          setDataUser({ ...data.user, foto_antiga: data.user.profile_photo });
        } else {
          console.error("Erro ao buscar usuário:", data);
        }
      })
      .catch((err) => console.error("Erro na API:", err))
      .finally(() => setLoading(false));
    // setLoading(false);
  }, [user]);

  useEffect(() => {
    console.log("data user", dataUser);
  }, [dataUser]);

  const handleInputChange = (field, value) => {
    let processedValue = value;
    if (field === "first_name" || field === "last_name") {
      processedValue = value.replace(/[^\p{L}]/gu, "");
      if (processedValue.length > 0) {
        processedValue =
          processedValue.charAt(0).toUpperCase() +
          processedValue.slice(1).toLowerCase();
      }
    }
    setDataUser((prev) => ({ ...prev, [field]: processedValue }));

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
        setDataUser((prev) => ({ ...prev, profile_photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImg = () => {
    setDataUser((prev) => ({ ...prev, profile_photo: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    const newErrors = {};

    if (!dataUser?.first_name?.trim() && !dataUser?.firstName?.trim()) {
      newErrors.first_name = "Primeiro nome é obrigatório";
    }

    if (!dataUser?.last_name?.trim() && !dataUser?.lastName?.trim()) {
      newErrors.last_name = "Último nome é obrigatório";
    }

    if (!dataUser?.username?.trim()) {
      newErrors.username = "Nome de usuário é obrigatório";
    } else if (dataUser.username.length < 3) {
      newErrors.username = "Nome de usuário deve ter pelo menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(dataUser.username)) {
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
      .then((dataUserResponse) => {
        if (dataUserResponse.success) {
          setUser(dataUserResponse.user);
          setDataUser(dataUserResponse.user);
        } else {
          console.log("Erro usuário:", dataUserResponse);
        }
      })
      .catch((err) => console.error("Erro API user:", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData(e.target);

    formData.append("id", dataUser.id);
    formData.append("last_photo", user?.profile_photo || "");
    formData.append("profile_photo", dataUser.profile_photo || "removing");

    fetch(`http://localhost/tcc/API/POST/usuario/profileUpdate?nivel_acesso`, {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("dados enviados", e);

        setIsSubmitting(true);
        if (data.success === false) {
          const newError = {};
          newError[data.field] = data.status;
          setErrors(newError);
          setIsSubmitting(false);
        } else if (data === true) {
          setShowPopup(true);
          setIsSubmitting(false);
          updateCookie();
        }
      });
    // .catch((error) => console.error(error));
  };

  const handleReset = () => {
    navigate("/minhaconta");
  };

  // ✅ Exibição de carregamento
  if (loading) return <Loading />;
  if (!dataUser) return;

  return (
    <>
      <Header
        title={"Editar Perfil"}
        link={"http://localhost:5173/minhaConta"}
      />

      <div className="UpdateProfileContainer">
        {showPopup && (
          <FeedbackPopup
            message="Dados alterados com sucesso!"
            type="success"
            onClose={() => setShowPopup(false)}
          />
        )}

        <form className="profile-form" onSubmit={handleSubmit}>
          <h3>Dados do perfil</h3>
          <hr />
          <div className="photo-section">
            <div className="photo-container">
              <button
                className="remove-photo-btn"
                type="button"
                onClick={handleRemoveImg}
              >
                <X size={20} />
              </button>
              <div
                className="photo-preview"
                style={{
                  backgroundImage: dataUser.profile_photo
                    ? `url(${dataUser.profile_photo})`
                    : "none",
                }}
              >
                {!dataUser.profile_photo && (
                  <User className="default-avatar" size={48} />
                )}
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
                value={dataUser.first_name ?? dataUser.firstName ?? ""}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
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
                value={dataUser.last_name ?? dataUser.lastName ?? ""}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
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
                name="user_name"
                type="text"
                value={dataUser.username ?? ""}
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
              <X size={16} strokeWidth={2} />
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
    </>
  );
}
