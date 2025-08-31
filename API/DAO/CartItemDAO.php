<?php 
    namespace DAO;

use Controller\CartController;
use DAO\DAO;
    use Model\CartItem;

    class CartItemDAO extends DAO{
        public function __construct()
        {
            parent::__construct();
        }

        public function insert(CartItem $item) : bool{
            $exist = $this->getCartIten($item->getProductId(), $item->getCartId());

            if($exist){
                return $this->quantityControll($item->getCartId(), $item->getProductId(), 'more');
            };

            $sql = "INSERT INTO carrinho_itens (cartId, productId, quantity) VALUES(?, ?, ?)";

            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $item->getCartId());
            $stmt->bindValue(2, $item->getProductId());
            $stmt->bindValue(3, $item->getQuantity());

            return $stmt->execute();
        }

        public function getCartIten(int $productId, int $cartId){
            $sql = "SELECT productId FROM carrinho_itens WHERE productId = ? AND cartId = ?";

            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $productId);
            $stmt->bindValue(2, $cartId);
            $stmt->execute();

            return $stmt->fetch(DAO::FETCH_ASSOC);
        }

        public function getByUserId(int $cartId) : ?array{            
            $sql = "SELECT productId, quantity FROM carrinho_itens WHERE cartId = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $cartId);
            $stmt->execute();
            
            // return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\Product");
            return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\CartItem") ?: null;
        }

        public function quantityControll(int $cartId, int $productId, string $operation){

            if($operation === 'more'){
                $sql = "UPDATE carrinho_itens ci
                        INNER JOIN produtos p ON ci.productId = p.id
                        SET ci.quantity = ci.quantity + 1
                        WHERE ci.productId = ?
                            AND ci.quantity < p.stockTotal  AND cartId = ?";
            }else{
                $sql = "UPDATE carrinho_itens SET quantity = quantity - 1 WHERE productId = ? AND quantity > 1 AND cartId = ?";
            }
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $productId);
            $stmt->bindValue(2, $cartId);
            return $stmt->execute();
        }

         public function delete(int $cartId, int $productId): bool{
            $sql = "DELETE FROM carrinho_itens WHERE productId = ? AND cartId = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $productId);
            $stmt->bindValue(2, $cartId);
            return $stmt->execute();
        }
    }
?>