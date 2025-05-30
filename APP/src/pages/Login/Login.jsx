import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>DNV WEAR</h2>

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

        <button type="submit" className="btn-login">
          Acessar
        </button>

        <button
          className="btn-voltar"
          onClick={() => {
            navigate("/");
          }}
        >
          Voltar
        </button>

        <p className="login-footer">
          Esqueceu a senha? <a href="#">Recuperar</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
