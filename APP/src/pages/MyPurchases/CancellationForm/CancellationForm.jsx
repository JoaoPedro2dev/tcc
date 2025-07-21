import { X } from "lucide-react";
import "./CancellationForm.css";
import { useEffect, useState } from "react";

function CancellationForm({ funcao, tipo }) {
  const [alertClass, setAlertClass] = useState("hidden");
  const [alertMessage, setAlertMessage] = useState("Olá");

  useEffect(() => {
    const inputs = document.querySelectorAll("input[type='radio']");

    let lastClicked = null;

    inputs.forEach((input) => {
      input.addEventListener("click", () => {
        if (input == lastClicked) {
          input.checked = false;
          lastClicked = null;
          console.log(false);
        } else {
          input.checked = true;
          lastClicked = input;
          console.log(true);
        }
      });
    });

    const container = document.querySelector("#cancellationFormBody");
    function handleClick(event) {
      if (!document.querySelector("#box").contains(event.target)) {
        funcao();
      }
    }

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [funcao]);

  function cancelarPedido(e) {
    e.preventDefault();

    const form = new FormData(e.target);

    const selectedReason = form.get("reason");
    const anotherReason = form.get("anotherReason");

    if (!selectedReason && !anotherReason) {
      setAlertMessage("Selecione um motivo");
      setAlertClass("show");

      return;
    }

    if (selectedReason && anotherReason) {
      setAlertMessage("Indique apenas um motivo");
      setAlertClass("show");

      return;
    }

    const response = [...form.values()].find((value) => value.trim() !== "");

    funcao();
    console.log("este é response", response);
  }

  return (
    <div id="cancellationFormBody">
      <button id="closeBtn">
        <X />
      </button>

      <form id="box" className="borderRadius" onSubmit={cancelarPedido}>
        <h1 className="textCenter">
          {tipo === "produto"
            ? "Cancelar um pedido"
            : "Cancelar todos os pedidos"}
        </h1>

        <p className="textCenter">
          {tipo === "produto"
            ? "Por qual motivo quer cancelar este pedido?"
            : "Por qual motivo quer cancelar estes pedidos?"}
        </p>

        <p className="colorGray small textCenter">
          Nos ajude a melhorarmos sua experiencia de comprador, seu feedback
          sera muito importante.
        </p>

        <div>
          <div>
            <input type="radio" name="reason" value="Me arrependi da compra" />
            Me arrependi da compra
          </div>

          <div>
            <input
              type="radio"
              name="reason"
              value="O endereço para envio esta
            incorreto"
            />
            O endereço para envio esta incorreto
          </div>

          <div>
            <input type="radio" name="reason" value="Fiz a compra por engano" />
            Fiz a compra por engano
          </div>

          <div>
            <input
              type="radio"
              name="reason"
              value="O vendedor não respondeu minhas
            perguntas"
            />
            O vendedor não respondeu minhas perguntas
          </div>

          <div>
            <input type="radio" name="reason" value="Marquei uma cor errada" />
            Marquei uma cor errada
          </div>

          <div>
            <input
              type="radio"
              name="reason"
              value="Marquei um tamanho errado"
            />
            Marquei um tamanho errado
          </div>

          <div>
            <input type="radio" name="reason" value="Prefiro não dizer" />
            Prefiro não dizer
          </div>
        </div>

        <div>
          <label>Outro motivo</label>
          <input type="text" name="anotherReason" />
        </div>

        <p className={"colorRed " + alertClass}>{alertMessage}</p>

        <input
          type="submit"
          value={
            tipo === "produto" ? "Cancelar pedido" : "Cancelar todos os pedidos"
          }
        />
      </form>
    </div>
  );
}

export default CancellationForm;
