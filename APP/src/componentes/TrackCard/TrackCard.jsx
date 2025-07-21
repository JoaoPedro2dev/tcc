import "./TrackCard.css";

import { formatarData } from "../../helpers/functions.jsx";
import { useNavigate } from "react-router-dom";

function TrackCard() {
  const navigate = useNavigate();
  const arrayProdutos = {
    endereco: "Rua teste, numero 123213, bairro teste 2, cidade teste",
    quemRecebe: "Pessoa que recebe",
    produtos: [
      {
        id: 2,
        imagem: "http://localhost/tcc/API/UPLOADS/images/imagem2.png",
        status: "Em preparação",
        nome: "Produto de teste 2",
        dataEntrega: "2023-02-06",
        qnt: 3,
        prazo: "2025-09-11",
      },
      {
        id: 2,
        imagem: "http://localhost/tcc/API/UPLOADS/images/imagem2.png",
        status: "Chegara no prazo",
        nome: "Produto de teste 2",
        dataEntrega: "2023-02-06",
        qnt: 3,
        prazo: "2025-09-11",
      },
      {
        id: 2,
        imagem: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
        status: "Entregue",
        nome: "Produto de teste 1",
        dataEntrega: "2023-02-06",
        qnt: 3,
        prazo: "2025-09-11",
      },
      {
        id: 2,
        imagem: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
        status: "Chegou",
        nome: "Produto de teste 1",
        dataEntrega: "2023-02-06",
        qnt: 3,
        prazo: "2025-09-11",
      },
    ],
  };

  function verificarStatus(status) {
    if (status === "Chegou") {
      return "animated";
    } else if (status === "Entregue") {
      return "green";
    }
  }

  return (
    <article id="trackCardBody">
      <h1>Acompanhe seu pedido</h1>

      <p className="colorGray">Endereço: {arrayProdutos.endereco}</p>
      <p className="colorGray">Quem recebe: {arrayProdutos.quemRecebe}</p>

      <hr />

      {arrayProdutos.produtos.map((item) => (
        <section>
          <div>
            <img src={item.imagem} alt={item.nome} />
            <strong>{item.nome}</strong>
          </div>

          <div>
            {item.status != "Entregue" && item.status != "Chegou" && (
              <h2>
                Seu pedido chegara até o dia {formatarData(item.dataEntrega)}
              </h2>
            )}

            {item.status === "Entregue" && <h2>Seu pedido foi entregue</h2>}

            {item.status === "Chegou" && <h2>Seu pedido chegou</h2>}

            <div>
              <div>
                <span
                  className={item.status === "Em preparação" ? "animated" : ""}
                ></span>
                <p>Em preparação</p>
              </div>

              <div>
                <span
                  className={
                    item.status === "Chegara no prazo" ? "animated" : ""
                  }
                ></span>
                <p>Saiu para entrega</p>
              </div>

              <div>
                <span className={verificarStatus(item.status)}></span>
                <p>{item.status === "Entregue" ? "Entregue" : "Chegou"}</p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <button
        id="details-btn"
        onClick={() => navigate("/minhas-compras/detalhes")}
      >
        VER DETALHES
      </button>
    </article>
  );
}

export default TrackCard;
