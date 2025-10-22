<?php 
namespace Controller;

use Model\Endereco;

    abstract class EnderecoController{
        
        static function insert(Endereco $model){
            return ((new Endereco())->insert($model));
        }

    }
?>