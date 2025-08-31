import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./contaVendedor.css";
import { useNavigate } from "react-router-dom";
import { formatPhone, formatCPF, formatCNPJ } from "../../helpers/functions";

function ContaPessoal() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    store_name: "",
    cpf: "",
    cnpj: "",
    date_birth: "",
    email: "",
    telefone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const cleanName = (value) => {
    // Remove números, caracteres especiais e espaços, mantém apenas letras e capitaliza
    const cleanedValue = value.replace(/[^a-zA-ZÀ-ÿ]/g, "");
    // Capitaliza a primeira letra
    return (
      cleanedValue.charAt(0).toUpperCase() + cleanedValue.slice(1).toLowerCase()
    );
  };

  const formatStoreName = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // Campo opcional
    const numbers = phone.replace(/\D/g, "");
    return numbers.length === 10 || numbers.length === 11;
  };

  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, "");
    return cleanCPF.length === 11;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 6;
    const hasMaxLength = password.length <= 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        hasMinLength &&
        hasMaxLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      hasMinLength,
      hasMaxLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    };
  };

  const newErrors = {};

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Nome é obrigatório";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Sobrenome é obrigatório";
    }

    if (!formData.store_name.trim()) {
      newErrors.store_name = "Nome da loja é obrigatório";
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF deve ter 11 dígitos";
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (!formatCNPJ(formData.cnpj)) {
      newErrors.cnpj = "CNPJ deve ter 14 dígitos";
    }

    if (!formData.date_birth) {
      newErrors.date_birth = "Data de nascimento é obrigatória";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (formData.telefone && !validatePhone(formData.telefone)) {
      newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!formData.password.trim()) {
      newErrors.password = "Senha é obrigatória";
    } else if (!passwordValidation.isValid) {
      const requirements = [];
      if (!passwordValidation.hasMinLength)
        requirements.push("mínimo 6 caracteres");
      if (!passwordValidation.hasMaxLength)
        requirements.push("máximo 12 caracteres");
      if (!passwordValidation.hasUpperCase)
        requirements.push("letra maiúscula");
      if (!passwordValidation.hasLowerCase)
        requirements.push("letra minúscula");
      if (!passwordValidation.hasNumbers) requirements.push("número");
      if (!passwordValidation.hasSpecialChar)
        requirements.push("caractere especial");

      newErrors.password = `Senha deve conter: ${requirements.join(", ")}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    // Aplica formatação específica por campo
    if (name === "telefone") {
      processedValue = formatPhone(value);
    } else if (name === "first_name" || name === "last_name") {
      processedValue = cleanName(value);
    } else if (name === "cpf") {
      processedValue = formatCPF(value);
    } else if (name === "cnpj") {
      processedValue = formatCNPJ(value);
    } else if (name === "store_name") {
      processedValue = formatStoreName(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simula chamada para API
      const formDados = new FormData(e.target);
      fetch(
        "http://localhost/tcc/API/POST/usuario/cadastro?nivel_acesso=vendedor",
        {
          method: "POST",
          body: formDados,
        }
      )
        .then((r) => r.json())
        .then((data) => {
          console.log("retorno API", data);

          if (data === true) {
            setTimeout(() => {
              navigate("/login");
            }, 700);
          } else if (data.success === false && data.field) {
            newErrors[data.field] = data.status;
            setErrors(newErrors);
          }
        });
      // .catch((error) => {
      //   console.log("error", error);
      // });
    } catch (error) {
      console.log(error);
      setGeneralError(
        "Erro ao processar cadastro. Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginNavigation = () => {
    // Em um projeto real, você usaria:
    // navigate('/login');
    alert("Navegaria para a página de login");
  };

  const handleSellerRegistration = () => {
    // Em um projeto real, você usaria:
    // navigate("/cadastrovendedor");
    alert("Navegaria para cadastro de vendedor");
  };

  return (
    <div className="registration-container" id="registroPage">
      <h1
        className="logo"
        onClick={() => {
          navigate("/");
        }}
      >
        MarketPlace
      </h1>

      <main className="main-content">
        <div className="registration-card">
          <div className="card-header">
            <h2>Quero ser um vendedor</h2>
            <p>Junte-se ao nosso marketplace</p>
          </div>

          {generalError && <div className="general-error">{generalError}</div>}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="first_name">Nome</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={errors.first_name ? "error" : ""}
                />
                {errors.first_name && (
                  <span className="error-message">{errors.first_name}</span>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="last_name">Sobrenome</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={errors.last_name ? "error" : ""}
                />
                {errors.last_name && (
                  <span className="error-message">{errors.last_name}</span>
                )}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="store_name">Nome da loja</label>
              <input
                type="text"
                id="store_name"
                name="store_name"
                value={formData.store_name}
                onChange={handleInputChange}
                className={errors.store_name ? "error" : ""}
              />
              {errors.store_name && (
                <span className="error-message">{errors.store_name}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className={errors.cpf ? "error" : ""}
                placeholder="000.000.000-00"
              />
              {errors.cpf && (
                <span className="error-message">{errors.cpf}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="cnpjf">CNPJ</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                className={errors.cnpj ? "error" : ""}
                placeholder="00.000.000/0000-00"
              />
              {errors.cnpj && (
                <span className="error-message">{errors.cnpj}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="date_birth">Data de Nascimento</label>
              <input
                type="date"
                id="date_birth"
                name="date_birth"
                value={formData.date_birth}
                onChange={handleInputChange}
                className={errors.date_birth ? "error" : ""}
              />
              {errors.date_birth && (
                <span className="error-message">{errors.date_birth}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="telefone">
                Telefone para contato
                <span className="optional">(opcional)</span>
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && (
                <span className="error-message">{errors.telefone}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "error" : ""}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cadastrando..." : "Criar Conta de vendedor"}
            </button>
          </form>

          <div className="form-links">
            <button
              type="button"
              className="link-button"
              onClick={handleLoginNavigation}
            >
              Já tem uma conta? Faça login
            </button>
            <button
              type="button"
              className="link-button seller-link"
              onClick={handleSellerRegistration}
            >
              Quer ser um cliente? Registre-se
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContaPessoal;
