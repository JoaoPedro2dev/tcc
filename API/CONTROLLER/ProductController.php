<?php 
    namespace Controller;

use Model\Product;

    abstract class ProductController{
        public static function index(){
            return ((new Product())->selectAll());
        }
        
        public static function selectSearch($search, $colors, $sizes, $genders, $conditions){
            return ((new Product())->getBeLike($search, $colors, $sizes, $genders, $conditions));
        }
    }
?>