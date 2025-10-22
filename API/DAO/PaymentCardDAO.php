<?php 
    namespace DAO;

    use DAO\DAO;
use Model\PaymentCard;

    class PaymentCardDAO extends DAO{

        public function insert(PaymentCard $model) : ?int{
            $sql = "INSERT INTO payment_cards (user_id, encrypted_pan, encrypted_cvv, brand, last4, exp_month, exp_year, cardholder_name) VALUES (?, sha1(?), sha1(?), ?, ?, ?, ?, ?)";
            
            $stmt = parent::$conexao->prepare($sql);
            $success = $stmt->execute([
                $model->getUserId(),
                $model->getCompleteNumber(),
                $model->getEncryptedCvv(),
                'visa',
                $model->getLast4(),
                $model->getExpMonth(),
                $model->getExpYear(),
                $model->getCardholderName()
            ]);

            if($success){
                return parent::$conexao->lastInsertId();
            }
            
            return null;
        }
        
        public function selectAll(int $user_id): array{
            $sql = "SELECT * FROM payment_cards WHERE user_id = ?";
            
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$user_id]);

            $cards = $stmt->fetchAll(DAO::FETCH_CLASS, "Model\PaymentCard");

            foreach($cards as $card){
                $card->setHiddenNumber(); 
            }

            return $cards;
        }

        public function delete(int $id_card) : bool{
            $sql = "DELETE FROM payment_cards WHERE id = ?";
            $stmt = parent::$conexao->prepare($sql);
            return $stmt->execute([$id_card]);
        }

        public function existsCardNumber(int $user_id, string $card_number) : bool{
            $sql = "SELECT COUNT(*) FROM payment_cards WHERE encrypted_pan = sha1(?) AND user_id = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$card_number, $user_id]);
            return $stmt->fetchColumn() > 0;
        }
    }

?>