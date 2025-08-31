<?php 
    date_default_timezone_set('America/Sao_Paulo');
    // Configuração CORS
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin === 'http://localhost:5173') {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    }

    // Tratar requisições OPTIONS (pré-flight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    header("Content-Type: application/json");

    require_once "./vendor/autoload.php";
    require_once "./CONFIG/autoload.php";
    require_once "./CONFIG/conexao.php";
    include_once "./CORE/routes.php";
?>