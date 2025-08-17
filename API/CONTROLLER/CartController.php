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
            return ((new Cart(1))->selectAll($array));
        }
    }
?>