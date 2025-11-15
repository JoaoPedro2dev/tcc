<?php

namespace Model;

// use CompraDAO;
use DAO\CompraDAO;
use DateTime;
use Exception;

class Compra
{
    public ?int $id_compra;
    public int $id_cliente;
    public string $name;
    public string $cpf_cliente;
    public $id_loja;
    public string $endereco_entrega;
    public string $forma_pagamento;
    public  $preco_total;
    public $id_cartao; 
    public float $frete_total;
    public ?int $parcelas;
    public $valor_parcelas;
    public ?string $link_nfe;
    public string $data_compra;
    public string $status; // ENUM: pendente, confirmado, em_transporte, entregue, cancelado

    public array $itens = [];

    public function __construct() {
        $data = new DateTime();
        $this->data_compra= $data->format('Y-m-d H:i:s'); 
    }

    public function insert(Compra $compra){ 
        return ((new CompraDAO)->insert($compra));
    }

    static function getAllById(int $id) : ?array{
        return ((new CompraDAO()))->getAllById($id);
    }

    static function getById($id_compra){
        return ((new CompraDAO()))->getById($id_compra);
    }

    // ===================
    // Getters e Setters
    // ===================

    public function getIdCompra(): ?int
    {
        return $this->id_compra;
    }
    public function setIdCompra(?int $id_compra): void
    {
        $this->id_compra = $id_compra;
    }

    public function getIdCliente(): int
    {
        return $this->id_cliente;
    }
    public function setIdCliente(int $id_cliente): void
    {
        $this->id_cliente = $id_cliente;
    }

    public function getName(): string
    {
        return $this->name;
    }
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getCpfCliente(): string
    {
        return $this->cpf_cliente;
    }
    public function setCpfCliente(string $cpf_cliente): void
    {
        $this->cpf_cliente = $cpf_cliente;
    }

    public function getIdLoja()
    {
        return $this->id_loja;
    }
    public function setIdLoja($id_loja): void
    {
        $this->id_loja = $id_loja;
    }

    public function getEnderecoEntrega(): string
    {
        return $this->endereco_entrega;
    }
    public function setEnderecoEntrega(string $endereco_entrega): void
    {
        $this->endereco_entrega = $endereco_entrega;
    }

    public function getFormaPagamento(): string
    {
        return $this->forma_pagamento;
    }
    public function setFormaPagamento(string $forma_pagamento): void
    {
        $this->forma_pagamento = $forma_pagamento;
    }

    public function getPrecoTotal()
    {
        return $this->preco_total;
    }

    public function setPrecoTotal(bool $auto = false, $bd_total = false): void
    {   
        if($auto && !empty($bd_total)){
            $this->preco_total = $bd_total;
            return;
        }
        
        $total = 0;
        // if(!$this->itens){
        //     throw new Exception(
        //         json_encode(
        //             ['success' => false,
        //             'status' => 'Ainda não existem itens para calcular o total'],
        //             JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
        //         ));
        // }   

        foreach($this->itens as $item){
            $total += ($item['total_produto']);
        }
        
        $this->preco_total = number_format($total, 2);
    }

    public function getFreteTotal(): float
    {
        return $this->frete_total;
    }
    public function setFreteTotal($frete_total): void
    {        
        $this->frete_total = $frete_total;
    }

    public function setIdCartao( $id_cartao):void{
        $this->id_cartao = $id_cartao;
    }
    public function getIdCartao(){
        return $this->id_cartao;
    }

    public function getParcelas(){
        return $this->parcelas;
    }
    public function setParcelas(?int $parcelas) : void{
        $this->parcelas = $parcelas;
    }

    public function getValorParcelas(){
        return $this->valor_parcelas;
    }
    public function setValorParcelas($valor_parcelas) : void{
        $this->valor_parcelas = $valor_parcelas;
    }

    public function getLinkNfe(): ?string
    {
        return $this->link_nfe;
    }
    public function setLinkNfe(?string $link_nfe): void
    {
        $this->link_nfe = $link_nfe;
    }

    public function getDataCompra(): string
    {
        return $this->data_compra;
    }
    public function setDataCompra(string $data_compra): void
    {
        $this->data_compra = $data_compra;
    }

    public function getStatus(): string
    {
        return $this->status;
    }
    public function setStatus(string $status): void
    {
        $this->status = $status;
    }
    
    public function getItens(): array
    {
        return $this->itens;
    }
    public function adicionarItem(array $item) {

        $imagePreview = json_decode($item['images'], true)[0];
        $productTotal = ((($item['preco_promocao'] ?? $item['promotionPrice']) ?: $item['preco_unitario'] ?? $item['price']) * $item['quantidade']) + $item['shippingCost'];
        
        $dataPrevisao = new DateTime('now'); 
        $dataPrevisao->modify("+".$item['deliveryTime']." days");

        $this->itens[] = [
            "id_produto"     => $item['id'],
            "id_seller" => $item['sellerId'],
            'product_name' => $item['productName'],
            'product_image' => $imagePreview,
            "quantidade" => $item['quantidade'],
            "cor" => $item['cor'],
            "tamanho" => $item['tamanho'],
            "preco_unitario" => $item['price'],
            "preco_promocao" => $item['promotionPrice'],
            "frete"          => $item['shippingCost'],
            "total_produto"  => $productTotal,
            "data_previsao" => $dataPrevisao->format('Y-m-d'),
            "data_entregue" =>  null,
            "status" => 'pendente',
            "recebido_por"=> null,
        ];

    }

    // Adiciona um único item ao array
    public function adicionarItemArray(array $item): void
    {
        $this->itens[] = $item;
    }

}