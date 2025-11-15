import "./NotFound.css";

function NotFound() {
  return (
    <div id="notFoundContainer">
      <strong>DNV WEAR</strong>

      <h2>Não encontramos sua página</h2>

      <p>
        Não encontramos sua página, volte para a página anterior ou procure na{" "}
        <a href="/">Página inicial</a>
      </p>

      <a id="indexBtn" href="/">
        Ver produtos
      </a>

      <p>&copy; DNV WEAR Todos os direitos reservados</p>
    </div>
  );
}

export default NotFound;
