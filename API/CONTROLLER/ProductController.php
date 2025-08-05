<?php 
    namespace Controller;

use Model\Product;

    abstract class ProductController{
        public static function index(){
            return ((new Product())->selectAll());
        }
    }
?>