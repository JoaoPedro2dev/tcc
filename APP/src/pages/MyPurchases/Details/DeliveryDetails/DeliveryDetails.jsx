import { Truck } from "lucide-react";
import "./DeliveryDetails.css";

function DeliveryDetails(compra) {
  return (
    <div id="deliveryDetailsBody">
      <section className="borderRadius boxShadow">
        <div>
          <span>
            <Truck size={45} />
          </span>
          <p className="colorGray">Enviado por {compra.envio}</p>
        </div>

        <aside>
          <p className="colorGray small">ID DO ENVIO: {compra.id_string}</p>
          <p>{compra.rua}</p>
          <p>{compra.bairro}</p>
          <p>{compra.endereco_entrega}</p>
          <p className="colorGray">Quem recebe: {compra.quemRecebe}</p>
        </aside>
      </section>
    </div>
  );
}

export default DeliveryDetails;
