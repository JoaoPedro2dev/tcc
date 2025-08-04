<?php 
    namespace Help;

    abstract class Functions{
        
        public static function formatUrl(){
            $url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $base = '/tcc/API';
            
            return $url = str_replace($base, '', $url);
        }
        
    }  
?>