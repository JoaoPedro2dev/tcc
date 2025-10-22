import Card from "../../componentes/Card/Card.jsx";
import "./paginaVendedor.css";
import Header from "../../componentes/Header/Header.jsx";
import {
  CircleFadingPlus,
  CirclePlus,
  MapPinPlus,
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
  const admin = true;

  const [loja, setLoja] = useState({});
  const [dataInicioFormat, setDataInicioFormat] = useState("");
  const [estaAbertaAgora, setEstaAbertaAgora] = useState(false);

  const [produtos, setProdutos] = useState([]);

  const hoje = new Date();
  const diaSemana = hoje.getDay();
  const horaAtual = hoje.getHours();

  useEffect(() => {
    fetch(`http://localhost/tcc/API/GET/vendedor?seller=${sellerUrl}`)
      .then((r) => r.json())
      .then((data) => {
        setLoja(data);
        // data.seller_id = parseInt(data.seller_id);

        fetch("http://localhost/tcc/API/GET/seller_products", {
          method: "POST",
          body: new URLSearchParams({ seller_id: data.id }),
        })
          .then((r) => r.json())
          .then((data) => {
            console.log(data);
            setProdutos(data);
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

  function addProductLink() {
    navigate("/paginavendedor/adicionar-produto");
  }

  if (!loja?.id) {
    return;
  }

  console.log("usuario", user);
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
              {produtos?.length > 1 && `${produtos.length} Produtos á venda`}
            </p>
          </div>

          <p>Iniciou em {dataInicioFormat}</p>
        </div>
        {user?.nivel_acesso === "vendedor" && user.id === loja.id_pessoa && (
          <button
            className="borderRadius boxShadow editar-pencil"
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
          <p className="descricao">
            {loja.seller_description ??
              `Olá somos ${loja.store_name}, e Convidamos-lhe  para conhecer nossos produtos feitos com carinho para você!`}
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
              {`${loja.open_hours}
              às ${loja.close_hours}`}
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
                  <button id="address-add">
                    Mudar endereço <MapPinPlus />
                  </button>
                )}
            </>
          ) : (
            user?.nivel_acesso === "vendedor" &&
            user?.id === loja.id_pessoa && (
              <button id="address-add">
                Adicionar endereço <MapPinPlus />
              </button>
            )
          )}
        </aside>

        <section className="borderRadius boxShadow">
          {produtos?.length > 0 ? (
            <div>
              <h2>Produtos à venda</h2>
              <div className="lista-cards">
                {admin && (
                  <div id="addItem" onClick={addProductLink}>
                    <CircleFadingPlus size={50} />
                    {/* <CircleFadingPlus /> */}
                    <p className="bold">Adicionar produto</p>
                  </div>
                )}

                {produtos.map((produto) => (
                  <Card
                    key={produto.id}
                    item={produto}
                    salesPage={admin && true}
                    isProfile={true}
                  />
                ))}
              </div>
            </div>
          ) : user?.nivel_acesso === "vendedor" &&
            user?.id === loja.id_pessoa ? (
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
          ) : (
            <div>
              <h2>Este vendedor ainda não possui produtos</h2>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default PaginaVendedor;
