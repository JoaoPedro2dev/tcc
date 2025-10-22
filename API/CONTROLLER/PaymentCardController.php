<?php 
    namespace Controller;

use Model\PaymentCard;

    abstract class PaymentCardController{
        static function insert(PaymentCard $model): ?int{
            return ((new PaymentCard())->insert($model));
        }
        
        static function selectAll(int $user_id):?array{
            return ((new PaymentCard())->selectAll($user_id));
        }

        static function delete(int $id_card):bool{
            return ((new PaymentCard())->delete($id_card));
        }
    }
?>