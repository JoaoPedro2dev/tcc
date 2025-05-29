import "./prateleira.css";
import Card from "../Card/Card";

function Prateleira({ title, itens }) {
  return (
    <div className="prateleira">
      <h1>{title}</h1>
      <div className="carroussel">
        {itens.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Prateleira;
