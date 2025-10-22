import { useEffect, useState } from "react";
import "./ProductImages.css";
import { v4 as uuidv4 } from "uuid";
import { Upload, X } from "lucide-react";

function ProductImages({ formData, errors, removeError, onChange }) {
  const [filesArray, setFilesArray] = useState([]);

  useEffect(() => {
    if (!formData?.images) return;

    let imagesData = formData.images;

    if (typeof imagesData === "string") {
      try {
        imagesData = JSON.parse(imagesData);
      } catch (e) {
        console.warn("Erro ao fazer parse de formData.images:", e);
        return;
      }
    }

    if (!Array.isArray(imagesData)) return;

    const existingImages = imagesData.map((img) => {
      if (typeof img === "string") {
        return {
          file: null,
          randomName: uuidv4(),
          preview: img,
          isFromServer: true,
        };
      }

      return {
        file: img.file || null,
        randomName: img.randomName || uuidv4(),
        preview: img.preview || img.url || "",
        isFromServer: !!img.isFromServer,
      };
    });

    setFilesArray((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(existingImages)) return prev;
      return existingImages;
    });
  }, [formData?.images]);

  function itemHandler(element) {
    const originalFiles = Array.from(element.files);

    const newFiles = originalFiles.map((file) => {
      const extension = file.name.split(".").pop();
      const randomName = `${uuidv4()}.${extension}`;

      return {
        file,
        randomName,
        preview: URL.createObjectURL(file),
      };
    });

    const updatedFiles = [...filesArray, ...newFiles];
    setFilesArray(updatedFiles);
    onChange("images", updatedFiles);
    element.value = "";

    removeError("images");
  }

  function itemRemove(index) {
    const fileToRemove = filesArray[index];

    if (!fileToRemove.isFromServer) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const newArray = filesArray.filter((_, i) => i !== index);
    setFilesArray(newArray);
    onChange("images", newArray);
  }

  return (
    <section id="productImagesBody" className="borderRadius">
      <h1>Imagens do produto</h1>
      <hr />

      <div>
        <label
          htmlFor="inputImages"
          className={errors.images ? "errorElement" : ""}
        >
          <Upload color="#cdcdcd" size={44} />
          <strong>Clique aqui para adicionar suas imagens</strong>
          <p className="colorGray small textCenter">
            PNG, JPG, JPEG até 5MB cada
          </p>
        </label>
        <input
          type="file"
          multiple
          id="inputImages"
          onChange={(e) => itemHandler(e.target)}
        />
      </div>

      <div id="imagesDisplay">
        {filesArray.map((file, index) => (
          <div key={index}>
            <span
              onClick={() => {
                if (errors?.images?.index === index) removeError("images");
                itemRemove(index);
              }}
            >
              <X size={18} />
            </span>
            <img
              className={
                errors?.images?.index === index ? "errorImg" : "noIndex"
              }
              src={file.preview}
              alt={file.file?.name || `image-${index}`}
            />
          </div>
        ))}
      </div>

      {errors.images && (
        <span className="errorMsg">{errors.images.status}</span>
      )}
    </section>
  );
}

export default ProductImages;
