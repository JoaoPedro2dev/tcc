import { useState } from "react";
import "./contaPessoal.css";
import { useNavigate } from "react-router-dom";

function ContaPessoal() {
  const navigate = useNavigate();

  const [errorsParagraph, setErrorsParagraph] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      nome: "Campo obrigatório",
      cpf: "Campo obrigatório",
      email: "Campo obrigatório",
      senha: "Campo obrigatório",
    };

    setErrorsParagraph(newErrors);
  };

  return (
    <div className="conta-container">
      <h2 className="dnv-logo" onClick={() => navigate("/login")}>
        DNV WEAR
      </h2>

      <form className="conta-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="nome">Nome completo</label>
          <input type="text" id="nome" placeholder="Digite seu nome completo" />
          <p
            className="input-error"
            style={{ display: errorsParagraph.nome ? "block" : "none" }}
          >
            {errorsParagraph.nome}
          </p>
        </div>

        <div className="input-group">
          <label htmlFor="cpf">CPF</label>
          <input type="text" id="cpf" placeholder="Digite seu CPF" />
          <p
            className="input-error"
            style={{ display: errorsParagraph.cpf ? "block" : "none" }}
          >
            {errorsParagraph.cpf}
          </p>
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="seuemail@exemplo.com" />
          <p
            className="input-error"
            style={{ display: errorsParagraph.email ? "block" : "none" }}
          >
            {errorsParagraph.email}
          </p>
        </div>

        <div className="input-group">
          <label htmlFor="telefone">Telefone (Opcional)</label>
          <input type="tel" id="telefone" placeholder="(XX) XXXXX-XXXX" />
          {/* <p className="input-error"> </p> */}
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            required
            placeholder="Crie uma senha"
          />
          <p
            className="input-error"
            style={{ display: errorsParagraph.senha ? "block" : "none" }}
          >
            {errorsParagraph.senha}
          </p>
        </div>

        <button type="submit" className="btn-criar-conta">
          Criar conta
        </button>

        <p className="voltar-login">
          Já possui uma conta?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Fazer login
          </a>
        </p>
      </form>
    </div>
  );
}

export default ContaPessoal;
