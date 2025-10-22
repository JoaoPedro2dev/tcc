<?php

namespace Controller;
use Model\Historico;

abstract class HistoricoController{
    static function getHistory(int $id_usuario){
        return ((new Historico())->getHistory($id_usuario));
    }

    static function delete(int $id_historio, int $user_id){
        return ((new Historico())->delete($id_historio, $user_id));
    }

     static function insert(int $id_usuario, int $id_produto){
        return ((new Historico())->insert($id_usuario, $id_produto));
    }
}
?>