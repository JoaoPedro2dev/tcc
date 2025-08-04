import { useState } from "react";
import "./ProductImages.css";
import { v4 as uuidv4 } from "uuid";

import { Upload, X } from "lucide-react";

function ProductImages({ formData, onChange }) {
  const [filesArray, setFilesArray] = useState([]);

  // function toBase64(file) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // }

  function itemHandler(element) {
    const originalFiles = Array.from(element.files);

    const newFiles = originalFiles.map((file) => {
      const extension = file.name.split(".").pop();
      const randomName = `${uuidv4()}.${extension}`;

      return {
        file,
        randomName: randomName,
        preview: URL.createObjectURL(file),
      };
    });

    onChange("imagens", [...(formData.imagens || []), ...newFiles]);

    setFilesArray((prev) => [...prev, ...newFiles]);
    element.value = "";
  }

  function itemRemove(index) {
    const fileToRemove = filesArray[index];

    URL.revokeObjectURL(fileToRemove.preview);

    const newArray = filesArray.filter((_, i) => i !== index);
    setFilesArray(newArray);

    const newFiles = formData.imagens.filter(
      (file) =>
        !(
          file.randomName === fileToRemove.randomName &&
          file.file.lastModified === fileToRemove.file.lastModified
        )
    );
    onChange("imagens", newFiles);
  }

  return (
    <section id="productImagesBody" className="borderRadius">
      <h1>Imagens do produto</h1>
      <hr />

      <div>
        <label htmlFor="inputImages">
          <Upload color="#cdcdcd" size={44} />

          <strong>Clique aqui para adicionar suas imagem</strong>
          <p className="colorGray small textCenter">
            PNG, JPG, JPEG até 5MB cada
          </p>
        </label>
        <input
          type="file"
          name="inputImages"
          multiple
          id="inputImages"
          onChange={(e) => {
            itemHandler(e.target);
          }}
        />
      </div>

      <div id="imagesDisplay">
        {filesArray.map((file, index) => (
          <div key={index}>
            <span
              onClick={() => {
                itemRemove(index);
              }}
            >
              <X size={18} />
            </span>
            <img src={file.preview} alt="" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductImages;
