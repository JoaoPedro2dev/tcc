<?php 

namespace Model;

use DAO\HistoricoDAO;

class Historico {
    public int $id_historico;
    public int $user_id;
    public int $produto_id;
    public string $data_visita;
    public int $id_produto;
    public string $productName;
    public string $images;
    public float $price;
    public float $promotionPrice;
    public float $shippingCost;
    
    public function getHistory(int $id_usuario){
        return ((new HistoricoDAO())->getHistory($id_usuario));
    }

    public function delete(int $id_historico, int $user_id){
        return ((new HistoricoDAO())->delete($id_historico, $user_id));
    }

    public function insert(int $id_usuario, int $id_produto){
        return ((new HistoricoDAO())->insert($id_usuario, $id_produto));
    }

    // ID
    public function getId(): int {
        return $this->id_historico;
    }
    public function setId(int $id): void {
        $this->id_historico = $id;
    }

    // USER_ID
    public function getUserId(): int {
        return $this->user_id;
    }
    public function setUserId(int $user_id): void {
        $this->user_id = $user_id;
    }

    // PRODUTO_ID
    public function getProdutoId(): int {
        return $this->produto_id;
    }
    public function setProdutoId(int $produto_id): void {
        $this->produto_id = $produto_id;
    }

    // DATA_VISITA
    public function getDataVisita(): string {
        return $this->data_visita;
    }
    public function setDataVisita(string $data_visita): void {
        $this->data_visita = $data_visita;
    }

    // ID_PRODUTO
    public function getIdProduto(): int {
        return $this->id_produto;
    }
    public function setIdProduto(int $id_produto): void {
        $this->id_produto = $id_produto;
    }

    // PRODUCT_NAME
    public function getProductName(): string {
        return $this->productName;
    }
    public function setProductName(string $product_name): void {
        $this->productName = $product_name;
    }

    // PRODUCT_IMAGE
    public function getProductImage(): string {
        return $this->images;
    }
    public function setProductImage(string $product_image): void {
        $this->images = $product_image;
    }

    // PRICE
    public function getPrice(): float {
        return $this->price;
    }
    public function setPrice(float $price): void {
        $this->price = $price;
    }

    // PROMOTIONPRICE
    public function getPromotionPrice(): float {
        return $this->promotionPrice;
    }
    public function setPromotionPrice(float $PromotionPrice): void {
        $this->promotionPrice = $PromotionPrice;
    }

    // SHIPPINGCOST
    public function getShippingCost(): float {
        return $this->shippingCost;
    }
    public function setShippingCost(float $shippingCost): void {
        $this->shippingCost = $shippingCost;
    }
}
?>