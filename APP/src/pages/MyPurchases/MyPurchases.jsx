import "./MyPurchases.css";
import Header from "../../componentes/Header/Header";
import PurchasesCard from "../../componentes/PurchasesCard/PurchasesCard";
import { SearchIcon } from "lucide-react";
// import CancellationForm from "./CancellationForm/CancellationForm";
// import { useState } from "react";

function MyPurchases() {
  const arrayProdutos = [
    {
      dataCompra: "2025-01-01",
      finalizado: false,
      produtos: [
        {
          id: 1,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem1.png",
          status: "Em preparação",
          nome: "Produto de teste 1",
          dataEntrega: "2025-06-06",
          qnt: 2,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "pix",
          recebido: "",
        },
        {
          id: 2,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem2.png",
          status: "A caminho",
          nome: "Produto de teste 2",
          dataEntrega: "2025-06-06",
          qnt: 2,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "pix",
          recebido: "",
        },
        {
          id: 3,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem3.png",
          status: "Chegou",
          nome: "Produto de teste 3",
          dataEntrega: "2025-06-06",
          qnt: 2,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "pix",
          recebido: "",
        },
        {
          id: 4,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem4.png",
          status: "Entregue",
          nome: "Produto de teste 4",
          dataEntrega: "2025-06-06",
          qnt: 2,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "pix",
          recebido: "Lucas",
        },
      ],
    },
    {
      dataCompra: "2025-02-02",
      finalizado: false,
      produtos: [
        {
          id: 5,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem5.png",
          status: "Cancelado por você",
          nome: "Produto de teste 5",
          dataEntrega: "2023-02-06",
          qnt: 3,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "PIX",
          recebido: "",
        },
        {
          id: 5,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem5.png",
          status: "Cancelado por você",
          nome: "Produto de teste 5",
          dataEntrega: "2023-02-06",
          qnt: 3,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "Cartão",
          recebido: "",
        },
        {
          id: 5,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem5.png",
          status: "Cancelado por você",
          nome: "Produto de teste 5",
          dataEntrega: "2023-02-06",
          qnt: 3,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "Boleto",
          recebido: "",
        },
        {
          id: 6,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem6.png",
          status: "Cancelado pelo vendedor",
          nome: "Produto de teste 5",
          dataEntrega: "2025-06-06",
          qnt: 1,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "PIX",
          recebido: "",
        },
        {
          id: 6,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem6.png",
          status: "Cancelado pelo vendedor",
          nome: "Produto de teste 5",
          dataEntrega: "2025-06-06",
          qnt: 1,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "Cartão",
          recebido: "",
        },
        {
          id: 6,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem6.png",
          status: "Cancelado pelo vendedor",
          nome: "Produto de teste 5",
          dataEntrega: "2025-06-06",
          qnt: 1,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "Boleto",
          recebido: "",
        },
        {
          id: 7,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem7.png",
          status: "Cancelado pela DNV WEAR",
          nome: "Produto de teste 7",
          dataEntrega: "2025-06-06",
          qnt: 1,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "PIX",
          recebido: "",
        },
        {
          id: 8,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem8.png",
          status: "Não recebido",
          nome: "Produto de teste 8",
          dataEntrega: "2025-06-06",
          qnt: 2,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "PIX",
          recebido: "",
        },
        {
          id: 8,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem8.png",
          status: "Não recebido",
          nome: "Produto de teste 8",
          dataEntrega: "2025-06-06",
          qnt: 2,
          prazo: "2025-09-11",
          novoPrazo: "2025-09-30",
          metodoPagamento: "PIX",
          recebido: "",
        },
      ],
    },
    {
      dataCompra: "2025-03-03",
      finalizado: true,
      produtos: [
        {
          id: 8,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem8.png",
          status: "Entregue",
          nome: "Produto de teste 8",
          dataEntrega: "2025-06-06",
          qnt: 2,
          prazo: "2025-09-11",
          novoPrazo: "",
          metodoPagamento: "PIX",
          recebido: "Juliana",
        },
        {
          id: 8,
          imagem: "http://localhost/tcc/API/UPLOADS/images/imagem8.png",
          status: "Entregue",
          nome: "Produto de teste 8",
          dataEntrega: "2025-06-06",
          qnt: 2,
          prazo: "2025-09-11",
          novoPrazo: "2025-09-30",
          metodoPagamento: "PIX",
          recebido: "Tiago",
        },
      ],
    },
  ];

  return (
    <div id="myPurchasesBody">
      <Header />
      <main>
        <div className="inputBox">
          <input
            type="text"
            className="searchIcon"
            placeholder="Pesquise por suas compras"
            id="inputPurchases"
          />
          |
          <label htmlFor="inputPurchases">
            <SearchIcon className="searchIcon" />
          </label>
        </div>

        <h1>Minhas Compras</h1>

        {arrayProdutos.length > 0
          ? arrayProdutos.map((item, key) => (
              <PurchasesCard key={key} item={item} />
            ))
          : "Você ainda não comprou nenhum produto"}
      </main>
    </div>
  );
}

export default MyPurchases;
