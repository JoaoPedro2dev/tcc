<?php 
    header("Content-Type: application/json; cahrset=utf-8");

    // use Controller\TaskController;
    use Help\Functions;

    // Functions::verifyKey();

    
    switch(Functions::formatUrl()){
        case '/':
            echo 'Bem vindo a Index';
            break;
            
        default: die("not found");
    }
?>