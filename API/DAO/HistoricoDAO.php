<?php

namespace DAO;
use DAO\DAO;
use Model\Historico;

class HistoricoDAO extends DAO{
    public function getHistory($id_usuario) : array{
        $stmt = parent::$conexao->prepare(
            "SELECT h.*, p.id AS id_produto, p.productName, p.images, p.price, p.promotionPrice, p.shippingCost
            FROM historico h
            INNER JOIN produtos p ON p.id = h.produto_id
            WHERE h.user_id = ?");
        $stmt->execute([$id_usuario]);
        
        $produtos = $stmt->fetchAll(DAO::FETCH_CLASS, 'Model\Historico');

        foreach($produtos as $produto){
            $images = json_decode($produto->getProductImage(), true);
            $produto->setProductImage($images[0]);
        }

        return $produtos;
    }

    public function delete(int $id_historico, int $user_id):bool{
        $sql = "DELETE FROM historico WHERE id_historico = ? AND user_id = ?";
        $stmt = parent::$conexao->prepare($sql);
        return $stmt->execute([$id_historico, $user_id]);
    }

    public function insert(int $id_usuario, int $id_produto) : bool{

        if($this->existHistory($id_usuario, $id_produto)) return false;  

        $sql = "INSERT INTO historico (user_id, produto_id) VALUES(?, ?)";
        $stmt = parent::$conexao->prepare($sql);
        return $stmt->execute([$id_usuario, $id_produto]);
    }

    public function existHistory(int $id_usuario, int $id_produto) : bool{
        $sql = "SELECT 1 FROM historico WHERE user_id = ? AND produto_id = ? LIMIT 1";
        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute([$id_usuario, $id_produto]);

        return $stmt->fetchColumn() !== false;
    }
}

?>