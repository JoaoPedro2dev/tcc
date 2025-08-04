<?php 
    define('BASE_DIR', __DIR__ . "/../");

    spl_autoload_register(function ($nome_da_classe)
    {
        $caminho = str_replace("\\", DIRECTORY_SEPARATOR, $nome_da_classe);
        
       $arquivo = BASE_DIR . $caminho . ".php";
       
       if(file_exists($arquivo)){
        include $arquivo;
       }else{
        throw new Exception("Arquivo não encontrado " . $arquivo);
       }
    });
?>