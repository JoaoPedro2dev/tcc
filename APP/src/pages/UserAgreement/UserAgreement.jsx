import {
  Shield,
  FileText,
  Lock,
  Users,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import "./UserAgreement.css";
import { useNavigate } from "react-router-dom";

function UserAgreement() {
  const navigate = useNavigate();

  return (
    <div className="user-agreement-container">
      {/* Cabeçalho */}
      <div className="site-header">
        <div className="icon-circle blue">
          <Shield className="icon" />
        </div>
        <h1>Termos de Uso e Política de Privacidade</h1>
        <p className="lead">
          Sua privacidade e segurança são nossas prioridades. Este documento
          explica como coletamos, usamos e protegemos suas informações.
        </p>
        <div className="update">
          Última atualização: <strong>15 de Janeiro de 2025</strong>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main>
        {/* Termos de Uso */}
        <div
          className="back-btn-container"
          onClick={() => {
            navigate(-1);
          }}
        >
          <button className="back-btn">
            <ArrowLeft />
          </button>

          <p>Voltar</p>
        </div>

        <section className="card">
          <div className="section-header">
            <FileText className="icon" />
            <h2>Termos de Uso</h2>
          </div>

          <h3>Condições de Compra e Devolução</h3>
          <p>
            <strong>Compras:</strong> Ao realizar uma compra em nossa loja, você
            concorda com nossos preços, condições de pagamento e disponibilidade
            dos produtos.
          </p>
          <p>
            <strong>Devoluções:</strong> Você tem até 30 dias corridos após o
            recebimento do produto para solicitar troca ou devolução. O item
            deve estar em perfeitas condições.
          </p>
          <p>
            <strong>Reembolso:</strong> O prazo para estorno é de até 10 dias
            úteis após a confirmação da devolução.
          </p>

          <h3>Política de Entrega</h3>
          <ul>
            <li>Região Sudeste: 2 a 5 dias úteis</li>
            <li>Região Sul: 3 a 7 dias úteis</li>
            <li>Região Nordeste: 5 a 10 dias úteis</li>
            <li>Região Norte e Centro-Oeste: 7 a 12 dias úteis</li>
          </ul>

          <h3>Responsabilidades do Usuário</h3>
          <ul>
            <li>Fornecer informações verdadeiras e atualizadas</li>
            <li>Manter a confidencialidade de suas credenciais</li>
            <li>Não utilizar o site para atividades ilegais</li>
            <li>Respeitar direitos de propriedade intelectual</li>
          </ul>

          <h3>Direitos de Propriedade Intelectual</h3>
          <p>
            Todo o conteúdo presente em nosso site é protegido por leis de
            direitos autorais e propriedade intelectual. É proibida a reprodução
            sem autorização.
          </p>
        </section>

        {/* Política de Privacidade */}
        <section className="card">
          <div className="section-header">
            <Lock className="icon green" />
            <h2>Política de Privacidade</h2>
          </div>

          <h3>Dados Coletados</h3>

          <div className="highlight">
            <h4>Dados Pessoais</h4>
            <ul>
              <li>Nome completo e CPF</li>
              <li>E-mail e telefone</li>
              <li>Endereços de entrega e cobrança</li>
              <li>Data de nascimento (opcional)</li>
            </ul>
          </div>

          <div className="highlight">
            <h4>Dados de Navegação</h4>
            <ul>
              <li>Histórico de compras e produtos visualizados</li>
              <li>Preferências de navegação e filtros</li>
              <li>Cookies e sessão</li>
              <li>
                Informações do dispositivo e localização (quando permitido)
              </li>
            </ul>
          </div>

          <h3>Como Utilizamos Seus Dados</h3>
          <div className="grid-2">
            <div className="card-mini blue">
              <h4>Personalização</h4>
              <p>Recomendações com base em seu perfil</p>
            </div>
            <div className="card-mini purple">
              <h4>Comunicação</h4>
              <p>Envio de atualizações sobre pedidos e ofertas</p>
            </div>
            <div className="card-mini green">
              <h4>Processamento</h4>
              <p>Processar pedidos e pagamentos</p>
            </div>
            <div className="card-mini orange">
              <h4>Melhoria</h4>
              <p>Análise para melhorar produtos e serviços</p>
            </div>
          </div>

          <h3>Compartilhamento de Dados</h3>
          <ul>
            <li>Parceiros logísticos</li>
            <li>Processadores de pagamento</li>
            <li>Provedores de tecnologia</li>
            <li>Autoridades legais (quando exigido)</li>
          </ul>

          <h3>Medidas de Segurança</h3>
          <div className="grid-3">
            <div className="card-mini red center">
              <Shield className="icon" />
              <h4>Criptografia</h4>
              <p>SSL/TLS em todas as conexões</p>
            </div>
            <div className="card-mini blue center">
              <Lock className="icon" />
              <h4>Acesso Restrito</h4>
              <p>Controle de acesso rigoroso</p>
            </div>
            <div className="card-mini purple center">
              <Users className="icon" />
              <h4>Monitoramento</h4>
              <p>Auditoria contínua</p>
            </div>
          </div>

          <h3>Seus Direitos</h3>
          <ul>
            <li>Acesso aos Dados</li>
            <li>Correção de Dados</li>
            <li>Exclusão de Dados</li>
            <li>Portabilidade</li>
          </ul>

          <div className="note">
            Para exercer seus direitos, entre em contato:{" "}
            <strong>privacidade@lojaderoupas.com.br</strong> ou{" "}
            <strong>(11) 9999-8888</strong>.
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserAgreement;
