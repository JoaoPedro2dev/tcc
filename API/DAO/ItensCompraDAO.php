<?php

    namespace DAO;

    use DAO\DAO;
    use PDOException;

class ItensCompraDAO extends DAO{
    public function insert($id_compra, array $itens) {
        try {
            $sql = "INSERT INTO itens_compra
                (id_compra, id_produto, product_name, product_image, quantidade, preco_unitario, preco_promocao, frete, total_produto, data_previsao, `status`)
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = parent::$conexao->prepare($sql);

            foreach ($itens as $item) {
                $ok = $stmt->execute(
                    [
                        $id_compra,
                        $item["id_produto"],
                        $item["product_name"],
                        $item['product_image'],
                        $item["quantidade"],
                        $item["preco_unitario"],
                        $item['preco_promocao'],
                        $item['frete'],
                        $item['total_produto'],
                        $item['data_previsao'],
                        $item['status'],
                    ]
                );

                if(!$ok){
                    return false;
                }
            }

            return true;

        } catch (PDOException $e) {
            echo "Erro ao inserir itens da compra: " . $e->getMessage();
            return false;
        }
    }
}