import Card from "../../componentes/Card/Card.jsx";
import "./paginaVendedor.css";
import Header from "../../componentes/Header/Header.jsx";
(".");

function PaginaVendedor() {
  const loja = {
    nome: "Padaria do Bairro",
    descricao:
      "A melhor padaria da vizinhança, com pães fresquinhos todos os dias! Venha experimentar nossas delícias caseiras e atendimento acolhedor.",
    horarioAbertura: "07:00",
    horarioFechamento: "18:00",
    telefone: "(11) 98765-4321",
    trabalhaFds: true,
    imagemFundo: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
    logo: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
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
  };

  const hoje = new Date();
  const diaSemana = hoje.getDay(); // 0 = domingo, 6 = sábado
  const horaAtual = hoje.getHours();

  const abre = parseInt(loja.horarioAbertura.split(":")[0]);
  const fecha = parseInt(loja.horarioFechamento.split(":")[0]);

  const abertaHoje =
    (diaSemana >= 1 && diaSemana <= 5) ||
    (loja.trabalhaFds && (diaSemana === 0 || diaSemana === 6));

  const estaAbertaAgora = abertaHoje && horaAtual >= abre && horaAtual < fecha;

  return (
    <div className="pagina-vendedor">
      <Header />

      <div
        className="fundo"
        style={{ backgroundImage: `url(${loja.imagemFundo})` }}
      ></div>

      <div className="cabecalho-loja">
        <img src={loja.logo} alt="Logo da loja" className="logo" />
        <h1 className="nome-loja">{loja.nome}</h1>
      </div>

      <div className="conteudo-principal">
        <div className="info-loja">
          <p className="descricao">
            <strong>Descrição:</strong> {loja.descricao}
          </p>
          <p>
            <strong>Horário de Funcionamento:</strong> {loja.horarioAbertura} às{" "}
            {loja.horarioFechamento}
          </p>
          <p>
            <strong>Telefone:</strong> {loja.telefone}
          </p>
          <p>
            <strong>Final de Semana:</strong>{" "}
            {loja.trabalhaFds ? "Atende" : "Não atende"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={estaAbertaAgora ? "status aberta" : "status fechada"}
            >
              {estaAbertaAgora ? "Aberta agora" : "Fechada"}
            </span>
          </p>
        </div>

        <div className="produtos">
          <h2>Produtos à venda</h2>
          <div className="lista-cards">
            {loja.produtos.map((produto) => (
              <Card key={produto.id} item={produto} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaginaVendedor;
