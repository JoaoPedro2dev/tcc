import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    if (!email) {
      return "Email é obrigatório";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email inválido";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Senha é obrigatória";
    }
    if (password.length < 2) {
      return "Senha deve ter pelo menos 6 caracteres";
    }

    return "";
  };

  const validateLogin = (error) => {
    if (error) {
      return error;
    }

    return "";
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const navigate = useNavigate();

  const { setUser } = useUser();

  function logar(e) {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (!emailError && !passwordError) {
      setIsLoading(true);

      const formData = new FormData(e.target);

      fetch(`http://localhost/tcc/API/GET/usuario/login`, {
        credentials: "include",
        method: "POST",
        body: formData,
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data);

          if (data.success === true) {
            setTimeout(() => {
              setIsLoading(false);
              setUser(data.userData);
              navigate("/");
            }, 300);
          } else if (!data.success) {
            setIsLoading(false);

            console.log(data);

            setErrors((prev) => ({
              ...prev,
              login: validateLogin(data.status),
            }));
          }
        });
      // .catch((error) => {
      //   setIsLoading(false);
      //   console.log("erro", error);
      //   setErrors((prev) => ({
      //     ...prev,
      //     password: "Erro ao conectar com o servidor",
      //   }));
      // });
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h1
        className="logo"
        onClick={() => {
          navigate("/");
        }}
      >
        MarketPlace
      </h1>

      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Bem-vindo</h1>
          <p className="login-subtitle">Acesse sua conta para continuar</p>
        </div>

        <form onSubmit={logar} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`input-field ${
                  errors.email || errors.login ? "input-error" : ""
                }`}
                placeholder="seu@email.com"
              />
            </div>
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Senha
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`input-field ${
                  errors.password || errors.login ? "input-error" : ""
                }`}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {errors.login && (
            <span className="error-message">{errors.login}</span>
          )}

          <div className="forgot-password-container">
            <a href="#" className="forgot-password-link">
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`login-button ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? <div className="loading-spinner"></div> : "Entrar"}
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">ou</span>
        </div>

        <div className="signup-links">
          <div className="signup-option">
            <span className="signup-text">Não tem uma conta?</span>
            <a href="/contapessoal" className="signup-link user-signup">
              Criar conta de usuário
            </a>
          </div>

          <div className="signup-option">
            <span className="signup-text">Quer vender conosco?</span>
            <a href="/contavendedor" className="signup-link seller-signup">
              Criar conta de vendedor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
