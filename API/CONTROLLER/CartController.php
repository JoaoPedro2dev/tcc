<?php
    namespace Controller;

    use Model\Cart;

    abstract class CartController{
        static function addItem(int $userId){
            return ((new Cart($userId)) -> createCart());
        }

        static function getId(int $userId){
            return ((new Cart($userId)) -> getByUserId());
        }

        static function getAll(array $array){
            return ((new Cart(0))->selectAll($array));
        }

        static function selectToShelf(int $user_id){
            return ((new Cart(0))->selectToShelf($user_id));
        }
    }
?>