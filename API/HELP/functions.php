<?php 
    namespace Help;

    abstract class Functions{
        
        public static function formatUrl(){
            $url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $base = '/tcc/API';
            
            return $url = str_replace($base, '', $url);
        }

        public static function verifyId($var){
            $get = trim($_GET[$var] ?? '');

            if($get  === ''){
                die(json_encode(['status' => 'erro', 'desc' => 'Preencha o campo '.$var], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            if(!filter_var($get , FILTER_VALIDATE_INT)){
                die(json_encode(['status' => 'erro', 'desc' => 'Preencha o campo '.$var.' com valores do tipo int'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            return $_GET[$var];
        }
        
    }  
?>