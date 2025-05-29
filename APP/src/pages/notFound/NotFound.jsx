import "./NotFound.css";

function NotFound() {
  return (
    <div id="notFoundContainer">
      <strong>Shoes Shop</strong>

      <h1>Não encontramos sua página</h1>

      <p>
        Não encontramos sua página, volte para a página anterior ou procure na{" "}
        <a href="./">Pagina inicial</a>
      </p>

      <a id="indexBtn" href="./">
        Ver produtos
      </a>

      <p>&copy; Todos os direitos reservados</p>
    </div>
  );
}

export default NotFound;
