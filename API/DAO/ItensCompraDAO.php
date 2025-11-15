<?php

    namespace DAO;

    use DAO\DAO;
    use PDOException;

class ItensCompraDAO extends DAO{
    public function insert($id_compra, array $itens) {
        try {
            $sql = "INSERT INTO itens_compra
                (id_compra, id_produto, seller_id, product_name, product_image, quantidade, cor, tamanho, preco_unitario, preco_promocao, frete, total_produto, data_previsao, `status`)
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = parent::$conexao->prepare($sql);

            foreach ($itens as $item) {
                $ok = $stmt->execute(
                    [
                        $id_compra,
                        $item["id_produto"],
                        $item["id_seller"],
                        $item["product_name"],
                        $item['product_image'],
                        $item["quantidade"],
                        $item["cor"],
                        $item["tamanho"],
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
    
    public function getBySellerId($id_seller){
        $stmt = parent::$conexao->prepare(
            "SELECT ic.*, c.id_compra, c.endereco_entrega, c.data_compra, c.preco_total, p.name AS nome_cliente
            FROM compras c
            INNER JOIN itens_compra ic ON ic.id_compra = c.id_compra
            INNER JOIN pessoas p ON p.id = c.id_cliente
            WHERE ic.seller_id = ?"
        );
        $stmt->execute([$id_seller]);
        return $stmt->fetchAll(DAO::FETCH_CLASS, 'Model\ItensCompra');
    }

    public function statusConfirm(int $id_item, string $quem_entrega){
        $sql = "UPDATE itens_compra SET `status` = 'confirmado', quem_entrega = ? WHERE id_item = ?";

        $stmt = parent::$conexao->prepare($sql);
        return $stmt->execute([$quem_entrega, $id_item]);
    }

    public function cancelarItem(int $id_item, string $motivo_cancelamento, string $quem_cancelou) : bool{
        $sql = "UPDATE itens_compra SET `status` = 'cancelado', motivo_cancelamento = ?, quem_cancelou = ? WHERE id_item = ?";

        $stmt = parent::$conexao->prepare($sql);
        return $stmt->execute([$motivo_cancelamento, $quem_cancelou, $id_item]);
    }

    public function alterarStatus(int $id_item, string $novo_estado):bool{
        $sql = "UPDATE itens_compra SET status = ? WHERE id_item = ?";

        $stmt = parent::$conexao->prepare($sql);
        return $stmt->execute([$novo_estado, $id_item]);
    }
}