<?php
    namespace Controller;
    
    use Model\CartItem;

    abstract class CartItemController{
        static function addItem(int $cartId, int $productId, int $qty): bool{
            return ((new CartItem())->insert($cartId, $productId, $qty));
        }

        static function getUserId(int $cartId){
            return (new CartItem()) -> getByUserId($cartId);
        }

        static function quantityControll(int $cartId, int $productId, string $operation){
            return (new CartItem()) -> quantityControll($cartId, $productId, $operation);
        }

        static function delete(int $cartId, int $productId){
            return (new CartItem()) -> delete($cartId, $productId);
        }
    }
?>