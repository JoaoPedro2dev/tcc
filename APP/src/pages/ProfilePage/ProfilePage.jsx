import React from "react";
import "./ProfilePage.css";
import NotFound from "../notFound/NotFound";
import Header from "../../componentes/Header/Header";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  formatCNPJ,
  formatCPF,
  formatDefaultDate,
  formatPhone,
} from "../../helpers/functions";

export default function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return <NotFound />;

  return (
    <div className="profile-page">
      <Header title={"Minha Conta"} />

      {/* MAIN */}
      <main className="profile-main">
        {/* SEÇÃO 1 - Informações de Perfil */}
        <section className="profile-section">
          <h2>Informações de Perfil</h2>
          <hr />
          <div className="profile-info">
            <img
              src={user.profile_photo}
              alt="Foto de Perfil"
              className="profile-photo"
            />
            <div>
              <p>
                <strong>Primeiro Nome:</strong>{" "}
                {user.first_name ?? user.firstName}
              </p>
              <p>
                <strong>Último Nome:</strong> {user.last_name ?? user.lastName}
              </p>
              <p>
                <strong>Usuário:</strong> {user.username}
              </p>
            </div>
          </div>
          <button
            className="edit-btn"
            onClick={() => {
              navigate("/minhaconta/editar-perfil");
            }}
          >
            Editar
          </button>
        </section>

        {/* SEÇÃO 2 - Informações Pessoais */}
        <section className="profile-section">
          <h2>Informações Pessoais</h2>
          <hr />

          <div className="profile-data">
            <p>
              <strong>CPF:</strong> {formatCPF(user.cpf)}
            </p>
            {user?.cnpj && (
              <p>
                <strong>CNPJ:</strong> {formatCNPJ(user.cnpj)}
              </p>
            )}
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Data de nascimento:</strong>{" "}
              {formatDefaultDate(user.date_birth)}
            </p>
            <p>
              <strong>Telefone:</strong>{" "}
              {user?.telefone ? formatPhone(user?.telefone) : "Não informado"}
            </p>
            <p>
              <strong>Senha:</strong> ******...
            </p>
          </div>
          <button
            className="edit-btn"
            onClick={() => {
              navigate("/minhaconta/editar-informacoes");
            }}
          >
            Editar
          </button>
        </section>

        {/* SEÇÃO 3 - Endereço */}
        <section className="profile-section">
          <h2>Endereço</h2>
          <hr />

          {user?.cep ? (
            <div className="profile-data">
              <p>
                <strong>Rua:</strong> {user?.rua}
              </p>
              <p>
                <strong>Número:</strong> {user?.num_residencia}
              </p>
              {user?.complemento != null && (
                <p>
                  <strong>Complemento:</strong> {user?.complemento}
                </p>
              )}
              <p>
                <strong>Bairro:</strong> {user?.bairro}
              </p>
              <p>
                <strong>Cidade:</strong> {user?.cidade}
              </p>
              <p>
                <strong>Estado:</strong> {user?.uf}
              </p>
              <p>
                <strong>CEP:</strong> {user?.cep}
              </p>
            </div>
          ) : (
            <div>
              <p>Você ainda não cadastrou um endereco.</p>
              <p>
                Cadastre um endereço para que você possa fazer compras, dar
                feedbacks e aproveitar promoções.
              </p>
            </div>
          )}
          <button
            className="edit-btn"
            onClick={() => navigate("/cadastrarcep")}
          >
            {user?.cep ? "Editar" : "Cadastrar"}
          </button>
        </section>
      </main>
    </div>
  );
}
