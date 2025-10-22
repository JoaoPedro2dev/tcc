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
    // public string $cnpj_loja;
    public string $endereco_entrega;
    // public ?string $tipo_endereco;
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

    static function getById(int $id_compra){
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

    public function getCnpjLoja(): string
    {
        return $this->cnpj_loja;
    }

    public function setCnpjLoja(string $cnpj_loja): void
    {
        $this->cnpj_loja = $cnpj_loja;
    }

    public function getEnderecoEntrega(): string
    {
        return $this->endereco_entrega;
    }

    public function setEnderecoEntrega(string $endereco_entrega): void
    {
        $this->endereco_entrega = $endereco_entrega;
    }

    // public function getTipoEndereco(): ?string
    // {
    //     return $this->tipo_endereco;
    // }

    // public function setTipoEndereco(?string $tipo_endereco): void
    // {
    //     $this->tipo_endereco = $tipo_endereco;
    // }

    public function getFormaPagamento(): string
    {
        return $this->forma_pagamento;
    }

    public function setFormaPagamento(string $forma_pagamento): void
    {
        $this->forma_pagamento = $forma_pagamento;
    }

    public function getPrecoTotal(): float
    {
        return $this->preco_total;
    }

    public function setPrecoTotal(): void
    {
        $total = 0;
        foreach($this->itens as $item){
            $total += ($item['total_produto'] * $item['quantidade']);
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

    // Adicionar item à compra
    public function adicionarItem(array $item) {

        $imagePreview = json_decode($item['images'], true)[0];
        $productTotal = ($item['promotionPrice'] ? ($item['promotionPrice'] * $item['quantidade']) : $item['price'] * $item['quantidade']) + $item['shippingCost'];
        
        $dataPrevisao = new DateTime('now'); 
        $dataPrevisao->modify("+".$item['deliveryTime']." days");

        $this->itens[] = [
            "id_produto"     => $item['id'],
            'product_name' => $item['productName'],
            'product_image' => $imagePreview,
            "quantidade"     => $item['quantidade'],
            "preco_unitario" => $item['price'],
            "preco_promocao" => $item['promotionPrice'],
            "frete"          => $item['shippingCost'],
            "total_produto"  => $productTotal,
            "data_previsao" => $dataPrevisao->format('Y-m-d'),
            "data_entregue" =>  null,
            "status" => 'pendente',
            "recebido_por"=> null,
        ];

        $this->preco_total += $productTotal;
    }

    // Listar todos os itens
    public function listarItens() {
        return $this->itens;
    }

    // Resumo da compra
    public function resumoCompra() {
        return [
            "id_compra"       => $this->id_compra,
            "id_cliente"      => $this->id_cliente,
            "cpf_cliente"     => $this->cpf_cliente,
            "id_loja"         => $this->id_loja,
            "cnpj_loja"       => $this->cnpj_loja,
            "endereco"        => $this->endereco_entrega,
            "tipo_endereco"   => $this->tipo_endereco,
            "forma_pagamento" => $this->forma_pagamento,
            "preco_total"     => $this->preco_total,
            "link_nfe"        => $this->link_nfe,
            "data_compra"     => $this->data_compra,
            "itens"           => $this->itens
        ];
    }

    // Adiciona um único item ao array
    public function adicionarItemArray(array $item): void
    {
        $this->itens[] = $item;
    }

}