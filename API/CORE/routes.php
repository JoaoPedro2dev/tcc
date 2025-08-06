<?php 
    header("Content-Type: application/json; cahrset=utf-8");

    // use Controller\TaskController;
    use Help\Functions;
    use Controller\ProductController;

    // Functions::verifyKey();

    
    switch(Functions::formatUrl()){
        case '/':
            // echo 'Bem vindo a Index ';
            echo json_encode(ProductController::index(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            break;

        case '/search':
            $var = trim($_GET['search'] ?? '');

            $search = htmlspecialchars($var, ENT_QUOTES, 'UTF-8');
            
            if($search === ''){
                die(json_encode(['status' => 'Você precisa de uma busca'], JSON_UNESCAPED_UNICODE));
            }
            
            echo 'Bem vindo a procura por texto ';
            echo json_encode(ProductController::selectSearch($search), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            break;
            
        default: die("not found");
    }
?>