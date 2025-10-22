import { useEffect, useState } from "react";
import "./cadastrarCep.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Feedback from "../../componentes/Feedback/Feedback.jsx";
import Loading from "../../componentes/Loading/Loading.jsx";
import { GetMe } from "../../helpers/functions.jsx";

function CadastrarCep() {
  const { user } = useUser();

  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    cep: "",
    cidade: "",
    numero: "",
  });
  const [showData, setShowData] = useState(false);
  const [cep, setCep] = useState(user?.cep ? user.cep : "");
  const [endereco, setEndereco] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) setIsLoading(true);

    if (user?.cep) {
      setEndereco({
        cep: user?.cep,
        uf: user?.uf,
        cidade: user?.cidade,
        complemento: user?.complemento,
        bairro: user?.bairro,
        rua: user?.rua,
        numero: user?.num_residencia,
      });

      setShowData(true);
      setCep(user.cep);
      setIsLoading(false);
    }
  }, [user]);

  function handleCEP() {
    setIsVerify(true);

    if (cep.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        cep: "Informe um CEP",
      }));
      setIsVerify(false);
      return;
    }

    if (cep.trim().length !== 8) {
      setErrors((prev) => ({
        ...prev,
        cep: "O cep deve possuir 8 digitos",
      }));
      setIsVerify(false);
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.cep) {
          if (data.localidade !== "Jaú") {
            setErrors({
              cep: "Desculpe não atendemos fora da cidade de Jaú  ",
            });
            setIsVerify(false);

            return;
          }

          console.log(data);
          setEndereco({
            cep: data.cep.replace("-", ""),
            uf: data.uf,
            cidade: data.localidade,
            complemento: data.complemento,
            bairro: data.bairro,
            rua: data.logradouro,
            numero: "",
          });

          setErrors({});
          setIsVerify(false);
          setShowData(true);
        } else if (data.erro) {
          errors.cep = "CEP não encontrado";
          setIsVerify(false);
          setShowData(false);
        }
      })
      .catch((error) => console.error("erro", error));
  }

  const [success, setSuccess] = useState(false);

  function cadastrarEndereco(e) {
    e.preventDefault();

    setIsProcessing(true);

    if (!endereco.numero || endereco.numero == 0) {
      setErrors((prev) => ({
        ...prev,
        numero: "Digite um número de residencia",
      }));
    }

    if (endereco.complemento && endereco.complemento.length < 3) {
      setErrors((prev) => ({
        ...prev,
        complemento: "Complemento não pode ser menor que 3 letras",
      }));
      setIsProcessing(false);
      return;
    }

    if (errors.length > 0) return;

    const form = new FormData();

    Object.entries(endereco).forEach(([key, value]) => {
      form.append(key, value);
    });

    form.append("user_id", user.id);

    fetch("http://localhost/tcc/API/POST/address", {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.field === "cep_localidade") {
          setErrors({
            cep: "Desculpe não atendemos fora da cidade de Jaú  ",
          });
          setIsProcessing(false);
          return;
        }

        if (data === true) {
          setSuccess(true);
        }

        setIsProcessing(false);
      });
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    user && (
      <div className="endereco-container">
        {success && (
          <Feedback
            message={
              "Endereco " +
              (user?.cep ? "atualizado" : "cadastrado") +
              " com sucesso"
            }
            type={"success"}
            link={"/"}
          />
        )}

        <h2 className="dnv-logo" onClick={() => navigate("/")}>
          DNV WEAR
        </h2>

        <form className="endereco-form" onSubmit={cadastrarEndereco}>
          <h2>Meu endereço</h2>
          <div className="input-group">
            <label htmlFor="cep">CEP</label>
            <input
              type="text"
              id="cep"
              className={errors.cep ? "erro" : ""}
              value={cep}
              placeholder="Digite o CEP"
              maxLength={8}
              onChange={(e) => {
                console.log(e.target.value);
                setCep(e.target.value);
              }}
            />
            <p
              className="input-error"
              style={{ display: errors.cep ? "block" : "none" }}
            >
              {errors.cep}
            </p>

            <button
              type="button"
              className="btn-verificar-cep"
              onClick={handleCEP}
            >
              {isVerify ? "Verificando..." : "Verificar CEP"}
            </button>
          </div>

          <div style={{ display: showData ? "Block" : "none" }}>
            <hr />

            <div className="input-group">
              <label htmlFor="uf">UF</label>
              <input
                type="text"
                id="uf"
                value={endereco.uf}
                placeholder="Estado"
                readOnly
              />
            </div>

            <div className="input-group">
              <label htmlFor="cidade">Cidade</label>
              <input
                type="text"
                id="cidade"
                value={endereco.cidade}
                placeholder="Cidade"
                readOnly
              />

              <p
                className="input-error"
                style={{ display: errors.cidade ? "block" : "none" }}
              >
                {errors.cidade}
              </p>
            </div>

            <div className="input-group">
              <label htmlFor="bairro">Bairro</label>
              <input
                type="text"
                id="bairro"
                value={endereco.bairro}
                placeholder="Bairro"
                readOnly
              />
            </div>

            <div className="input-group">
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                id="complemento"
                className={errors.complemento ? "erro" : ""}
                value={endereco?.complemento}
                placeholder="Ex: casa dos fundos"
                onChange={(e) => {
                  setEndereco({
                    ...endereco,
                    complemento: e.target.value,
                  });
                }}
              />
              <p
                className="input-error"
                style={{
                  display: errors.complemento ? "block" : "none",
                  color: "red",
                }}
              >
                {errors.complemento}
              </p>
            </div>

            <div className="input-group">
              <label htmlFor="rua">Rua</label>
              <input
                type="text"
                id="rua"
                value={endereco.rua}
                placeholder="Rua"
                readOnly
              />
            </div>

            <div className="input-group">
              <label htmlFor="numero">Número da residência</label>
              <input
                type="text"
                id="numero"
                className={errors.numero ? "erro" : ""}
                value={endereco?.numero}
                placeholder="Ex: 123"
                onChange={(e) => {
                  setEndereco({
                    ...endereco,
                    numero: e.target.value.replace(/\D/g, ""),
                  });
                }}
              />
              <p
                className="input-error"
                style={{
                  display: errors.numero ? "block" : "none",
                  color: "red",
                }}
              >
                {errors.numero}
              </p>
            </div>

            <button
              type="submit"
              className="btn-cadastrar-endereco"
              disabled={isProcessing}
            >
              {isProcessing
                ? "precessando..."
                : user.cep
                ? "Atualizar CEP"
                : "Cadastrar Endereço"}
            </button>
          </div>
        </form>
      </div>
    )
  );
}

export default CadastrarCep;
