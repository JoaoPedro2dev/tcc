import { useState } from "react";
import "./cadastrarCep.css";
import { useNavigate } from "react-router-dom";

function CadastrarCep() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    cep: "",
    cidade: "",
    numero: "",
  });

  const [showData, setShowData] = useState(false);

  const mudarErros = (e) => {
    e.preventDefault();
    setErrors({ cep: "s", cidade: "s", numero: "s" });
  };

  const mostarDados = () => {
    setShowData(true);
  };

  return (
    <div className="endereco-container">
      <h2 className="dnv-logo" onClick={() => navigate("/")}>
        DNV WEAR
      </h2>

      <form className="endereco-form" onSubmit={mudarErros}>
        <div className="input-group">
          <label htmlFor="cep">CEP</label>
          <input type="text" id="cep" placeholder="Digite o CEP" />
          <p
            className="input-error"
            style={{ display: errors.cep ? "block" : "none" }}
          >
            {errors.cep}
          </p>

          <button
            type="button"
            className="btn-verificar-cep"
            onClick={mostarDados}
          >
            Verificar CEP
          </button>
        </div>

        <div style={{ display: showData ? "Block" : "none" }}>
          <div className="input-group">
            <label htmlFor="uf">UF</label>
            <input type="text" id="uf" placeholder="Estado" readOnly />
          </div>

          <div className="input-group">
            <label htmlFor="cidade">Cidade</label>
            <input type="text" id="cidade" placeholder="Cidade" readOnly />

            <p
              className="input-error"
              style={{ display: errors.cidade ? "block" : "none" }}
            >
              {errors.cidade}
            </p>
          </div>

          <div className="input-group">
            <label htmlFor="bairro">Bairro</label>
            <input type="text" id="bairro" placeholder="Bairro" readOnly />
          </div>

          <div className="input-group">
            <label htmlFor="rua">Rua</label>
            <input type="text" id="rua" placeholder="Rua" readOnly />
          </div>

          <div className="input-group">
            <label htmlFor="numero">Número da residência</label>
            <input type="text" id="numero" placeholder="Ex: 123" />
            <p
              className="input-error"
              style={{ display: errors.numero ? "block" : "none" }}
            >
              {errors.numero}
            </p>
          </div>

          <button type="submit" className="btn-cadastrar-endereco">
            Cadastrar Endereço
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarCep;
