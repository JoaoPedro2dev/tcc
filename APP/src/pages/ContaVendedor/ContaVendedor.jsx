import { useState } from "react";
import "./contaVendedor.css";
import { useNavigate } from "react-router-dom";

function ContaVendedor() {
  const navigate = useNavigate();

  const [errorsParagraph, setErrorsParagraph] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    loja: "",
    cnpj: "",
    senha: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      nome: "Campo obrigatório",
      cpf: "Campo obrigatório",
      email: "Campo obrigatório",
      telefone: "Campo obrigatório",
      loja: "Campo obrigatório",
      cnpj: "Campo obrigatório",
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
          <label htmlFor="telefone">Telefone</label>
          <input type="tel" id="telefone" placeholder="(XX) XXXXX-XXXX" />
          <p
            className="input-error"
            style={{ display: errorsParagraph.telefone ? "block" : "none" }}
          >
            {errorsParagraph.telefone}
          </p>
        </div>

        <div className="input-group">
          <label htmlFor="loja">Nome da loja</label>
          <input
            type="text"
            id="loja"
            placeholder="Digite o nome da sua loja"
          />
          <p
            className="input-error"
            style={{ display: errorsParagraph.loja ? "block" : "none" }}
          >
            {errorsParagraph.loja}
          </p>
        </div>

        <div className="input-group">
          <label htmlFor="cnpj">CNPJ</label>
          <input type="text" id="cnpj" placeholder="Digite seu CNPJ" />
          <p
            className="input-error"
            style={{ display: errorsParagraph.cnpj ? "block" : "none" }}
          >
            {errorsParagraph.cnpj}
          </p>
        </div>

        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" placeholder="Crie uma senha" />
          <p
            className="input-error"
            style={{ display: errorsParagraph.senha ? "block" : "none" }}
          >
            {errorsParagraph.senha}
          </p>
        </div>

        <button type="submit" className="btn-criar-conta">
          Criar conta de vendedor
        </button>

        <p className="voltar-login">
          Já é vendedor?{" "}
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

export default ContaVendedor;
