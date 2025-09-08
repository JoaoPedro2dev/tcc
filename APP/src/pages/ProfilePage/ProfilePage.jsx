import React from "react";
import "./ProfilePage.css";
import NotFound from "../notFound/NotFound";
import Header from "../../componentes/Header/Header";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return <NotFound />;

  return (
    <div className="profile-page">
      <Header />

      {/* MAIN */}
      <main className="profile-main">
        {/* SEÇÃO 1 - Informações de Perfil */}
        <section className="profile-section">
          <h2>Informações de Perfil</h2>
          <div className="profile-info">
            <img
              src={user.img}
              alt="Foto de Perfil"
              className="profile-photo"
            />
            <div>
              <p>
                <strong>Primeiro Nome:</strong> {user.firstName}
              </p>
              <p>
                <strong>Último Nome:</strong> {user.lastName}
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
          <div className="profile-data">
            <p>
              <strong>CPF:</strong> 123.456.789-00
            </p>
            <p>
              <strong>Email:</strong> joao@email.com
            </p>
            <p>
              <strong>Telefone:</strong> (11) 98765-4321
            </p>
            <p>
              <strong>Senha:</strong> ********
            </p>
          </div>
          <button className="edit-btn">Editar</button>
        </section>

        {/* SEÇÃO 3 - Endereço */}
        <section className="profile-section">
          <h2>Endereço</h2>
          <div className="profile-data">
            <p>
              <strong>Rua:</strong> Avenida Paulista
            </p>
            <p>
              <strong>Número:</strong> 123
            </p>
            <p>
              <strong>Complemento:</strong> Apto 45
            </p>
            <p>
              <strong>Bairro:</strong> Bela Vista
            </p>
            <p>
              <strong>Cidade:</strong> São Paulo
            </p>
            <p>
              <strong>Estado:</strong> SP
            </p>
            <p>
              <strong>CEP:</strong> 01311-000
            </p>
          </div>
          <button className="edit-btn">Editar</button>
        </section>
      </main>
    </div>
  );
}
