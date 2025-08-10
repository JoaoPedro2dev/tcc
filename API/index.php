<?php 
    // Permitir acesso de qualquer origem (ou especifique sua URL)
    header("Access-Control-Allow-Origin: *");

    // Permitir métodos (GET, POST, PUT, DELETE, etc)
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

    // Permitir headers personalizados
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    header("Content-Type: application/json");

    // // Importante: Tratar requisições OPTIONS (pré-flight)
    // if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    //     http_response_code(200);
    //     exit();
    // }
    
    require_once"./CONFIG/autoload.php";
    require_once"./CONFIG/conexao.php";
    include_once"./CORE/routes.php";
?>