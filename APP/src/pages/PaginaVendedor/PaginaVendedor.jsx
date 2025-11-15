import Card from "../../componentes/Card/Card.jsx";
import "./paginaVendedor.css";
import Header from "../../componentes/Header/Header.jsx";
import {
  CircleFadingPlus,
  CirclePlus,
  PackageSearch,
  Pencil,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext.jsx";

function PaginaVendedor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sellerUrl = searchParams.get("seller");

  const { user } = useUser();
  // const admin = user?.id_vendedor = produtos;

  const [loja, setLoja] = useState({});
  const [dataInicioFormat, setDataInicioFormat] = useState("");
  const [estaAbertaAgora, setEstaAbertaAgora] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [todosProdutos, setTodosProdutos] = useState([]);

  // novo estado de filtro
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const horaAtual = hoje.getHours();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch(`http://localhost/tcc/API/GET/vendedor?seller=${sellerUrl}`)
      .then((r) => r.json())
      .then((data) => {
        setLoja(data);

        fetch("http://localhost/tcc/API/GET/seller_products", {
          method: "POST",
          body: new URLSearchParams({ seller_id: data.id }),
        })
          .then((r) => r.json())
          .then((data) => {
            console.log(data);
            setProdutos(data);
            setTodosProdutos(data);
          });
      });
  }, []);

  useEffect(() => {
    if (!loja.criado_em) return;

    const [ano, mes, dia] = loja.criado_em.split(" ")[0].split("-");
    setDataInicioFormat(
      new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })
    );

    const abre = parseInt(loja?.open_hours?.split(":")[0] ?? null);
    const fecha = parseInt(loja?.close_hours?.split(":")[0] ?? null);

    const abertaHoje =
      (diaSemana >= 1 && diaSemana <= 5) ||
      (loja.weekend && (diaSemana === 0 || diaSemana === 6));

    setEstaAbertaAgora(abertaHoje && horaAtual >= abre && horaAtual < fecha);
  }, [loja]);

  useEffect(() => {
    setAdmin(user?.seller_id === loja.id ? true : false);
  }, [user, loja]);

  function addProductLink() {
    navigate("/paginavendedor/adicionar-produto");
  }

  if (!loja?.id) {
    return null;
  }

  // Deriva produtos filtrados (sem alterar o array original)
  const produtosFiltrados = todosProdutos?.filter((p) => {
    if (filtroAtivo === "sem_stock") {
      return (
        p.itenStock?.reduce(
          (total, item) => total + Number(item.qnt || 0),
          0
        ) || 0
      );
    }

    if (filtroAtivo === "todos") return true;
    if (filtroAtivo === "em_promocao") return p.promotionPrice > 0;
    if (filtroAtivo === "frete_gratis") return p.shippingCost === 0;
    // comparação direta, mantendo acentos e letras maiúsculas
    return p.category === filtroAtivo;
  });

  return (
    <div id="pagina-vendedor">
      <Header />

      <div id="backgroundImage">
        <img
          src={loja.banner ? loja.banner : "/noBackgroundImage.png"}
          onError={(e) => (e.currentTarget.src = "/noBackgroundImg.png")}
          alt="banner da loja"
        />
      </div>

      <section className="cabecalho-loja">
        <img
          src={loja.profile_photo ? loja.profile_photo : "/noImg.png"}
          onError={(e) => (e.currentTarget.src = "/noImg.png")}
          alt="Logo da loja"
          className="logo"
        />
        <div>
          <h1>{loja.store_name}</h1>

          <div>
            {loja.itens_sold > 5 && <p>Mais de {loja.itens_sold - 1} vendas</p>}
            {loja.itens_sold > 5 && <span>|</span>}
            <p>
              {produtos?.length > 1 && `${produtos.length} Produtos à venda`}
            </p>
          </div>

          <p>Iniciou em {dataInicioFormat}</p>
        </div>
        {user?.nivel_acesso === "vendedor" && user.id === loja.id_pessoa && (
          <button
            className="borderRadius editar-pencil"
            onClick={() => {
              navigate("/paginavendedor/editar-perfil");
            }}
          >
            <Pencil />
          </button>
        )}
      </section>

      <main>
        <aside className="borderRadius">
          <p className="descricao">
            {loja.seller_description ??
              `Olá, somos ${loja.store_name}, e convidamos você a conhecer nossos produtos feitos com carinho!`}
          </p>

          <hr />

          <p
            className="small"
            style={{ marginBottom: "15px", textAlign: "center" }}
          >
            Funcionamento Presencial
          </p>

          <div>
            <p>
              <strong>Horário de Funcionamento:</strong>{" "}
              {`${loja.open_hours} às ${loja.close_hours}`}
            </p>

            {loja.telefone_contato && (
              <p>
                <strong>Telefone:</strong> {loja.telefone}
              </p>
            )}

            <p>
              <strong>Final de Semana:</strong>{" "}
              {loja.weekend ? "Atende" : "Não atende"}
            </p>

            <p>
              <strong>Status: </strong>
              <span className={estaAbertaAgora ? "green" : "red"}>
                {estaAbertaAgora ? "Aberta agora" : "Fechada"}
              </span>
            </p>
          </div>

          {loja.store_address ? (
            <>
              <p className="small" style={{ marginTop: "15px" }}>
                Endereço: {loja.store_address}
              </p>

              {user?.nivel_acesso === "vendedor" &&
                user?.id === loja.id_pessoa && (
                  <button
                    id="address-add"
                    onClick={() => {
                      navigate("/paginavendedor/editar-perfil");
                    }}
                  >
                    Editar Perfil <Pencil />
                  </button>
                )}
            </>
          ) : (
            user?.nivel_acesso === "vendedor" &&
            user?.id === loja.id_pessoa && (
              <button
                id="address-add"
                onClick={() => {
                  navigate("/paginavendedor/editar-perfil");
                }}
              >
                Editar perfil <Pencil />
              </button>
            )
          )}
        </aside>

        <section className="borderRadius">
          {todosProdutos?.length > 0 ? (
            <div>
              <h2>Produtos à venda</h2>

              {/* --- MENU DE FILTRO MODERNO --- */}
              <div className="menu-filtro">
                {[
                  { label: "Todos", value: "todos" },
                  { label: "Sem stock", value: "sem_stock" },
                  { label: "Camisas", value: "Camisas" },
                  { label: "Calças", value: "Calças" },
                  { label: "Calçados", value: "Calçados" },
                  { label: "Acessórios", value: "Acessórios" },
                  { label: "Shorts", value: "Shorts" },
                  { label: "Infantil", value: "Infantil" },
                  { label: "Em promoção", value: "em_promocao" },
                  { label: "Frete grátis", value: "frete_gratis" },
                ].map((filtro) =>
                  filtro.value === "sem_stock" ? (
                    admin && (
                      <button
                        key={filtro.value}
                        className={`filtro-botao stock ${
                          filtroAtivo === filtro.value ? "ativo" : ""
                        }`}
                        onClick={() => setFiltroAtivo(filtro.value)}
                      >
                        {filtro.label}
                      </button>
                    )
                  ) : (
                    <button
                      key={filtro.value}
                      className={`filtro-botao ${
                        filtroAtivo === filtro.value ? "ativo" : ""
                      }`}
                      onClick={() => setFiltroAtivo(filtro.value)}
                    >
                      {filtro.label}
                    </button>
                  )
                )}
              </div>
              {/* --- FIM MENU DE FILTRO --- */}

              <div className="lista-cards">
                {admin && (
                  <div id="addItem" onClick={addProductLink}>
                    <CircleFadingPlus size={50} />
                    <p className="bold">Adicionar produto</p>
                  </div>
                )}

                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto) => (
                    <Card
                      key={produto.id}
                      item={produto}
                      salesPage={admin && true}
                      isProfile={true}
                      showPorcentage={true}
                    />
                  ))
                ) : (
                  <p>
                    {filtroAtivo === "sem_stock"
                      ? "Não encontramos produtos sem stock"
                      : "Não encontramos produtos para este filtro"}
                  </p>
                )}
              </div>
            </div>
          ) : user?.nivel_acesso === "vendedor" &&
            user?.id === loja.id_pessoa ? (
            <div className="noItens">
              <h2 className="textCenter">
                {admin ? "Você ainda" : "Este vendedor"} ainda não possui
                produtos à venda
              </h2>

              {admin && (
                <p className="colorGray textCenter">
                  Comece a vender conosco e desfrute de nossa tecnologia. Será
                  um prazer trabalhar com você.
                </p>
              )}

              <PackageSearch size={100} />

              {admin && (
                <button className="borderRadius" onClick={addProductLink}>
                  <CirclePlus /> Adicionar produto
                </button>
              )}
            </div>
          ) : (
            <div id="no_seller-itens-container">
              <div id="no-seller-itens">
                <p>Este vendedor ainda não possui produtos à venda</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PaginaVendedor;
