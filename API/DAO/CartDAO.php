<?php
    namespace DAO;

    use DAO\DAO;
    use Model\Cart;

    class CartDAO extends DAO{
        public function __construct()
        {
            parent::__construct();
        }

        public function createCart(Cart $item) : bool{
            $sql = "INSERT INTO carrinhos (userId) VALUES(?)";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $item->getUserId());
            return $stmt -> execute();
        }

        public function getByUserId(int $userId) : ?int{
            $sql = "SELECT id FROM carrinhos WHERE userId = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $userId);
            $stmt -> execute();
            
            $result = $stmt->fetchColumn();
            return $result !== false ? (int) $result : null;
        }

        public function selectAll(array $array) : ?array{
            if(empty($array)){
                return null;
            }

            $placeholders = implode(',', array_fill(0, count($array), '?'));
            
            $sql = "SELECT * FROM produtos WHERE id IN ($placeholders) ORDER BY FIELD (id, $placeholders)";
            $stmt = parent::$conexao->prepare($sql);

            $i = 1;
            foreach (array_values($array) as $id) {
                $stmt->bindValue($i++, $id, DAO::PARAM_INT);
            }
            
            foreach (array_values($array) as $id) {
                $stmt->bindValue($i++, $id, DAO::PARAM_INT);
            }
            
            $stmt->execute();
            
            return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\Product");
        }
    }
?>