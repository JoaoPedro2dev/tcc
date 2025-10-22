<?php 
    namespace Help;

use DateTime;
use Exception;

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

        public static function verifyIdPost($var){
            $post = trim($_POST[$var] ?? '');

            if($post  === ''){
                die(json_encode(['status' => 'erro', 'desc' => 'Preencha o campo '.$var], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            if(!filter_var($post , FILTER_VALIDATE_INT)){
                die(json_encode(['status' => 'erro', 'desc' => 'Preencha o campo '.$var.' com valores do tipo int'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            return $_POST[$var];
        }

        public static function verifyVar($var){
            $get = trim($_GET[$var] ?? '');

            if($get  === ''){
                die(json_encode(['status' => 'erro', 'desc' => 'Preencha o campo '.$var], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            return $_GET[$var];
        } 

        
        public static function verifyPost($var){
            $post = trim($_POST[$var] ?? '');

            if($post  === '' || empty($post) || $post === null){
                throw new Exception(json_encode(['success' => false, 'field' => $var, 'status' => 'Campo obrigatório'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            return $_POST[$var];
        } 

        public static function VerifyPromotionDates($promotionDate, $isEndDate = false){

            $field = $isEndDate ? 'promotionEndDate' : 'promotionStartDay';

            // Tenta converter a string para um objeto DateTime
            $data = DateTime::createFromFormat('Y-m-d', $promotionDate);

            // Verifica se a data é válida e no formato correto
            $formatoValido = $data && $data->format('Y-m-d') === $promotionDate;

            if (!$formatoValido) {
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => $field,
                            'status' => 'Data inválida'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
                exit;
            }

            // Data atual (sem hora)
            $hoje = new DateTime('today');

            // Data limite: um ano à frente
            $limite = (clone $hoje)->modify('+1 year');

            if ($data < $hoje) {
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => $field,
                            'status' => 'A data não pode ser anterior a hoje'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
                exit;
                exit;
            }
                
            if($isEndDate){
                if ($data < $hoje->modify('+1 day')) {
                    throw new Exception(
                            json_encode(
                                ['success' => false,
                                'field' => 'promotionEndDate',
                                'status' => 'A Promoção deve durar no mínimo 1 (um) dia'],
                                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                            ));
                    exit;
                    exit;
                }
            }

            if ($data > $limite) {
                echo "A data não pode ser superior a um ano no futuro.";
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => $field,
                            'status' => 'A data não pode ser superior a 1 (um) ano no futuro'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
                exit;
                exit;
            }

            return $promotionDate;
        }
        
    }  
?>