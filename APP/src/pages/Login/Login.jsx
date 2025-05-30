import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2
        className="dnv-logo"
        onClick={() => {
          navigate("/");
        }}
      >
        DNV WEAR
      </h2>

      <form className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            placeholder="seuemail@exemplo.com"
          />
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" required placeholder="sua senha" />
        </div>

        <p className="pass-link">
          Esqueceu a senha? <a href="#">Recuperar</a>
        </p>

        <button type="submit" className="btn-login">
          Acessar
        </button>

        <p className="create-account-paragraph">
          <a href="/contapessoal">Crirar conta pessoal</a>
          <a href="/contavendedor">Quero ser um vendedor</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
