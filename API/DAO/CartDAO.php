<?php
    namespace DAO;

    use DAO\DAO;
    use Model\Cart;
use Model\Product;

    class CartDAO extends DAO{
        public function __construct()
        {
            parent::__construct();
        }

        // public function createCart(Cart $item) : bool{
        //     $sql = "INSERT INTO carrinhos (userId) VALUES(?)";
        //     $stmt = parent::$conexao->prepare($sql);
        //     $stmt->bindValue(1, $item->getUserId());
        //     return $stmt -> execute();
        // }

        public function getByUserId(int $userId) : ?int{
            $sql = "SELECT id FROM carrinhos WHERE userId = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $userId);
            $stmt -> execute();
            
            $result = $stmt->fetchColumn();
            return $result ?: false;
        }

        public function selectAll(array $array) : ?array{
            if(empty($array)){
                return null;
            }

            $placeholders = implode(',', array_fill(0, count($array), '?'));
            $sql = "SELECT produto.*,
                            pessoa.profile_photo,
                            v.store_name,
                            pi.cor,
                            pi.stock_cor,
                            pv.tamanho,
                            pv.quantity,
                            v.url
                    FROM produtos produto
                    INNER JOIN vendedores v ON v.id = produto.sellerId
                    INNER JOIN pessoas pessoa ON pessoa.id = v.id_pessoa
                    LEFT JOIN produtos_itens pi ON pi.id_produto = produto.id
                    LEFT JOIN produtos_variacoes pv ON pv.id_item = pi.id
                    WHERE produto.id IN ($placeholders)
                    ORDER BY FIELD(produto.id, $placeholders)";

            $stmt = parent::$conexao->prepare($sql);

            $i = 1;
            foreach ($array as $id) {
                $stmt->bindValue($i++, $id, DAO::PARAM_INT);
            }
            foreach ($array as $id) {
                $stmt->bindValue($i++, $id, DAO::PARAM_INT);
            }
            
            $stmt->execute();
            $rows = $stmt->fetchAll(DAO::FETCH_ASSOC);

            // Agrupar produtos (no caso de array de ids)
            $produtos = [];
            foreach ($rows as $row) {
                $pid = $row['id'];
                if (!isset($produtos[$pid])) {
                    $produto = new \Model\Product();
                    $produto->setId($row['id']);
                    $produto->setSellerId($row['sellerId']);
                    $produto->setSellerUrl($row['url']);
                    $produto->setProductName($row['productName']);
                    $produto->setCategory($row['category']);
                    $produto->setSubCategory($row['subCategory']);
                    $produto->setStyle($row['style']);
                    $produto->setBrand($row['brand']);
                    $produto->setGender($row['gender']);
                    $produto->setCondition($row['condition']);
                    $produto->setDescription($row['description']);
                    $produto->setPrice($row['price']);
                    $produto->setShippingCost($row['shippingCost']);
                    $produto->setSalesQuantity($row['salesQuantity']);
                    $produto->setPromotionPrice($row['promotionPrice']);
                    $produto->setDeliveryTime($row['deliveryTime']);
                    $produto->setPromotionStartDate($row['promotionStartDate']);
                    $produto->setPromotionEndDate($row['promotionEndDate']);
                    $produto->setImages(!empty($row['images']) ? json_decode($row['images']) : null);
                    $produto->profile_photo = $row['profile_photo'] ?? null;
                    $produto->store_name = $row['store_name'] ?? null;
                    // $produto->setItenStock([]);
                    $produtos[$pid] = $produto;
                }

                // Adicionar cores e tamanhos ao itenStock
                $produto = $produtos[$pid];
                $itenStock = $produto->getItenStock();

                if (!empty($row['cor'])) {
                    $corExistente = false;
                    foreach ($itenStock as &$corItem) {
                        if ($corItem['cor'] === $row['cor']) {
                            $corItem['tamanhos'][] = [
                                'tamanho' => $row['tamanho'],
                                'qnt' => $row['quantity'],
                            ];
                            $corExistente = true;
                            break;
                        }
                    }
                    if (!$corExistente) {
                        $itenStock[] = [
                            'cor' => $row['cor'],
                            'tamanhos' => [
                                [
                                    'tamanho' => $row['tamanho'],
                                    'qnt' => $row['quantity'],
                                ]
                            ],
                            'stockTotalColor' => $row['stock_cor']
                        ];
                    }
                }

                $produto->setItenStock($itenStock, true);
            }

            return array_values($produtos);
            
        }

        public function selectToShelf(int $user_id) {

            $sql = "SELECT images
                    FROM produtos p
                    INNER JOIN carrinho_itens ci ON ci.productId = p.id
                    INNER JOIN carrinhos c ON c.id = ci.cartId
                    WHERE c.userId = ? LIMIT 4";
                    
            $stmt = parent::$conexao->prepare($sql); 
            $stmt->execute([$user_id]);
            $images = $stmt->fetchAll(DAO::FETCH_ASSOC);

            $imagesArray = [];
            
            foreach($images as $image){
                $imagesArray[] = json_decode($image['images'], true)[0];
            }

            
            return $imagesArray;
        }
    }
?>