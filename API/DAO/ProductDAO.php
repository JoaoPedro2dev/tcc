<?php
    namespace DAO;

    use DAO\DAO;
    use Model\Product;

    class ProductDAO extends DAO{
        public function __construct()
        {
            parent::__construct();
        }        

        public function insert(Product $model) : Product
        { 
            $sql = "INSERT INTO lembretes (id_usuario, titulo, descricao, tipo, delay, horario, inicio) VALUES (?, ?, ?, ?, ?, ?, ?)";

            $stmt = parent::$conexao->prepare($sql);
            // $stmt->bindValue(1, $model->getIdUsuario());
            // $stmt->bindValue(2, $model->getTitulo());
            // $stmt->bindValue(3, $model->getDescricao());
            // $stmt->bindValue(4, $model->getTipo());
            // $stmt->bindValue(5, $model->getDelay());
            // $stmt->bindValue(6, $model->getHorario());
            // $stmt->bindValue(7, $model->getInicio());

            $stmt->execute();
            $model->setId(parent::$conexao->lastInsertId());
            
            return $model;
        }  

        public function getById(int $id) : ?Product {
            $sql = "SELECT * FROM lembretes WHERE id = ?";

            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $id);
            $stmt->execute();

            return $stmt->fetchObject("Model\Task") ?: null;
        }

        public function selectAll(): array {
            $sql = "SELECT * FROM Produtos";

            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute();

            return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\Product");
        }

        public function getBeLike($search, $colors, $sizes, $gender, $condition): ?array {
            // $like = "%$search%";

            $array = [
                [
                    'var' => $colors,
                    'field' => 'p.availableColors'
                ],

                [
                    'var' => $sizes,
                    'field' => 'p.availableSizes'
                ],

                [
                    'var' => $gender,
                    'field' => 'p.gender'
                ],

                [
                    'var' => $condition,
                    'field' => 'p.condition'
                ],
            ];

            $condicoes = [];
            $peso = [];
            
            foreach($array as $item){
                foreach($item['var'] as $value){
                    $json = json_encode($value);
                    $condicao = "JSON_CONTAINS({$item['field']},$json)";
                    $condicoes[] =  $condicao;
                    $peso[] = "IF($condicao, 1, 0)"; 
                }
            }
            
            $where = implode(' OR ', $condicoes);
            $score = implode(' + ', $peso);

            
            $sql = "SELECT 
                    p.id, p.sellerId,
                    p.productName,
                    v.sellerName,
                    p.category,
                    p.gender,
                    p.`condition`,
                    p.price,
                    p.shippingCost,
                    p.salesQuantity,
                    p.stockTotal,
                    p.description,
                    p.promotionPrice,
                    p.installments,
                    p.fees,
                    p.availableColors,
                    p.availableSizes,
                    p.images,

                    -- ✅ relevância calculada aqui dentro do SELECT
                    (
                        MATCH(p.productName, p.description, p.category) AGAINST(? IN NATURAL LANGUAGE MODE)
                        " . (!empty($peso) ? " + " . implode(' + ', $peso) : "") . "
                    ) AS relevancia

                FROM produtos p
                INNER JOIN vendedores v ON p.sellerId = v.id

                WHERE (
                    MATCH(p.productName, p.description, p.category) AGAINST(? IN NATURAL LANGUAGE MODE)
                    " . (!empty($where) ? " OR ($where)" : "") . "
                )

                ORDER BY relevancia DESC";


            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $search);
            $stmt->bindValue(2, $search);

            $stmt->execute();

            return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\Product") ?: null;
        }


        public function update(Product $model) : ?bool{
            $sql = "SELECT id from lembretes WHERE id = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $model->getId());
            $stmt->execute();
            $existe = $stmt->fetchColumn();

            if(!$existe){
                return false;
            }
            
            $sql = "UPDATE lembretes SET titulo = ?, descricao = ?, tipo = ?, delay = ?, horario = ?, inicio = ? WHERE id = ?";
            $stmt = parent::$conexao->prepare($sql);
            // $stmt->bindValue(1, $model->getTitulo());
            // $stmt->bindValue(2, $model->getDescricao());
            // $stmt->bindValue(3, $model->getTipo());
            // $stmt->bindValue(4, $model->getDelay());
            // $stmt->bindValue(5, $model->getHorario());
            // $stmt->bindValue(6, $model->getInicio());
            // $stmt->bindValue(7, $model->getId());
            $stmt->execute();       
            
            return true;
        }

        
        public function delete(int $id) : bool {
            $sql = "SELECT id from lembretes WHERE id = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $id);
            $stmt->execute();
            $existe = $stmt->fetchColumn();

            if(!$existe){
                return false;
            }

            $sql = "DELETE FROM lembretes WHERE id = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $id);
            return $stmt->execute();
        }
    }
?>