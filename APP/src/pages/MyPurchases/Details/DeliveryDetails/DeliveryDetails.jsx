import { Truck } from "lucide-react";
import "./DeliveryDetails.css";

function DeliveryDetails() {
  const envioJSON = {
    id: 1,
    id_string: "#12342JFNAJASN",
    data: "2025-02-02",
    envio: "DNV",
    rua: "Rua ribeiro, 923",
    bairro: "Penuel de martins, Rio branco - (134212112), São Paulo",
    quemRecebe: "Pessoa que recebe",
  };
  return (
    <div id="deliveryDetailsBody">
      <section className="borderRadius boxShadow">
        <div>
          <span>
            <Truck size={45} />
          </span>
          <p className="colorGray">Enviado por {envioJSON.envio}</p>
        </div>

        <aside>
          <p className="colorGray small">ID DO ENVIO: {envioJSON.id_string}</p>
          <p>{envioJSON.rua}</p>
          <p>{envioJSON.bairro}</p>
          <p className="colorGray">Quem recebe: {envioJSON.quemRecebe}</p>
        </aside>
      </section>

      {/* <section className="borderRadius boxShadow">
        <h1>Olá</h1>
      </section> */}
    </div>
  );
}

export default DeliveryDetails;
