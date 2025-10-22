<?php

namespace Controller;
use Model\Vendedor;

abstract class VendedorController{
    static function selectByUrl(string $url){
        return ((new Vendedor())->selectByUrl($url));
    }

    static function update(Vendedor $model){
        return ((new Vendedor())->update($model));
    }
}

?>