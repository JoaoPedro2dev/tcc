import Card from "../../componentes/Card/Card.jsx";
import "./paginaVendedor.css";
import Header from "../../componentes/Header/Header.jsx";
import { CirclePlus, PackageSearch, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PaginaVendedor() {
  const navigate = useNavigate();

  const loja = {
    nome: "Padaria do Bairro",
    descricao:
      "A melhor padaria da vizinhança, com pães fresquinhos todos os dias! Venha experimentar nossas delícias caseiras e atendimento acolhedor.",
    horarioAbertura: "14:00",
    horarioFechamento: "15:19",
    telefone: "(11) 98765-4321",
    whatsapp: "33610-16234",
    trabalhaFds: true,
    imagemFundo: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
    logo: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
    vendas: 22,
    produtos: [
      { id: 1, nome: "Pão Francês", categoria: "Pães", preco: 0.5 },
      { id: 2, nome: "Bolo de Cenoura", categoria: "Bolos", preco: 12.0 },
      { id: 3, nome: "Sonho com Creme", categoria: "Doces", preco: 4.0 },
      { id: 4, nome: "Croissant", categoria: "Pães", preco: 3.5 },
      { id: 5, nome: "Pão Integral", categoria: "Pães", preco: 5.0 },
      { id: 6, nome: "Torta de Maçã", categoria: "Tortas", preco: 15.0 },
      { id: 7, nome: "Café Expresso", categoria: "Bebidas", preco: 3.0 },
      { id: 8, nome: "Biscoito Caseiro", categoria: "Doces", preco: 1.5 },
    ],
    dataInicio: "2025-07-10",
  };

  const [ano, mes, dia] = loja.dataInicio.split("-");
  const dataInicioFormat = new Date(ano, mes - 1, dia).toLocaleDateString(
    "pt-BR",
    {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }
  );

  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const horaAtual = hoje.getHours();

  const abre = parseInt(loja.horarioAbertura.split(":")[0]);
  const fecha = parseInt(loja.horarioFechamento.split(":")[0]);

  const abertaHoje =
    (diaSemana >= 1 && diaSemana <= 5) ||
    (loja.trabalhaFds && (diaSemana === 0 || diaSemana === 6));

  const estaAbertaAgora = abertaHoje && horaAtual >= abre && horaAtual < fecha;

  const admin = true;

  function addProductLink() {
    navigate("/paginavendedor/adicionar-produto");
  }

  return (
    <div id="pagina-vendedor">
      <Header />

      <div
        id="backgroundImage"
        style={{ backgroundImage: `url(${loja.imagemFundo})` }}
      ></div>

      <section className="cabecalho-loja">
        <img src={loja.logo} alt="Logo da loja" className="logo" />
        <div>
          <h1>{loja.nome}</h1>

          <div>
            {loja.vendas > 5 && <p>Mais de {loja.vendas - 1} vendas</p>}
            {loja.vendas > 5 && <span>|</span>}
            <p>
              {loja.produtos.length > 1 &&
                `${loja.produtos.length} Produtos á venda`}
            </p>
          </div>

          <p>Iniciou em {dataInicioFormat}</p>
        </div>
        {admin && (
          <button
            className="borderRadius boxShadow"
            onClick={() => {
              navigate("/paginavendedor/editar-perfil");
            }}
          >
            <Pencil />
          </button>
        )}
      </section>

      <main>
        <aside className="borderRadius boxShadow">
          <p className="descricao">{loja.descricao}</p>

          <div>
            <p>
              <strong>Horário de Funcionamento:</strong>{" "}
              {`${loja.horarioAbertura}
              às ${loja.horarioFechamento}`}
            </p>

            {loja.whatsapp && (
              <p>
                <strong>WhatsApp:</strong> {loja.whatsapp}
              </p>
            )}

            <p>
              <strong>Telefone:</strong> {loja.telefone}
            </p>

            <p>
              <strong>Final de Semana:</strong>{" "}
              {loja.trabalhaFds ? "Atende" : "Não atende"}
            </p>

            <p>
              <strong>Status: </strong>
              <span className={estaAbertaAgora ? "green" : "red"}>
                {estaAbertaAgora ? "Aberta agora" : "Fechada"}
              </span>
            </p>
          </div>
        </aside>

        <section className="borderRadius boxShadow">
          {loja.produtos.length > 0 ? (
            <div>
              <h2>Produtos à venda</h2>
              <div className="lista-cards">
                {admin && (
                  <div id="addItem" onClick={addProductLink}>
                    <CirclePlus size={50} />
                    <p className="bold">Adicionar produto</p>
                  </div>
                )}

                {loja.produtos.map((produto) => (
                  <Card
                    key={produto.id}
                    item={produto}
                    salesPage={admin && true}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="noItens">
              <h2 className="textCenter">
                {admin ? "Você ainda" : "Este vendedor"} ainda não possui
                produtos á venda
              </h2>

              {admin && (
                <p className="colorGray textCenter">
                  Comece a vender conosco e desfrute de nossa tecnologia. sera
                  um prazer trabalhar com você.
                </p>
              )}

              <PackageSearch size={100} />

              {admin && (
                <button className="borderRadius" onClick={addProductLink}>
                  <CirclePlus /> Adiconar produto
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PaginaVendedor;
