<?php
    namespace DAO;

    use DAO\DAO;
use DateTime;
use Exception;
use Model\Product;

class ProductDAO extends DAO{
    public function __construct()
    {
        parent::__construct();
    }        

    public function insert(Product $model): bool
    {
        try {
            parent::$conexao->beginTransaction();

            // 1. Insere produto principal
            $sql = "INSERT INTO produtos (sellerId, productName, category, subCategory, style, brand, gender, `condition`, `description`, price, shippingCost, deliveryTime, images)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([
                $model->getSellerId(),
                $model->getProductName(),
                $model->getCategory(),
                $model->getSubCategory(),
                $model->getStyle(),
                $model->getBrand(),
                $model->getGender(),
                $model->getCondition(),
                $model->getDescription(),
                $model->getPrice(),
                $model->getShippingCost(),
                $model->getDeliveryTime(),
                $model->getImages(),
            ]);

            $lastProductId = parent::$conexao->lastInsertId();
            $model->setId($lastProductId);

            // 2. Insere itens (cores)
            foreach ($model->getItenStock() as $item) {
                $sql = "INSERT INTO produtos_itens (id_produto, cor, stock_cor) VALUES(?, ?, ?)";
                $stmt = parent::$conexao->prepare($sql);
                $stmt->execute([$model->getId(), $item['cor'], $item['stockTotalColor']]);

                $lastItemColorId = parent::$conexao->lastInsertId();

                // 3. Insere tamanhos (variações)
                foreach ($item['tamanhos'] as $tamanho) {
                    $sql = "INSERT INTO produtos_variacoes (id_item, tamanho, quantity) VALUES (?, ?, ?)";
                    $stmt = parent::$conexao->prepare($sql);
                    $stmt->execute([
                        $lastItemColorId,
                        $tamanho['tamanho'],
                        $tamanho['qnt'],
                    ]);
                }
            }

