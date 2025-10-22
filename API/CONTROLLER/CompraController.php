<?php 

    namespace Controller;

    use Model\Compra;

    abstract class CompraController{
        static function insert(Compra $compra){
            return ((new Compra())->insert($compra));
        }

        static function getAllById($id) : ?array{
            return ((new Compra())->getAllById($id));
        }

        static function getById($id_compra){
            return ((new Compra())->getById($id_compra));
        }

    }

?>