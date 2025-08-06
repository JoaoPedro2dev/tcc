<?php 
    namespace Controller;

use Model\Product;

    abstract class ProductController{
        public static function index(){
            return ((new Product())->selectAll());
        }
        
        public static function selectSearch($search){
            return ((new Product())->getBeLike($search));
        }
    }
?>