            parent::$conexao->commit();
            return true;

        } catch (Exception $e) {
            parent::$conexao->rollBack();
            throw $e; // ou return false, se preferir silenciar o erro
        }
    }

    public function addPromotion(float $promotion_price, string $start_date, string $end_date, int $product_id): bool{
        $sql = "UPDATE produtos SET promotionPrice = ?, promotionStartDate = ?, promotionEndDate = ? WHERE id = ?";
        $stmt = parent::$conexao->prepare($sql);
        return $stmt->execute([$promotion_price, $start_date, $end_date, $product_id]);
    }

    public function removePromotion(int $product_id):bool{
        $sql = "UPDATE produtos SET promotionPrice = 0.00, promotionStartDate = NULL, promotionEndDate = NULL WHERE id = ?";
        $stmt = parent::$conexao->prepare($sql);
        return $stmt->execute([$product_id]);
    }

    public function update(Product $model): bool{
         try {
            parent::$conexao->beginTransaction();
            $sql = "UPDATE produtos
                    SET
                        productName = ?,
                        category = ?,
                        subCategory = ?,
                        style = ?,
                        brand = ?,
                        gender = ?,
                        `condition` = ?,
                        `description` = ?,
                        price = ?,
                        shippingCost = ?,
                        deliveryTime = ?,
                        images = ?
                    WHERE id = ?";
                    
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([
                $model->getProductName(),
                $model->getCategory(),
                $model->getSubCategory(),
                $model->getStyle(),
                $model->getBrand(),
                $model->getGender(),
                $model->getCondition(),
                $model->getDescription(),
                $model->getPrice(),
                $model->getShippingCost(),
                $model->getDeliveryTime(),
                $model->getImages(),
                $model->getId(),
            ]);

            // 2. Insere itens (cores)
            foreach ($model->getItenStock() as $item) {
                $sql = "UPDATE produtos_itens
                        SET
                            cor = ?,
                            stock_cor = ?
                        WHERE id_produto = ?";
                $stmt = parent::$conexao->prepare($sql);
                $stmt->execute([$item['cor'], $item['stockTotalColor'], $model->getId()]);

                // 2️⃣ Busca o id do item atualizado
                $sqlId = "SELECT id FROM produtos_itens WHERE id_produto = ? LIMIT 1";
                $stmtId = parent::$conexao->prepare($sqlId);
                $stmtId->execute([$model->getId()]);
                $itemColorId = $stmtId->fetchColumn();

                // 3. Insere tamanhos (variações)
                foreach ($item['tamanhos'] as $tamanho) {
                    $sql = "UPDATE produtos_variacoes
                            SET
                                tamanho = ?,
                                quantity = ?
                            WHERE id_item = ?";
                            
                    $stmt = parent::$conexao->prepare($sql);
                    $stmt->execute([
                        $tamanho['tamanho'],
                        $tamanho['qnt'],
                        $itemColorId,
                    ]);
                }
            }

            parent::$conexao->commit();
            return true;

        } catch (Exception $e) {
            parent::$conexao->rollBack();
            throw $e; // ou return false, se preferir silenciar o erro
        }
    }

    public function getById($id) {
        $id = json_decode($id);

        if (is_array($id)) {
            $placeholders = implode(',', array_fill(0, count($id), '?'));
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
                    WHERE produto.id IN ($placeholders)";
        } else {
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
                    WHERE produto.id = ?";
        }

        $stmt = parent::$conexao->prepare($sql);

        if (is_array($id)) {
            $stmt->execute($id);
            $rows = $stmt->fetchAll(DAO::FETCH_ASSOC);
        } else {
            $stmt->execute([$id]);
            $rows = $stmt->fetchAll(DAO::FETCH_ASSOC);
        }

        if (!$rows) return 'Nenum produto encontrado'; // Nenhum produto encontrado

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

        // Se era array de ids, retorna array, senão retorna o produto único
        if (is_array($id)) {
            return array_values($produtos);
        } else {
            return $produtos[$id] ?? 'Error';
        }   
    }
    
    public function selectAll(): array {
        $sql = "SELECT p.*, pi.cor, pi.stock_cor, pv.tamanho, pv.quantity
                FROM produtos p
                INNER JOIN produtos_itens pi ON pi.id_produto = p.id
                INNER JOIN produtos_variacoes pv ON pv.id_item = pi.id";

        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute();

        $rows  = $stmt->fetchAll(DAO::FETCH_ASSOC);

        $produtos = [];

        foreach ($rows as $row) {
            $id = $row['id'];

            // Cria o produto se ainda não existir
            if (!isset($produtos[$id])) {
                $produto = new \Model\Product();
                $produto->setId($row['id']);
                $produto->setSellerId($row['sellerId']);
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
                $produto->setImages($row['images']);

                $produto->itenStock = []; // cria array vazio
                $produtos[$id] = $produto;
            }

            // adiciona cor e tamanho ao produto
            $produto = $produtos[$id];
            $itenStock = &$produto->itenStock; // referência direta

            $corExistente = false;
            foreach ($itenStock as &$corItem) {
                if ($corItem['cor'] === $row['cor']) {
                    $corItem['tamanhos'][] = [
                        "tamanho" => $row['tamanho'],
                        "qnt" => $row['quantity'],
                        "stockTotalColor" => $row['stock_cor']
                    ];
                    $corExistente = true;
                    break;
                }
            }

            if (!$corExistente) {
                $itenStock[] = [
                    "cor" => $row['cor'],
                    "tamanhos" => [
                        [
                            "tamanho" => $row['tamanho'],
                            "qnt" => $row['quantity'],
                            "stockTotalColor" => $row['stock_cor']
                        ]
                    ]
                ];
            }
        }

        // Aplica o itenStock no final
        foreach ($produtos as $produto) {
            $produto->setItenStock($produto->itenStock, true);
        }

        return array_values($produtos);
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

    public function getPromotionDay(){
        $date = new DateTime('now');
        
        $sql = "SELECT * FROM produtos WHERE promotionStartDate = ? ORDER BY promotionPrice ASC LIMIT 15";
        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute([$date->format('Y-m-d')]);
        return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\Product");
    }

    public function getBySellerId(int $seller_id){

        $sql = "SELECT produto.*,
                        pessoa.profile_photo,
                        v.store_name,
                        pi.cor,
                        pv.tamanho,
                        pv.quantity,
                        v.url
                FROM produtos produto
                INNER JOIN vendedores v ON v.id = produto.sellerId
                INNER JOIN pessoas pessoa ON pessoa.id = v.id_pessoa
                LEFT JOIN produtos_itens pi ON pi.id_produto = produto.id
                LEFT JOIN produtos_variacoes pv ON pv.id_item = pi.id
                WHERE sellerId = ?";

        $stmt = parent::$conexao->prepare($sql);

        $stmt->execute([$seller_id]);
        $rows = $stmt->fetchAll(DAO::FETCH_ASSOC);

        if (!$rows) return null; // Nenhum produto encontrado

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
                $produto->setBrand($row['brand']);
                $produto->setGender($row['gender']);
                $produto->setCondition($row['condition']);
                $produto->setDescription($row['description']);
                $produto->setPrice($row['price']);
                $produto->setShippingCost($row['shippingCost']);
                $produto->setSalesQuantity($row['salesQuantity']);
                $produto->setPromotionPrice($row['promotionPrice']);
                $produto->setDeliveryTime($row['deliveryTime']);
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
                            'qnt' => $row['quantity']
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
                                'qnt' => $row['quantity']
                            ]
                        ]
                    ];
                }
            }

            $produto->setItenStock($itenStock, true);
        }

        // Se era array de ids, retorna array, senão retorna o produto único
        return array_values($produtos);
    }


    public function getSimilarItems(string $category, string $subCategory, string $style, int $id_produto){
        $sql = "SELECT p.*, pi.cor, pi.stock_cor, pv.tamanho, pv.quantity
                FROM produtos p
                INNER JOIN produtos_itens pi ON pi.id_produto = p.id
                INNER JOIN produtos_variacoes pv ON pv.id_item = pi.id
                WHERE p.category = ? OR p.subCategory LIKE ? OR p.style LIKE ? AND p.id != ? 
                LIMIT 15";

        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute([$category, "%$subCategory%", "%$style%"]);
        $rows  = $stmt->fetchAll(DAO::FETCH_ASSOC);
        
        $produtos = [];
        foreach ($rows as $row) {
            $id = $row['id'];

            // Cria o produto se ainda não existir
            if (!isset($produtos[$id])) {
                $produto = new \Model\Product();
                $produto->setId($row['id']);
                $produto->setSellerId($row['sellerId']);
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
                $produto->setImages($row['images']);

                $produto->itenStock = []; // cria array vazio
                $produtos[$id] = $produto;
            }

            // adiciona cor e tamanho ao produto
            $produto = $produtos[$id];
            $itenStock = &$produto->itenStock; // referência direta

            $corExistente = false;
            foreach ($itenStock as &$corItem) {
                if ($corItem['cor'] === $row['cor']) {
                    $corItem['tamanhos'][] = [
                        "tamanho" => $row['tamanho'],
                        "qnt" => $row['quantity'],
                        "stockTotalColor" => $row['stock_cor']
                    ];
                    $corExistente = true;
                    break;
                }
            }

            if (!$corExistente) {
                $itenStock[] = [
                    "cor" => $row['cor'],
                    "tamanhos" => [
                        [
                            "tamanho" => $row['tamanho'],
                            "qnt" => $row['quantity'],
                            "stockTotalColor" => $row['stock_cor']
                        ]
                    ]
                ];
            }
        }

        // Aplica o itenStock no final
        foreach ($produtos as $produto) {
            $produto->setItenStock($produto->itenStock, true);
        }

        return array_values($produtos);
    }
}
?>