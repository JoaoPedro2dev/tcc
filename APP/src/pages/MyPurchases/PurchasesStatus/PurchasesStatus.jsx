import Header from "../../../componentes/Header/Header";
import "./PurchasesStatus.css";
import { useNavigate } from "react-router-dom";
import PurchasesOn from "./purchasesOn/purchasesOn.jsx";
import CanceledPurchases from "./CanceledPurchases/CanceledPurchases.jsx";
import {
  formatarMonetario,
  verificarFrete,
} from "../../../helpers/functions.jsx";
import LinkPerfil from "../../../componentes/LinkPerfil/LinkPerfil.jsx";

function PurchasesStatus() {
  const item = {
    imagem: "http://localhost/tcc/API/UPLOADS/images/imagem3.png",
    nome: "Produto 1",
    preco: 99.99,
    promocao: null,
    frete: 0.2,
    quantidade: 1,
    status: "Entregue",
    dataEntrega: "2025-06-11",
    horarioEntrega: "10:35",
    endereco: "Rua teste 5343, bairro de teste, cidade, estado",
    recebidoPor: "pessoa teste",
    recebidoDesc: "Proprietario",
    dataEmissaoNF: "",
    linkNF: "#",
    reembolso: false,
  };

  // const item = {
  //   imagem: "http://localhost/tcc/API/UPLOADS/images/imagem3.png",
  //   nome: "Produto 1",
  //   preco: 99.99,
  //   promocao: 0,
  //   frete: 0,
  //   quantidade: 1,
  //   status: "Cancelado por você",
  //   dataEntrega: "",
  //   horarioEntrega: "",
  //   endereco: "Rua teste 5343, bairro de teste, cidade, estado",
  //   recebidoPor: "",
  //   recebidoDesc: "",
  //   dataEmissaoNF: "",
  //   linkNF: "",
  //   reembolso: true,
  //   dataCancelamento: "2025-01-02",
  //   motivoCancelamento: "Acabei me arrependendo da compra.",
  //   metodoPagamento: "Boleto",
  // };

  const navigate = useNavigate();

  return (
    <div id="purchasesStatusBody">
      <Header />
      <main>
        <section>
          <div>
            <LinkPerfil />
            <img src={item.imagem} alt={item.nome} />

            <h2>{item.nome}</h2>

            <div>
              {item.promocao ? (
                <div>
                  <h1>{formatarMonetario(item.promocao)}</h1>

                  <p className="colorGray line-through">
                    {formatarMonetario(item.preco)}
                  </p>
                </div>
              ) : (
                <h1>{formatarMonetario(item.preco)}</h1>
              )}
            </div>

            <p className={item.frete <= 0 && "colorGreen"}>
              Frete: {verificarFrete(item.frete)}
            </p>

            <p>
              {item.quantidade} unidade{item.quantidade > 1 && "s"}
            </p>
          </div>

          <hr />
          {item.status === "Entregue" ? (
            <PurchasesOn item={item} />
          ) : (
            <CanceledPurchases item={item} />
          )}
        </section>
      </main>
      <button
        id="backBtn"
        onClick={() => {
          navigate("/minhas-compras");
        }}
      >
        Voltar a meus produtos
      </button>
    </div>
  );
}

export default PurchasesStatus;
