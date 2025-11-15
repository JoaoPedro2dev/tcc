<?php 

namespace Controller;

use Model\ItensCompra;

abstract class ItensCompraController{
    static function getBySellerId($id_seller){
        return ((new ItensCompra())->getBySellerId($id_seller));
    }

    static function statusConfirm(int $id_item, string $quem_entrega){
        return ((new ItensCompra())->statusConfirm($id_item, $quem_entrega));
    }

    static function cancelarItem(int $id_item, string $motivo_cancelamento, string $quem_cancelou) : bool{
        return ((new ItensCompra())->cancelarItem($id_item, $motivo_cancelamento, $quem_cancelou));
    }

    static function alterarStatus(int $id_item, string $novo_estado, string $data_entregue = null):bool{
        return ((new ItensCompra())->alterarStatus($id_item,  $novo_estado, $data_entregue));
    }
}

?>