<?php
    
    namespace DAO;
    
    use DAO\DAO;
    use Model\Compra;
    use DAO\ItensCompraDAO;
    use PDOException;

    class CompraDAO extends DAO{
        public function insert(Compra $compra){
            try {
                parent::$conexao->beginTransaction();

                $sql = "INSERT INTO compras 
                        (id_cliente, cpf_cliente, id_loja, endereco_entrega, forma_pagamento, preco_total, id_cartao, parcelas, valor_parcelas, frete_total)
                        VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                
                $stmt = parent::$conexao->prepare($sql);

                $stmt->execute([
                    $compra->getIdCliente(),
                    $compra->getCpfCliente(),
                    $compra->getIdLoja(),
                    // $compra->getCnpjLoja(),
                    $compra->getEnderecoEntrega(),
                    $compra->getFormaPagamento(),
                    $compra->getPrecoTotal(),
                    $compra->getIdCartao(),
                    $compra->getParcelas(),
                    $compra->getValorParcelas(),
                    $compra->getFreteTotal(),
                ]);
                $lastId = parent::$conexao->lastInsertId();
                $compra->setIdCompra($lastId);

                $itensCompra = new ItensCompraDAO();
                $resultItensInsert = $itensCompra->insert($compra->getIdCompra(), $compra->getItens());

                if(!$resultItensInsert){
                    parent::$conexao->rollBack();
                    return false;
                }

                parent::$conexao->commit();
                return true;

            } catch (PDOException $e) {
                parent::$conexao->rollBack();
                echo "Erro ao inserir compra: " . $e->getMessage();
                return false;
            }
        }

        public function getAllById(int $id_usuario) : ?array{
            $compras = []; // array final de objetos Compra
            $stmt = parent::$conexao->prepare(
                "SELECT c.*, ic.*, p.name
                FROM compras c
                INNER JOIN itens_compra ic ON ic.id_compra = c.id_compra
                INNER JOIN pessoas p ON p.id = c.id_cliente
                WHERE c.id_cliente = ?");
            $stmt->execute([$id_usuario]);

            $comprasTemp = [];

            while ($row = $stmt->fetch(DAO::FETCH_ASSOC)) {
                $id = $row['id_compra'];        

                // Se a compra ainda não foi criada no array
                if (!isset($comprasTemp[$id])) {
                    $compra = new Compra();
                    $compra->setIdCompra($row['id_compra']);
                    $compra->setIdCliente($row['id_cliente']);
                    $compra->setName($row['name']);
                    $compra->setCpfCliente($row['cpf_cliente']);
                    $compra->setIdLoja($row['id_loja']);
                    // $compra->setCnpjLoja($row['cnpj_loja']);
                    $compra->setEnderecoEntrega($row['endereco_entrega']);
                    // $compra->setTipoEndereco($row['tipo_endereco']);
                    $compra->setFormaPagamento($row['forma_pagamento']);
                    $compra->setPrecoTotal($row['preco_total']);
                    $compra->setLinkNfe($row['link_nfe']);
                    $compra->setDataCompra($row['data_compra']);
                    $compra->setStatus($row['status']);

                    $comprasTemp[$id] = $compra;
                }

                // Adiciona o item ao array de itens da compra
                $item = [
                    'id_item'       => $row['id_item'],       // ajustar conforme colunas da tabela itens_compra
                    'id_produto'    => $row['id_produto'],
                    'id_seller' => $row['seller_id'],
                    'product_name' => $row['product_name'],
                    'produc_image' => $row['product_image'],
                    'quantidade'    => $row['quantidade'],
                    'preco_unitario'=> $row['preco_unitario'],
                    "preco_promocao" => $row['preco_promocao'],
                    'frete'         => $row['frete'],
                    'total_produto' => $row['total_produto'],
                    "data_previsao" => $row['data_previsao'],
                    "data_entregue" => $row['data_entregue'],
                    "cor" => $row['cor'],
                    'tamanho' => $row['tamanho'],
                    'status' => $row['status'],
                    'quem_cancelou' => $row['quem_cancelou'],
                    'motivo_cancelamento' => $row['motivo_cancelamento'],
                    'recebido_por' => $row['recebido_por'],
                ];

                $comprasTemp[$id]->adicionarItemArray($item);
                $comprasTemp[$id]->setPrecoTotal();
            }

            // Converte para array de objetos
            $compras = array_values($comprasTemp);
            return $compras;
        }

        public function getById($id_compra){
            $sql = "SELECT c.*, ic.*, p.name
                    FROM compras c
                    INNER JOIN itens_compra ic ON ic.id_compra = c.id_compra
                    INNER JOIN pessoas p ON p.id = c.id_cliente
                    WHERE c.id_compra = ?";

            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$id_compra]);

            $compra = null;
            $rows = $stmt->fetchAll(DAO::FETCH_ASSOC);
            
            // print_r($rows);

            foreach($rows as $row){
                if($compra === null){
                    $compra = new Compra();
                    $compra->setIdCompra($row['id_compra']);
                    $compra->setIdCliente($row['id_cliente']);
                    $compra->setName($row['name']);
                    $compra->setCpfCliente($row['cpf_cliente']);
                    $compra->setIdLoja($row['id_loja']);
                    // $compra->setCnpjLoja($row['cnpj_loja']);
                    $compra->setParcelas($row['parcelas']);
                    $compra->setValorParcelas($row['valor_parcelas']);
                    $compra->setFormaPagamento($row['forma_pagamento']);
                    $compra->setPrecoTotal($row['preco_total']);
                    // $compra->setQuemR
                    $compra->setEnderecoEntrega($row['endereco_entrega']);
                    $compra->setLinkNfe($row['link_nfe']);
                    $compra->setDataCompra($row['data_compra']);
                    $compra->setStatus($row['status']);
                }

                $item = [
                    'id_item'       => $row['id_item'], 
                    'id_produto'    => $row['id_produto'],
                    'id_seller' => $row['seller_id'],
                    'cor' => $row['cor'],
                    'tamanho' => $row['tamanho'],
                    'product_name' => $row['product_name'],
                    'produc_image' => $row['product_image'],
                    'quantidade'    => $row['quantidade'],
                    'preco_unitario'=> $row['preco_unitario'],
                    "preco_promocao" => $row['preco_promocao'],
                    'frete'         => $row['frete'],
                    'total_produto' => $row['total_produto'],
                    "data_previsao" => $row['data_previsao'],
                    "data_entregue" => $row['data_entregue'],
                    'status' => $row['status'],
                    'quem_cancelou' => $row['quem_cancelou'],
                    'motivo_cancelamento' => $row['motivo_cancelamento'],
                    'recebido_por' => $row['recebido_por'],
                ];

                $compra->adicionarItemArray($item);
            }
            
            // $compra->setPrecoTotal();
            $compra->setPrecoTotal($row['preco_total']);
            
            return $compra;
        }
    }
?>