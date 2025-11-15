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

            $sql = "INSERT INTO carrinho_itens (cartId, productId, cor, tamanho, quantity) VALUES(?, ?, ?, ?, ?)";

            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $item->getCartId());
            $stmt->bindValue(2, $item->getProductId());
            $stmt->bindValue(3, $item->getCor());
            $stmt->bindValue(4, $item->getTamanho());
            $stmt->bindValue(5, $item->getQuantity());

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
            $sql = "SELECT productId, cor, tamanho, quantity FROM carrinho_itens WHERE cartId = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $cartId);
            $stmt->execute();
            
            // return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\Product");
            return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\CartItem") ?: null;
        }

       public function quantityControll(int $cartId, int $productId, string $operation) {
            if ($operation === 'more') {
                // Aumentar quantidade: verificar se tem estoque disponível
                $sql = "UPDATE carrinho_itens ci
                        INNER JOIN produtos_itens pi ON pi.id = ci.id_item
                        INNER JOIN produtos_variacoes pv ON pv.id = ci.id_variacao
                        SET ci.quantity = ci.quantity + 1
                        WHERE ci.productId = ?
                        AND ci.cartId = ?
                        AND (ci.quantity + 1) <= pv.quantity";
            } else if ($operation === 'less') {
                // Diminuir quantidade: garantir que não fica negativo
                $sql = "UPDATE carrinho_itens 
                        SET quantity = quantity - 1 
                        WHERE id_produto = ? 
                        AND cartId = ?
                        AND quantity > 1";
            } else {
                return false; // Operação inválida
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