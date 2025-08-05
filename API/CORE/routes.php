<?php 
    header("Content-Type: application/json; cahrset=utf-8");

    // use Controller\TaskController;
    use Help\Functions;
    use Controller\ProductController;

    // Functions::verifyKey();

    
    switch(Functions::formatUrl()){
        case '/':
            echo 'Bem vindo a Index ';
            echo json_encode(ProductController::index(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            break;
            
        default: die("not found");
    }
?>