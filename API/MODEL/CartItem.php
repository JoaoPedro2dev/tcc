<?php 

    namespace Model;

    use DAO\CartItemDAO;

    class CartItem {
        public int $itemId;
        public ?int $cartId;
        public int $productId;
        public string $cor;
        public string $tamanho;
        public int $quantity;

        public function insert(int $cartId, int $productId, string $cor, string $tamanho, int $qty):bool{
            $this->setCartId($cartId);
            $this->setProductId($productId);
            $this->setCor($cor);
            $this->setTamanho($tamanho);
            $this->setQuantity($qty);
            
            return ((new CartItemDAO())->insert($this));
        }

        public function getByUserId(int $cartId) : ?array{
            return ((new CartItemDAO())->getByUserId($cartId));
        }

        public function quantityControll(int $cartId, int $productId, string $operation){
            return ((new CartItemDAO())->quantityControll($cartId, $productId, $operation));
        }

        public function delete(int $cartId, int $productId){
            return ((new CartItemDAO())->delete($cartId, $productId));
        }

        // Getters e Setters
        public function getItemId(): int {
            return $this->itemId;
        }

        public function setItemId(int $itemId): void {
            $this->itemId = $itemId;
        }

        public function getCartId(): int {
            return $this->cartId;
        }

        public function setCartId(int $cartId): void {
            $this->cartId = $cartId;
        }

        public function getProductId(): int {
            return $this->productId;
        }

        public function setProductId(int $productId): void {
            $this->productId = $productId;
        }

        public function getQuantity(): int {
            return $this->quantity;
        }

        public function setCor(string $cor): void {
            $this->cor = $cor;
        }

        public function getCor(): string {
            return $this->cor;
        }

        public function setTamanho(string $tamanho): void {
            $this->tamanho = $tamanho;
        }

        public function getTamanho(): string {
            return $this->tamanho;
        }

        public function setQuantity(int $quantity): void {
            $this->quantity = $quantity;
        }
    }
?>