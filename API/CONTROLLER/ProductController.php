<?php 
    namespace Controller;

use DateTime;
use Model\Product;

    abstract class ProductController{
         
        static function insert(Product $model){
            return ((new Product())->insert($model));
        }

        static function update(Product $model){
            return ((new Product())->update($model));
        }

        public static function index(){
            return ((new Product())->selectAll());
        }

        public static function selectProduct( $id){
            return ((new Product())->getById($id));
        }
        
        public static function selectSearch($search, $colors, $sizes, $genders, $conditions){
            return ((new Product())->getBeLike($search, $colors, $sizes, $genders, $conditions));
        }

        public static function getPromotionDay(){
            return ((new Product())->getPromotionDay());
        }

        public static function getBySellerId(int $seller_id){
            return ((new Product())->getBySellerId($seller_id));
        }

        public static function addPromotion(float $promotion_price, string $start_date, string $end_date, int $product_id):bool{
            return ((new Product())->addPromotion( $promotion_price,  $start_date, $end_date, $product_id));
        }

        public static function removePromotion(int $product_id):bool{
            return ((new Product())->removePromotion($product_id));
        }

        public static function getSimilarItems(string $category, string $subCategory, string $style, int $id_produto){
            return ((new Product())->getSimilarItems($category, $subCategory, $style, $id_produto));
        }
    }
?>