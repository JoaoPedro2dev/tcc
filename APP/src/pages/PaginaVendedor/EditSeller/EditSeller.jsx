"use client";

import { useState, useEffect } from "react";
import { Save, Upload, X, ArrowLeft, Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./EditSeller.css";
import { useUser } from "../../../context/UserContext";
import Header from "../../../componentes/Header/Header";
import Loading from "../../../componentes/Loading/Loading";
import { formatPhone } from "../../../helpers/functions";
import FeedbackPopup from "../../../componentes/Feedback/Feedback";

function EditarPerfilVendedor() {
  const navigate = useNavigate();

  const { user } = useUser();
  const [formData, setFormData] = useState({
    store_name: "",
    seller_description: "",
    profile_photo: "",
    banner: "",
    open_hours: "",
    close_hours: "",
    telefone_contato: "",
    weekend: "nao",
    store_address: "",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    num_loja: "",
    complemento: null,
    uf: "",
  });
  const [errors, setErrors] = useState();

  const [previewProfilePhoto, setPreviewProfilePhoto] = useState("");
  const [previewBanner, setPreviewBanner] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [showCepModal, setShowCepModal] = useState(false);
  const [cep, setCep] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [cepData, setCepData] = useState(null);
  const [cepError, setCepError] = useState("");
  const [numeroResidencia, setNumeroResidencia] = useState("");
  const [numeroError, setNumeroError] = useState("");

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user?.url) return;

    fetch(`http://localhost/tcc/API/GET/vendedor?seller=${user?.url}`)
      .then((r) => r.json())
      .then((data) => {
        console.log("dados user", data);
        setFormData(data);
        setPreviewProfilePhoto(data.profile_photo);
        setPreviewBanner(data.banner);
      });
    // .catch((error) => console.error(error));
  }, [user]);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      const scrollElement = document.querySelector(".error-border");
      if (scrollElement) {
        setTimeout(() => {
          const offset = 200; // pixels acima do elemento
          const elementPosition =
            scrollElement.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: "smooth",
          });
        }, 100); // pequena pausa pra estabilizar o layout
      }
    }
  }, [errors]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "sim" : "nao") : value,
    }));

    if (errors?.[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "profile") {
        setPreviewProfilePhoto(reader.result);
        setFormData((prev) => ({
          ...prev,
          new_profile_photo: file,
        }));
      } else {
        setPreviewBanner(reader.result);
        setFormData((prev) => ({ ...prev, new_banner: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (type) => {
    if (type === "profile") {
      setPreviewProfilePhoto("");
      setFormData((prev) => ({ ...prev, new_profile_photo: "" }));
    } else {
      setPreviewBanner("");
      setFormData((prev) => ({ ...prev, new_banner: "" }));
    }
  };

  const handleOpenCepModal = () => {
    setShowCepModal(true);
    setCep("");
    setCepData(null);
    setCepError("");
    setNumeroResidencia("");
    setNumeroError("");
  };

  const handleCloseCepModal = () => {
    setShowCepModal(false);
  };

  const handleVerifyCep = () => {
    setIsVerifying(true);
    setCepError("");

    if (cep.trim() === "") {
      setCepError("Informe um CEP");
      setIsVerifying(false);
      return;
    }

    if (cep.trim().length !== 8) {
      setCepError("O CEP deve possuir 8 dígitos");
      setIsVerifying(false);
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.erro) {
          setCepError("CEP não encontrado");
          setCepData(null);
          setIsVerifying(false);
          return;
        }

        if (data.cep) {
          setCepData({
            cep: data.cep.replace("-", ""),
            uf: data.uf,
            cidade: data.localidade,
            bairro: data.bairro,
            rua: data.logradouro,
            complemento: data.complemento || "",
          });
          setCepError("");
          setIsVerifying(false);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar CEP:", error);
        setCepError("Erro ao buscar CEP. Tente novamente.");
        setIsVerifying(false);
      });
  };

  const handleConfirmAddress = () => {
    if (!numeroResidencia || numeroResidencia.trim() === "") {
      setNumeroError("Digite um número de residência");
      return;
    }

    // Format: "Rua, Número - Bairro, Cidade - UF, CEP"
    const formattedAddress = `${cepData.rua}, ${numeroResidencia} - ${cepData.bairro}, ${cepData.cidade} - ${cepData.uf}, ${cepData.cep}`;

    setFormData((prev) => ({
      ...prev,
      store_address: formattedAddress,
      cep: cepData.cep,
      rua: cepData.rua,
      bairro: cepData.bairro,
      cidade: cepData.cidade,
      num_loja: numeroResidencia,
      complemento: cepData.complemento || null,
      uf: cepData.uf,
    }));

    handleCloseCepModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const form = new FormData();

    Object.entries(formData).forEach(([Key, value]) => {
      form.append(Key, value ?? "");
    });

    form.append("id", user.id);

    // console.log("dados front", formData);

    fetch("http://localhost/tcc/API/POST/update/vendedor", {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("data", data);

        if (data.success == false) {
          const newError = {};
          newError[data.field] = data.status;
          setErrors(newError);
          setIsSaving(false);

          return;
        }

        setIsSaving(false);
        setSuccess(true);
      });
    // .catch((error) => {
    //   console.error(error);
    // });
  };

  const handleCancel = () => {
    if (window.confirm("Deseja descartar as alterações?")) {
      navigate(-1);
    }
  };

  // if (!user?.id) {
  //   window.location.href = "/login";
  //   // return;
  // }

  if (!formData?.id) {
    return <Loading />;
  }

  return (
    <div id="editar-perfil-vendedor">
      {showCepModal && (
        <div className="modal-overlay" onClick={handleCloseCepModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Buscar Endereço por CEP</h3>
              <button className="modal-close-btn" onClick={handleCloseCepModal}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="cep-input">CEP</label>
                <input
                  type="text"
                  id="cep-input"
                  className={cepError ? "input-error" : ""}
                  value={cep}
                  placeholder="Digite o CEP (somente números)"
                  maxLength={8}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
                />
                {cepError && <p className="error-message">{cepError}</p>}

                <button
                  type="button"
                  className="btn-verify-cep"
                  onClick={handleVerifyCep}
                  disabled={isVerifying}
                >
                  {isVerifying ? "Verificando..." : "Verificar CEP"}
                </button>
              </div>

              {cepData && (
                <div className="cep-data-container">
                  <hr className="divider" />

                  <div className="form-group">
                    <label>UF</label>
                    <input type="text" value={cepData.uf} readOnly />
                  </div>

                  <div className="form-group">
                    <label>Cidade</label>
                    <input type="text" value={cepData.cidade} readOnly />
                  </div>

                  <div className="form-group">
                    <label>Bairro</label>
                    <input type="text" value={cepData.bairro} readOnly />
                  </div>

                  <div className="form-group">
                    <label>Rua</label>
                    <input type="text" value={cepData.rua} readOnly />
                  </div>

                  {cepData.complemento && (
                    <div className="form-group">
                      <label>Complemento</label>
                      <input type="text" value={cepData.complemento} readOnly />
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="numero-residencia">
                      Número da Residência *
                    </label>
                    <input
                      type="text"
                      id="numero-residencia"
                      className={numeroError ? "input-error" : ""}
                      value={numeroResidencia}
                      placeholder="Ex: 123"
                      onChange={(e) => {
                        setNumeroResidencia(e.target.value.replace(/\D/g, ""));
                        setNumeroError("");
                      }}
                    />
                    {numeroError && (
                      <p className="error-message">{numeroError}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-confirm-address"
                    onClick={handleConfirmAddress}
                  >
                    <MapPin size={20} />
                    Confirmar Endereço
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {success && (
        <FeedbackPopup
          message={"Suas alterações foram salvas com sucesso"}
          type="success"
          onClose={() => {
            setSuccess(false);
          }}
        />
      )}

      <Header title={"Editar Perfil"} />

      <form onSubmit={handleSubmit}>
        {/* Banner Section */}
        <section className="image-section banner-section">
          <h2>Banner da Loja</h2>
          <p className="section-description">
            Imagem de fundo do perfil (recomendado: 1200x320px)
          </p>

          <div className="image-upload-container banner-container">
            {previewBanner ? (
              <div className="image-preview banner-preview">
                <img
                  src={previewBanner || "/placeholder.svg"}
                  alt="Banner preview"
                />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => handleRemoveImage("new_banner")}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="upload-placeholder banner-placeholder">
                <Upload size={40} />
                <span>Clique para adicionar banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "new_banner")}
                  hidden
                />
              </label>
            )}
          </div>
        </section>

        {/* Profile Photo Section */}
        <section className="image-section profile-section">
          <h2>Foto de Perfil</h2>
          <p className="section-description">
            Logo ou foto da loja (recomendado: 215x215px)
          </p>

          <div className="image-upload-container profile-container">
            {previewProfilePhoto ? (
              <div className="image-preview profile-preview">
                <img
                  src={previewProfilePhoto || "/placeholder.svg"}
                  alt="Profile preview"
                />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => handleRemoveImage("profile")}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <label className="upload-placeholder profile-placeholder">
                <Upload size={30} />
                <span>Adicionar foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "profile")}
                  hidden
                />
              </label>
            )}
          </div>
        </section>

        {/* Basic Info Section */}
        <section className="form-section">
          <h2>Informações Básicas</h2>

          <div className="form-group">
            <label htmlFor="store_name">Nome da Loja *</label>
            <input
              type="text"
              id="store_name"
              name="store_name"
              value={formData.store_name}
              className={errors?.store_name ? "error-border" : ""}
              onChange={handleInputChange}
              required
              placeholder="Digite o nome da sua loja"
            />
            {errors?.store_name && (
              <span className="error-message">{errors?.store_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="seller_description">Descrição da Loja</label>
            <textarea
              id="seller_description"
              className={errors?.seller_description ? "error-border" : ""}
              name="seller_description"
              value={formData.seller_description ?? ""}
              onChange={handleInputChange}
              rows="5"
              placeholder="Conte um pouco sobre sua loja e seus produtos..."
            />
            <span className="char-count">
              {formData.seller_description?.length || 0} caracteres
            </span>
            {errors?.seller_description && (
              <span className="error-message">
                {errors?.seller_description}
              </span>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="form-section">
          <h2>Contato</h2>

          <div className="form-group">
            <label htmlFor="telefone_contato">Telefone de Contato</label>
            <input
              type="tel"
              id="telefone_contato"
              className={errors?.telefone_contato ? "error-border" : ""}
              name="telefone_contato"
              value={
                formData?.telefone_contato
                  ? formatPhone(formData?.telefone_contato)
                  : ""
              }
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
            />
            {errors?.telefone_contato && (
              <span className="error-message">{errors?.telefone_contato}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="store_address">Endereço da Loja</label>
            <div className="address-input-group">
              <input
                type="text"
                id="store_address"
                className={errors?.store_address ? "error-border" : ""}
                name="store_address"
                value={formData.store_address ?? ""}
                onChange={handleInputChange}
                placeholder="Rua, Número - Bairro, Cidade - UF, CEP"
                readOnly
              />
              {errors?.store_address && (
                <span className="error-message">{errors?.store_address}</span>
              )}
              <button
                type="button"
                className="btn-search-cep"
                onClick={handleOpenCepModal}
              >
                <Search size={18} />
                Procurar por CEP
              </button>
            </div>
          </div>
        </section>

        {/* Business Hours Section */}
        <section className="form-section">
          <h2>Horário de Funcionamento</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="open_hours">Horário de abrir *</label>
              <input
                type="time"
                id="open_hours"
                className={errors?.open_hours ? "error-border" : ""}
                name="open_hours"
                value={formData.open_hours}
                onChange={handleInputChange}
                required
              />
              {errors?.open_hours && (
                <span className="error-message">{errors?.open_hours}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="close_hours">Horário de fechar *</label>
              <input
                type="time"
                id="close_hours"
                className={errors?.close_hours ? "error-border" : ""}
                name="close_hours"
                value={formData.close_hours}
                onChange={handleInputChange}
                required
              />
              {errors?.close_hours && (
                <span className="error-message">{errors?.close_hours}</span>
              )}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                className={errors?.weekend ? "error-border" : ""}
                type="checkbox"
                name="weekend"
                checked={formData.weekend === "sim"}
                onChange={handleInputChange}
              />
              <span>Atende nos finais de semana</span>
            </label>
            {errors?.weekend && (
              <span className="error-message">{errors?.weekend}</span>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X size={20} />
            Cancelar
          </button>
          <button type="submit" className="btn-save" disabled={isSaving}>
            {isSaving ? (
              <>Salvando...</>
            ) : (
              <>
                <Save size={20} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarPerfilVendedor;
