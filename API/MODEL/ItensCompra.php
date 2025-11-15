<?php

namespace Model;

use DAO\ItensCompraDAO;

class ItensCompra
{
    public int $id_item;
    public int $id_compra;
    public int $id_produto;
    public int $seller_id;
    public string $product_name;
    public string $product_image;
    public int $quantidade;
    
    public string $cor;
    public string $tamanho;

    public float $preco_unitario;
    public ?float $preco_promocao;
    public float $frete;
    public float $fatia_dnvwear;
    public float $total_produto;
    public string $data_previsao;
    public ?string $data_entregue;
    public string $status;

    public ?string $motivo_cancelamento;
    public ?string $quem_cancelou; 
    
    public ?string $quem_entrega;
    public ?string $recebido_por;
    public ?string $nome_cliente;
    public ?string $endereco_entrega;
    public ?string $data_compra;
    public ?float $preco_total;

    public function getBySellerId($id_seller){
        return ((new ItensCompraDAO())->getBySellerId($id_seller));
    }

    public function statusConfirm(int $id_item, string $quem_entrega){
        return ((new ItensCompraDAO())->statusConfirm($id_item, $quem_entrega));
    }

    public function cancelarItem(int $id_item, string $motivo_cancelamento, string $quem_cancelou) : bool{
        return ((new ItensCompraDAO())->cancelarItem($id_item, $motivo_cancelamento, $quem_cancelou));
    }

    public function alterarStatus(int $id_item, string $novo_estado):bool{
        return ((new ItensCompraDAO())->alterarStatus($id_item,  $novo_estado));
    }

    // --- Getters e Setters ---
    public function getIdItem(): int
    {
        return $this->id_item;
    }

    public function setIdItem(int $id_item): void
    {
        $this->id_item = $id_item;
    }

    public function getIdCompra(): int
    {
        return $this->id_compra;
    }

    public function setIdCompra(int $id_compra): void
    {
        $this->id_compra = $id_compra;
    }

    public function getIdProduto(): int
    {
        return $this->id_produto;
    }

    public function setIdProduto(int $id_produto): void
    {
        $this->id_produto = $id_produto;
    }

    public function getSellerId(): int
    {
        return $this->seller_id;
    }

    public function setSellerId(int $seller_id): void
    {
        $this->seller_id = $seller_id;
    }

    public function getProductName(): string
    {
        return $this->product_name;
    }

    public function setProductName(string $product_name): void
    {
        $this->product_name = $product_name;
    }

    public function getProductImage(): string
    {
        return $this->product_image;
    }

    public function setProductImage(string $product_image): void
    {
        $this->product_image = $product_image;
    }

    public function getQuantidade(): int
    {
        return $this->quantidade;
    }
    public function setQuantidade(int $quantidade): void
    {
        $this->quantidade = $quantidade;
    }

    public function getCor(): string
    {
        return $this->cor;
    }
    public function setCor(string $cor): void
    {
        $this->cor = $cor;
    }

    public function getTamanho(): string
    {
        return $this->tamanho;
    }
    public function setTamanho(string $tamanho): void
    {
        $this->tamanho = $tamanho;
    }

    public function getPrecoUnitario(): float
    {
        return $this->preco_unitario;
    }
    public function setPrecoUnitario(float $preco_unitario): void
    {
        $this->preco_unitario = $preco_unitario;
    }

    public function getPrecoPromocao(): ?float
    {
        return $this->preco_promocao;
    }

    public function setPrecoPromocao(?float $preco_promocao): void
    {
        $this->preco_promocao = $preco_promocao;
    }

    public function getFrete(): float
    {
        return $this->frete;
    }

    public function setFrete(float $frete): void
    {
        $this->frete = $frete;
    }

    
    public function getFatiaDnvwear(): float
    {
        return $this->fatia_dnvwear;
    }

    public function setFatiaDnvwear(float $fatia_dnvwear): void
    {
        $this->fatia_dnvwear = $fatia_dnvwear;
    }

    public function getTotalProduto(): float
    {
        return $this->total_produto;
    }

    public function setTotalProduto(float $total_produto): void
    {
        $this->total_produto = $total_produto;
    }

    public function getDataPrevisao(): string
    {
        return $this->data_previsao;
    }

    public function setDataPrevisao(string $data_previsao): void
    {
        $this->data_previsao = $data_previsao;
    }

    public function getDataEntregue(): ?string
    {
        return $this->data_entregue;
    }

    public function setDataEntregue(?string $data_entregue): void
    {
        $this->data_entregue = $data_entregue;
    }

    public function getStatus(): string
    {
        return $this->status;
    }
    public function setStatus(string $status): void
    {
        $this->status = $status;
    }

    public function getMotivoCancelamento(): ?string
    {
        return $this->motivo_cancelamento;
    }
    public function setMotivoCancelamento(?string $motivo_cancelamento): void
    {
        $this->motivo_cancelamento = $motivo_cancelamento;
    }

    public function getQuemCancelou(): ?string
    {
        return $this->quem_cancelou;
    }
    public function setQuemCancelou(?string $quem_cancelou): void
    {
        $this->quem_cancelou = $quem_cancelou;
    }

    public function getQuemEntrega(): ?string
    {
        return $this->quem_entrega;
    }
    public function setQuemEntrega(?string $quem_entrega): void
    {
        $this->$quem_entrega = $quem_entrega;
    }

    public function getRecebidoPor(): ?string
    {
        return $this->recebido_por;
    }

    public function setRecebidoPor(?string $recebido_por): void
    {
        $this->recebido_por = $recebido_por;
    }

    // --- Getters e setters extras (JOIN) ---

    public function getNomeCliente(): ?string
    {
        return $this->nome_cliente;
    }

    public function setNomeCliente(?string $nome_cliente): void
    {
        $this->nome_cliente = $nome_cliente;
    }

    public function getEnderecoEntrega(): ?string
    {
        return $this->endereco_entrega;
    }

    public function setEnderecoEntrega(?string $endereco_entrega): void
    {
        $this->endereco_entrega = $endereco_entrega;
    }

    public function getDataCompra(): ?string
    {
        return $this->data_compra;
    }

    public function setDataCompra(?string $data_compra): void
    {
        $this->data_compra = $data_compra;
    }

    public function getPrecoTotal(): ?float
    {
        return $this->preco_total;
    }

    public function setPrecoTotal(?float $preco_total): void
    {
        $this->preco_total = $preco_total;
    }
}

?>