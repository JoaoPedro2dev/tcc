"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import Contador from "../../componentes/Contador/Contador.jsx";
import { createPortal } from "react-dom"; // ⬅️ IMPORTANTE
import "./AddCartModal.css";
import { monetaryFormatting } from "../../helpers/functions.jsx";
import FeedbackPopup from "../Feedback/Feedback.jsx";

function AddToCartModal({ onClose, product, user }) {
  console.log("item", product);

  const [corSelecionada, setCorSelecionada] = useState("");
  const [sizeSelecionado, setSizeSelecionado] = useState("");
  const [qtyIten, setQtyIten] = useState(1);
  const [erro, setErro] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const coresMap = [
    { name: "Preto", hex: "#000000" },
    { name: "Branco", hex: "#FFFFFF" },
    { name: "Cinza", hex: "#808080" },
    { name: "Vermelho", hex: "#DC2626" },
    { name: "Azul", hex: "#2563EB" },
    { name: "Verde", hex: "#16A34A" },
    { name: "Amarelo", hex: "#EAB308" },
    { name: "Rosa", hex: "#EC4899" },
    { name: "Marrom", hex: "#92400E" },
    { name: "Bege", hex: "#D4A574" },
    { name: "Laranja", hex: "#F97316" },
    { name: "Roxo", hex: "#8B5CF6" },
    { name: "Lilás", hex: "#C084FC" },
    { name: "Turquesa", hex: "#14B8A6" },
    { name: "Verde-oliva", hex: "#6B8E23" },
    { name: "Cinza-claro", hex: "#D1D5DB" },
    { name: "Marfim", hex: "#FFFFF0" },
    { name: "Bordô", hex: "#800020" },
    { name: "Azul-marinho", hex: "#1E3A8A" },
    { name: "Salmão", hex: "#FA8072" },
    { name: "Menta", hex: "#98FF98" },
    { name: "Mostarda", hex: "#FFDB58" },
    { name: "Caramelo", hex: "#A97142" },
    { name: "Prata", hex: "#C0C0C0" },
    { name: "Dourado", hex: "#FFD700" },
  ];

  // Obter tamanhos disponíveis para a cor selecionada
  const tamanhosDaCor =
    product?.itenStock?.find((item) => item.cor === corSelecionada)?.tamanhos ||
    [];

  // Obter stock do tamanho selecionado
  const stockDoTamanho =
    product?.itenStock
      ?.find((item) => item.cor === corSelecionada)
      ?.tamanhos.find((size) => size.tamanho === sizeSelecionado)?.qnt || 1;

  // Inicializar cores e tamanhos quando o modal abre
  useEffect(() => {
    if (product?.itenStock?.length) {
      setCorSelecionada(product.itenStock[0].cor);
      setSizeSelecionado(product.itenStock[0].tamanhos[0].tamanho);
      setQtyIten(1);
      setErro("");
    }
  }, []);

  // Atualizar tamanho quando cor muda
  useEffect(() => {
    if (product?.itenStock?.length && corSelecionada) {
      const itemCor = product.itenStock.find(
        (item) => item.cor === corSelecionada
      );
      if (itemCor?.tamanhos?.length) {
        setSizeSelecionado(itemCor.tamanhos[0].tamanho);
      }
    }

    console.log("cor selecionada", corSelecionada);
  }, [corSelecionada, product]);

  // Resetar quantidade quando stock muda
  useEffect(() => {
    setQtyIten(1);
  }, [stockDoTamanho]);

  // Validar seleções
  const validarSelecao = () => {
    if (!corSelecionada) {
      setErro("Por favor, selecione uma cor");
      return false;
    }
    if (!sizeSelecionado) {
      setErro("Por favor, selecione um tamanho");
      return false;
    }
    setErro("");
    return true;
  };

  // Adicionar ao carrinho
  const handleAddToCart = async () => {
    if (!validarSelecao()) return;

    // setBtnLoading(true);

    // try {
    //   await onAddToCart({
    //     productId: product.id,
    //     cor: corSelecionada,
    //     tamanho: sizeSelecionado,
    //     quantidade: qtyIten,
    //   });

    //   // Fechar modal após sucesso
    //   setTimeout(() => {
    //     setBtnLoading(false);
    //     onClose();
    //   }, 500);
    // } catch (error) {
    //   setBtnLoading(false);
    //   setErro("Erro ao adicionar ao carrinho. Tente novamente.");
    //   console.error("Erro:", error);
    // }

    setBtnLoading(true);

    const url = `http://localhost/tcc/API/POST/cart/insert`;

    fetch(url, {
      method: "POST",
      body: new URLSearchParams({
        user_id: user.id,
        product_id: product.id,
        cor: corSelecionada,
        tamanho: sizeSelecionado,
        qty: qtyIten,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setBtnLoading(true);

        console.log("adicionando ao carrinho", data);

        if (data == true) {
          setBtnLoading(false);
          setSuccess(true);
          // onClose();
        }
      });
    // .catch((error) => {
    //   console.error(error);
    //   setBtnLoading(false);
    // });
  };

  const modalContent = (
    <div
      className={"atc-modal-overlay " + (success && "displayNone")}
      onClick={onClose}
    >
      <div className="atc-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header do modal */}
        <div className="atc-modal-header">
          <h2>Adicionar ao Carrinho</h2>
          <button className="atc-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo do modal */}
        <div className="atc-modal-content">
          <div className="atc-row-container">
            <div className="atc-product-image-section">
              {product?.images?.[0] && (
                <img
                  src={
                    JSON.parse(JSON.parse(product?.images))[0] ||
                    "/placeholder.svg"
                  }
                  alt={product?.productName}
                  className="atc-product-image"
                />
              )}
            </div>

            {/* Informações do produto */}
            <div className="atc-product-info">
              <h3>{product?.productName}</h3>
              {product?.promotionPrice ? (
                <div>
                  <p className="atc-product-promotion-price">
                    {monetaryFormatting(product.price)}
                  </p>
                  <p className="atc-product-price">
                    {monetaryFormatting(product.promotionPrice)}
                  </p>
                </div>
              ) : (
                <p className="atc-product-price">
                  {monetaryFormatting(product.price)}
                </p>
              )}

              <div className="atc-shipping-info">
                {/* <Truck size={20} /> */}
                <p>
                  Frete:{" "}
                  {product.shippingCost > 0 ? (
                    <span>{monetaryFormatting(product.shippingCost)}</span>
                  ) : (
                    <span className="colorGreen">Grátis</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Seleção de cores */}
          <div className="atc-section">
            <label>Cor</label>
            <div className="atc-colors-grid">
              {product?.itenStock?.map((item, key) => (
                <button
                  key={key}
                  className={`atc-color-item ${
                    corSelecionada === item.cor ? "ativo" : ""
                  }`}
                  onClick={() => setCorSelecionada(item.cor)}
                  title={item.cor}
                >
                  <div
                    className="atc-color-circle"
                    style={{ backgroundColor: coresMap[item.cor] || "#ccc" }}
                  ></div>
                  <span>{item.cor}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de tamanhos */}
          <div className="atc-section">
            <label>Tamanho</label>
            <div className="atc-sizes-grid">
              {tamanhosDaCor.map((size, key) => (
                <button
                  key={key}
                  className={`atc-size-item ${
                    sizeSelecionado === size.tamanho ? "ativo" : ""
                  }`}
                  onClick={() => setSizeSelecionado(size.tamanho)}
                >
                  {size.tamanho}
                </button>
              ))}
            </div>
          </div>

          {/* Quantidade */}
          <div className="atc-section">
            <Contador
              isCart={false}
              maxCount={stockDoTamanho}
              qtyIten={qtyIten}
              setQtyIten={setQtyIten}
              id={product?.id}
              userId={user.id}
            />
            <p className="atc-stock-info">
              Estoque disponível: <strong>{stockDoTamanho}</strong> unidade
              {stockDoTamanho > 1 && "s"}
            </p>
          </div>

          {/* Mensagem de erro */}
          {erro && <div className="atc-error-message">{erro}</div>}

          {/* Botões de ação */}
          <div className="atc-actions">
            <button
              className="atc-btn-cancel"
              onClick={onClose}
              disabled={btnLoading}
            >
              Cancelar
            </button>
            <button
              className={`atc-btn-add ${btnLoading ? "loading" : ""}`}
              onClick={handleAddToCart}
              disabled={btnLoading}
            >
              {btnLoading ? (
                <span className="atc-loading-spinner"></span>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Adicionar ao Carrinho
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const popUpModal = (
    <FeedbackPopup
      message={"Item adicionado!"}
      type={"success"}
      onClose={() => {
        setSuccess(false);
        onClose();
      }}
    />
  );

  if (success) {
    return createPortal(popUpModal, document.body); // ⬅️ PORTAL AQUI
  }

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body) // ⬅️ PORTAL AQUI
    : null;
}

export default AddToCartModal;
