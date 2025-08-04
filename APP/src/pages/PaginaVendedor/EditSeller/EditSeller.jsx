import { Telescope } from "lucide-react";
import "./EditSeller.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../componentes/Header/Header";

function EditSeller() {
  const navigate = useNavigate();

  const loja = {
    id: 1,
    name: "Padaria do bairro",
    backgorundImage: "http://localhost/tcc/API/UPLOADS/images/imagem5.png",
    perfilImage: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus vitae quidem, aut iste quas laudantium dolore debitis deleniti officiis dignissimos possimus explicabo ea eum iure illo repellendus maxime tempora harum! 2",
    horarioAbertura: "01:30",
    horarioFechamento: "22:00",
    whatsApp: "1231-2322",
    telephone: "(14) 99120-2191",
    finalSemana: false,
  };

  const horarios = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  const [nameValue, setNameValue] = useState(loja.name);
  const [backgroundImage, setBackgroundImage] = useState(loja.backgorundImage);
  const [perfilImage, setPerfilImage] = useState(loja.perfilImage);
  const [whatsAppValue, setWhatsAppValue] = useState(loja.whatsApp);
  const [telephoneValue, setTelephone] = useState(loja.telephone);
  const [descriptionValue, setDescriptionValue] = useState(loja.description);
  const [aberturaValue, setAberturaValue] = useState(loja.horarioAbertura);
  const [fechamentoValue, setFechamentoValue] = useState(
    loja.horarioFechamento
  );
  const [fdsValue, setFdsValue] = useState(loja.finalSemana);

  return (
    <div id="editSellerBody">
      <Header />

      <main>
        <div className="boxShadow borderRadius">
          <h1>Editar perfil</h1>

          <label htmlFor="backgroundImage" id="backgroundBox">
            <img
              src={backgroundImage}
              alt="background image"
              className="borderRadius "
            />
            <input
              type="file"
              name="backgroundImage"
              id="backgroundImage"
              onChange={(event) => {
                setBackgroundImage(URL.createObjectURL(event.target.files[0]));
              }}
            />
          </label>

          <section>
            <label htmlFor="perfilImage" id="perfilBox">
              <img src={perfilImage} alt="Imagem de perfil da loja" />
              <input
                type="file"
                name="perfilImage"
                id="perfilImage"
                onChange={(event) => {
                  setPerfilImage(URL.createObjectURL(event.target.files[0]));
                }}
              />
            </label>

            <p>
              <label htmlFor="name">Nome da loja</label>
              <input
                type="text"
                name="name"
                id="name"
                value={nameValue}
                onInput={(e) => {
                  setNameValue(e.value);
                }}
              />
            </p>
          </section>

          <section>
            <aside className="borderRadius">
              <textarea
                spellCheck="false"
                name="description"
                id="description"
                onInput={(e) => {
                  setDescriptionValue(e.target);
                }}
              >
                {descriptionValue}
              </textarea>

              <div>
                <p>
                  <strong>Horário de funcionamento:</strong>

                  <select
                    name="openingHours"
                    value={aberturaValue}
                    onChange={(e) => {
                      setAberturaValue(e.value);
                    }}
                  >
                    {horarios.map((horario) => (
                      <option value={horario}>{horario}</option>
                    ))}
                  </select>

                  <span>às</span>

                  <select
                    name="closingHours"
                    value={fechamentoValue}
                    onChange={(e) => {
                      setFechamentoValue(e.value);
                    }}
                  >
                    {horarios.map((horario) => (
                      <option value={horario}>{horario}</option>
                    ))}
                  </select>
                </p>

                <p>
                  <strong>WhatsApp:</strong>
                  <input
                    type="text"
                    name="whatsApp"
                    id="whatsApp"
                    value={whatsAppValue}
                    onInput={(e) => {
                      setWhatsAppValue(e.value);
                    }}
                  />
                </p>

                <p>
                  <strong>Telefone:</strong>
                  <input
                    type="text"
                    name="telephone"
                    id="telephone"
                    value={telephoneValue}
                    onInput={(e) => {
                      setTelephone(e.value);
                    }}
                  />
                </p>

                <p>
                  <strong>Finais de semana:</strong>
                  <select
                    name="weekend"
                    id="weekend"
                    value={fdsValue}
                    onChange={(e) => {
                      setFdsValue(e.value);
                    }}
                  >
                    <option value={true}>Atendemos</option>
                    <option value={false}>Não atendemos</option>
                  </select>
                </p>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <div id="btnsNav">
        <button>Salvar</button>
        <button
          onClick={() => {
            navigate("/paginavendedor");
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default EditSeller;
