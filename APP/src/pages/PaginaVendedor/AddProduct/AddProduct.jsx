import ProductSize from "./ProductSize/ProductSize.jsx";
import "./AddProduct.css";
import BasicsInfos from "./BasicsInfos/BasicsInfos.jsx";
import PriceLogistics from "./PriceLogistics/PriceLogistics.jsx";
import ProductFeatures from "./ProductFeatures/ProductFeatures.jsx";
import ProductImages from "./ProductImages/ProductImages.jsx";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext.jsx";
import FeedBack from "../../../componentes/Feedback/Feedback.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmAlert from "../../../componentes/ConfirmAlert/ConfirmAlert.jsx";
import Header from "../../../componentes/Header/Header";
import { Trash2 } from "lucide-react";

function AddProduct() {
  const navigate = useNavigate();

  const location = useLocation();
  const id = location.state ?? false;
  const { user } = useUser();

  const [formData, setFormData] = useState({
    id: null,
    seller_id: 1,
    productName: "",
    category: "",
    subCategory: "",
    style: "",
    brand: "",
    description: "",
    condition: "",
    gender: "",
    itenStock: [],
    price: "",
    shippingCost: "",
    deliveryTime: "",
    images: [],
  });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost/tcc/API/GET?id=${id}`)
        .then((r) => r.json())
        .then((data) => {
          console.log("editar", data);
          setFormData(data);
        });
    }
  }, []);

  const [errors, setErrors] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("Camisas");

  const [successAlert, setSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function cadastrarProduto() {
    setIsLoading(true);

    console.clear();
    console.log("Dados enviados:", formData);

    let form = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((fileObj) => {
          form.append("images[]", fileObj.file);
        });
        continue;
      }

      if (key === "itenStock") {
        // se for um array ou objeto, converte para string JSON
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    }

    form.append("seller_id", user?.seller_id);

    fetch("http://localhost/tcc/API/POST/produto", {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data.success === false) {
          if (data.field === "images") {
            setErrors((prev) => ({
              ...prev,
              [data.field]: { status: data.status, index: data.index },
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              [data.field]: data.status,
            }));
          }

          setIsLoading(false);
          return;
        }

        if (data === true) {
          console.log("cadastrado");
          setSuccessAlert(true);
          setIsLoading(true);
        }
      });
  }

  function editarProduto() {
    setIsLoading(true);

    console.clear();
    console.log("Dados novos:", formData);

    let form = new FormData();
    for (const key in formData) {
      if (key === "images") {
        if (typeof formData.images === "string") {
          formData.images = JSON.parse(formData.images);
        }

        formData.images.forEach((fileObj) => {
          form.append("images[]", fileObj.file);
        });

        continue;
      }

      if (key === "itenStock") {
        // se for um array ou objeto, converte para string JSON
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    }

    // form.append("seller_id", user.seller_id);

    fetch("http://localhost/tcc/API/POST/update/produto", {
      method: "POST",
      body: form,
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("update", data);
        if (data.success === false) {
          if (data.field === "images") {
            setErrors((prev) => ({
              ...prev,
              [data.field]: { status: data.status, index: data.index },
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              [data.field]: data.status,
            }));
          }

          setIsLoading(false);
          return;
        }

        if (data === true) {
          console.log("alterado");
          setSuccessAlert(true);
          setIsLoading(true);
        }
      });
  }

  function removeError(field) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }

  function deleteProduct() {
    fetch(`http://localhost/tcc/API/POST/delete/produtos`, {
      method: "POST",
      body: new URLSearchParams({ id_produto: id }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        setSuccessDelete(true);
        setSuccessAlert(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  if (!user?.seller_id) {
    return "error";
  }

  return (
    <>
      <Header title={"Cadastrar Produto"} />
      <div id="addProductBody">
        {confirmDelete && (
          <ConfirmAlert
            message={
              "Você deseja mesmo excluir este produto? não sera possível recupera-lo após isso!"
            }
            onClose={() => {
              setConfirmDelete(false);
            }}
            onConfirm={deleteProduct}
          />
        )}

        {successAlert && (
          <FeedBack
            message={
              successDelete
                ? "Produto deletado com sucesso!"
                : id
                ? "Alterações salvas com sucesso!"
                : "Produto cadastrado com sucesso!"
            }
            type={"success"}
            link={`/paginaVendedor?seller=${user.url}`}
          />
        )}

        <BasicsInfos
          formData={formData}
          onChange={handleFormChange}
          setSelectedCategory={setSelectedCategory}
          errors={errors}
          removeError={removeError}
        />

        <ProductSize
          formData={formData}
          onChange={handleFormChange}
          category={selectedCategory}
          errors={errors}
          removeError={removeError}
        />

        <ProductFeatures
          formData={formData}
          onChange={handleFormChange}
          errors={errors}
          removeError={removeError}
        />

        <PriceLogistics
          formData={formData}
          onChange={handleFormChange}
          errors={errors}
          removeError={removeError}
        />

        <ProductImages
          formData={formData}
          onChange={handleFormChange}
          errors={errors}
          removeError={removeError}
        />

        {id && (
          <button
            className="deleteBtn"
            onClick={() => {
              setConfirmDelete(true);
            }}
          >
            <Trash2 size={20} /> Excluir produto
          </button>
        )}

        <div id="btnsBox">
          <button
            onClick={() => {
              if (
                confirm(
                  "Caso deixe a página alguns dados podem não ser salvos!"
                )
              ) {
                navigate(-1);
              }
            }}
          >
            Cancelar
          </button>

          {id ? (
            <button onClick={editarProduto} disabled={isLoading}>
              {" "}
              {isLoading ? "Salvando..." : "SALVAR ALTERAÇÕES"}
            </button>
          ) : (
            <button onClick={cadastrarProduto} disabled={isLoading}>
              {isLoading ? "Cadastrando..." : "Cadastrar produto"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default AddProduct;
