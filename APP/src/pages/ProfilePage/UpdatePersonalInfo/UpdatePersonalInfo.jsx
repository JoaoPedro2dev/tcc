"use client";

import { useEffect, useState } from "react";
import "./UpdatePersonalInfo.css";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import FeedbackPopup from "../../../componentes/Feedback/Feedback";
import Header from "../../../componentes/Header/Header";
import { formatCNPJ, formatCPF, formatPhone } from "../../../helpers/functions";
import { Save, X } from "lucide-react";

export default function UpdatePersonalInfo() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState();

  useEffect(() => {
    if (!user?.id) return;

    setFormData({
      id: user?.id || "",
      nivel_acesso: user?.nivel_acesso || "",
      cpf: user?.cpf || "",
      cnpj: user?.cnpj || "",
      email: user?.email || "",
      date_birth: user?.date_birth || "",
      telefone: user?.telefone || "",
      senha: "",
      confirmSenha: "",
    });
  }, [user]);

  const handleInputChange = (field, value) => {
    let processedValue = value;

    if (field === "cpf") {
      processedValue = formatCPF(value);
    } else if (field === "cnpj") {
      processedValue = formatCNPJ(value);
    } else if (field === "telefone") {
      processedValue = formatPhone(value);
    } else if (field === "email") {
      processedValue = value.toLowerCase().trim();
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar CPF
    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (formData.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF deve conter 11 dígitos";
    }

    if (formData.nivel_acesso == "vendedora") {
      if (!formData.cnpj.trim()) {
        newErrors.cnpj = "CNPJ é obrigatório";
      } else if (formData.cnpj.replace(/\D/g, "").length !== 14) {
        newErrors.cnpj = "CNPJ deve conter 14 dígitos";
      }
    }

    // Validar Email
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar Telefone (opcional)
    if (
      formData.telefone.trim() &&
      formData.telefone.replace(/\D/g, "").length < 10
    ) {
      newErrors.telefone = "Telefone inválido";
    }

    // Validar Senha (apenas se preenchida)
    if (formData.senha || formData.confirmSenha) {
      if (!formData.senha.trim()) {
        newErrors.senha = "Senha é obrigatória";
      } else if (formData.senha.length < 6) {
        newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
      }

      if (!formData.confirmSenha.trim()) {
        newErrors.confirmSenha = "Confirmação de senha é obrigatória";
      } else if (formData.senha !== formData.confirmSenha) {
        newErrors.confirmSenha = "As senhas não correspondem";
      }
    }

    // Validar Data de Nascimento
    if (!formData.date_birth.trim()) {
      newErrors.date_birth = "Data de nascimento é obrigatória";
    } else {
      const birthDate = new Date(formData.date_birth);
      const today = new Date();
      const minDate = new Date("1900-01-01");

      if (birthDate > today) {
        newErrors.date_birth = "Data de nascimento não pode ser futura";
      } else if (birthDate < minDate) {
        newErrors.date_birth = "Data de nascimento inválida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("clicou");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("id_usuario", formData.id);
      dataToSend.append("nivel_acesso", formData.nivel_acesso);
      dataToSend.append("cpf", formData.cpf.replace(/\D/g, ""));
      dataToSend.append("cnpj", formData.cnpj.replace(/\D/g, ""));
      dataToSend.append("email", formData.email);
      dataToSend.append("date_birth", formData.date_birth);
      dataToSend.append("telefone", formData.telefone.replace(/\D/g, ""));

      if (formData.senha) {
        dataToSend.append("senha", formData.senha);
      }

      const response = await fetch(
        "http://localhost/tcc/API/POST/usuario/personal-info-update",
        {
          method: "POST",
          body: dataToSend,
        }
      );

      const data = await response.json();

      console.log("data", data);

      if (data.success === false) {
        const newError = {};
        newError[data.field] = data.status;
        setErrors(newError);
      } else if (data === true) {
        setShowPopup(true);
        setUser((prev) => ({
          ...prev,
          cpf: formData.cpf.replace(/\D/g, ""),
          email: formData.email,
          telefone: formData.telefone.replace(/\D/g, ""),
        }));
      }
      // } catch (error) {
      //   console.error("Erro ao atualizar dados pessoais:", error);
      //   setErrors({ submit: "Erro ao atualizar dados. Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    navigate("/minhaconta");
  };

  if (!user?.id) return <div>Carregando...</div>;

  return (
    <>
      <Header title={"Editar Informações Pessoais"} link={"/minhaConta"} />

      <div className="UpdatePersonalInfoContainer">
        {showPopup && (
          <FeedbackPopup
            message="Dados pessoais atualizados com sucesso!"
            type="success"
            onClose={() => setShowPopup(false)}
          />
        )}

        <form className="personal-info-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Dados Pessoais</h3>
            <hr />
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={formData?.cpf && formatCPF(formData?.cpf)}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  className={errors.cpf ? "error" : ""}
                  placeholder="000.000.000-00"
                  maxLength="14"
                />
                {errors.cpf && (
                  <span className="error-message">{errors.cpf}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="telefone">Telefone (Opcional)</label>
                <input
                  id="telefone"
                  name="telefone"
                  type="text"
                  value={formData?.telefone && formatPhone(formData?.telefone)}
                  onChange={(e) =>
                    handleInputChange("telefone", e.target.value)
                  }
                  className={errors.telefone ? "error" : ""}
                  placeholder="Telefone para contato"
                  maxLength="15"
                />
                {errors.telefone && (
                  <span className="error-message">{errors.telefone}</span>
                )}
              </div>
            </div>

            <div className={user?.cnpj ? "form-grid-2" : ""}>
              {user?.cnpj && (
                <div className="form-group">
                  <label htmlFor="">CNPJ</label>
                  <input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    value={formData?.cnpj && formatCNPJ(formData?.cnpj)}
                    onChange={(e) => handleInputChange("cnpj", e.target.value)}
                    className={errors.cnpj ? "error" : ""}
                    placeholder="00.000.000/000-00"
                    maxLength="18"
                  />
                  {errors.cnpj && (
                    <span className="error-message">{errors.cnpj}</span>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="data-nascimento">Data de nascimento</label>
                <input
                  type="date"
                  name="date_birth"
                  id="date_birth"
                  value={formData?.date_birth}
                  onChange={(e) =>
                    handleInputChange("date_birth", e.target.value)
                  }
                  className={errors.date_birth ? "error" : ""}
                />
                {errors.date_birth && (
                  <span className="error-message">{errors.date_birth}</span>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "error" : ""}
                placeholder="seu.email@exemplo.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="senha">Nova Senha</label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  value={formData?.senha}
                  onChange={(e) => handleInputChange("senha", e.target.value)}
                  className={errors.senha ? "error" : ""}
                  placeholder="Digite sua nova senha"
                />
                {errors.senha && (
                  <span className="error-message">{errors.senha}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmSenha">Confirmar Senha</label>
                <input
                  id="confirmSenha"
                  name="confirmSenha"
                  type="password"
                  value={formData?.confirmSenha}
                  onChange={(e) =>
                    handleInputChange("confirmSenha", e.target.value)
                  }
                  className={errors.confirmSenha ? "error" : ""}
                  placeholder="Confirme sua nova senha"
                />
                {errors.confirmSenha && (
                  <span className="error-message">{errors.confirmSenha}</span>
                )}
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="form-error-alert">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="button secondary"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              <X size={20} strokeWidth={2} /> Cancelar
            </button>
            <button
              type="submit"
              className="button primary"
              disabled={isSubmitting}
            >
              <Save size={20} strokeWidth={2} />{" "}
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
