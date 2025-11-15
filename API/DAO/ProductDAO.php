<?php
    namespace DAO;

    use DAO\DAO;
use DateTime;
use Exception;
use Model\Product;
use PDOException;

class ProductDAO extends DAO{
    public function __construct()
    {
        parent::__construct();
    }        

    public function insert(Product $model): bool
    {
        try {
            $publicId = 

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
            
            $numeroFormatado = str_pad($lastProductId, 7, '0', STR_PAD_LEFT);
            $publicId = "VDNVW-" . $numeroFormatado;
            $stmt2 = parent::$conexao->prepare("UPDATE produtos SET public_id = ? WHERE id = ?");
            $stmt2->execute([$publicId, $lastProductId]);

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

    public function getBeLike($search, $colors = [], $sizes = [], $genders = [], $conditions = [], $categorias = [], $estilos = [])
    {
        $search = trim($search);
        if ($search === '') return [];

        // Validação e sanitização de arrays
        $colors      = is_array($colors) ? array_filter($colors) : [];
        $sizes       = is_array($sizes) ? array_filter($sizes) : [];
        $genders     = is_array($genders) ? array_filter($genders) : [];
        $conditions  = is_array($conditions) ? array_filter($conditions) : [];
        $categorias  = is_array($categorias) ? array_filter($categorias) : [];
        $estilos     = is_array($estilos) ? array_filter($estilos) : [];

        // Função de normalização otimizada
        $normalize = function ($str) {
            $str = mb_strtolower($str, 'UTF-8');
            $map = [
                'á' => 'a', 'à' => 'a', 'ã' => 'a', 'â' => 'a', 'ä' => 'a',
                'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
                'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
                'ó' => 'o', 'ò' => 'o', 'õ' => 'o', 'ô' => 'o', 'ö' => 'o',
                'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
                'ç' => 'c', 'ñ' => 'n'
            ];
            return strtr($str, $map);
        };

        $searchNorm = $normalize($search);
        $like = "%$searchNorm%";
        
        // Dividir busca em palavras individuais para melhor precisão
        $searchTerms = array_filter(explode(' ', $searchNorm));
        
        $where = [];
        $params = [];

        // Busca textual otimizada com palavras individuais
        $textSearchConditions = [];
        foreach ($searchTerms as $term) {
            $termLike = "%$term%";
            $textSearchConditions[] = "(
                LOWER(produto.productName) LIKE ? OR
                LOWER(produto.brand) LIKE ? OR
                LOWER(produto.category) LIKE ? OR
                LOWER(produto.subCategory) LIKE ? OR
                LOWER(produto.style) LIKE ? OR
                LOWER(produto.description) LIKE ?
            )";
            $params = array_merge($params, array_fill(0, 6, $termLike));
        }
        
        // SOUNDEX apenas para busca completa
        $textSearchConditions[] = "(
            SOUNDEX(produto.productName) = SOUNDEX(?) OR
            SOUNDEX(produto.brand) = SOUNDEX(?)
        )";
        $params = array_merge($params, [$searchNorm, $searchNorm]);
        
        $where[] = '(' . implode(' OR ', $textSearchConditions) . ')';

        // Filtros opcionais otimizados
        $optionalFilters = [
            'produto.gender'      => $genders,
            'produto.`condition`' => $conditions,
            'produto.category'    => $categorias,
            'produto.style'       => $estilos,
            'pi.cor'              => $colors,
            'pv.tamanho'          => $sizes,
        ];

        foreach ($optionalFilters as $field => $values) {
            if (!empty($values)) {
                $placeholders = implode(',', array_fill(0, count($values), '?'));
                $where[] = "$field IN ($placeholders)";
                $params = array_merge($params, $values);
            }
        }

        // Sistema de relevância melhorado
        $relevanceCases = [];
        
        // Peso maior para correspondência exata
        $relevanceCases[] = "(CASE WHEN LOWER(produto.productName) = ? THEN 20 ELSE 0 END)";
        $params[] = $searchNorm;
        
        // Peso para correspondências parciais em cada palavra
        foreach ($searchTerms as $term) {
            $termLike = "%$term%";
            $relevanceCases[] = "(CASE WHEN LOWER(produto.productName) LIKE ? THEN 10 ELSE 0 END)";
            $relevanceCases[] = "(CASE WHEN LOWER(produto.brand) LIKE ? THEN 8 ELSE 0 END)";
            $relevanceCases[] = "(CASE WHEN LOWER(produto.category) LIKE ? THEN 6 ELSE 0 END)";
            $relevanceCases[] = "(CASE WHEN LOWER(produto.subCategory) LIKE ? THEN 5 ELSE 0 END)";
            $relevanceCases[] = "(CASE WHEN LOWER(produto.style) LIKE ? THEN 4 ELSE 0 END)";
            $params = array_merge($params, [$termLike, $termLike, $termLike, $termLike, $termLike]);
        }
        
        // Descrição com peso menor
        $relevanceCases[] = "(CASE WHEN LOWER(produto.description) LIKE ? THEN 2 ELSE 0 END)";
        $params[] = $like;
        
        // SOUNDEX com peso médio
        $relevanceCases[] = "(CASE WHEN SOUNDEX(produto.productName) = SOUNDEX(?) THEN 7 ELSE 0 END)";
        $relevanceCases[] = "(CASE WHEN SOUNDEX(produto.brand) = SOUNDEX(?) THEN 5 ELSE 0 END)";
        $params = array_merge($params, [$searchNorm, $searchNorm]);

        // Query otimizada com índices sugeridos
        $sql = "SELECT 
                    produto.id,
                    produto.sellerId,
                    produto.productName,
                    produto.category,
                    produto.subCategory,
                    produto.style,
                    produto.brand,
                    produto.gender,
                    produto.`condition`,
                    produto.description,
                    produto.price,
                    produto.shippingCost,
                    produto.salesQuantity,
                    produto.promotionPrice,
                    produto.deliveryTime,
                    produto.promotionStartDate,
                    produto.promotionEndDate,
                    produto.images,
                    pessoa.profile_photo,
                    v.store_name,
                    v.url,
                    pi.cor,
                    pi.stock_cor,
                    pv.tamanho,
                    pv.quantity,
                    (" . implode(' + ', $relevanceCases) . ") AS relevance
                FROM produtos produto
                INNER JOIN vendedores v ON v.id = produto.sellerId
                INNER JOIN pessoas pessoa ON pessoa.id = v.id_pessoa
                LEFT JOIN produtos_itens pi ON pi.id_produto = produto.id
                LEFT JOIN produtos_variacoes pv ON pv.id_item = pi.id
                WHERE " . implode(' AND ', $where) . "
                ORDER BY relevance DESC, produto.salesQuantity DESC, produto.id DESC";

        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(DAO::FETCH_ASSOC);

        if (!$rows) return [];

        // Agrupamento otimizado com referências
        $produtos = [];
        foreach ($rows as $row) {
            $pid = $row['id'];
            
            if (!isset($produtos[$pid])) {
                $produto = new \Model\Product();
                $produto->setId($pid);
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
                $produto->setImages(!empty($row['images']) ? json_decode($row['images'], true) : null);
                $produto->profile_photo = $row['profile_photo'] ?? null;
                $produto->store_name = $row['store_name'] ?? null;
                $produto->setItenStock([], true);
                
                $produtos[$pid] = $produto;
            }

            // Otimização: verificar se há cor antes de processar
            if (!empty($row['cor'])) {
                $produto = &$produtos[$pid];
                $itenStock = $produto->getItenStock();
                
                $corIndex = null;
                foreach ($itenStock as $index => $corItem) {
                    if ($corItem['cor'] === $row['cor']) {
                        $corIndex = $index;
                        break;
                    }
                }
                
                if ($corIndex !== null) {
                    $itenStock[$corIndex]['tamanhos'][] = [
                        'tamanho' => $row['tamanho'],
                        'qnt' => (int)$row['quantity'],
                    ];
                } else {
                    $itenStock[] = [
                        'cor' => $row['cor'],
                        'tamanhos' => [
                            [
                                'tamanho' => $row['tamanho'],
                                'qnt' => (int)$row['quantity'],
                            ]
                        ],
                        'stockTotalColor' => (int)$row['stock_cor']
                    ];
                }
                
                $produto->setItenStock($itenStock, true);
            }
        }

        return array_values($produtos);
    }
   
    public function delete(int $id) : bool {
        try{
            parent::$conexao->beginTransaction();
            $sql = "SELECT id FROM produtos_itens WHERE id_produto = ?"; 
            $stmt= parent::$conexao->prepare($sql);
            $stmt->execute([$id]);
            $idItens = $stmt->fetchAll(DAO::FETCH_COLUMN);

            
            if(!empty($idItens)){
                $placeholders = implode(',', array_fill(0, count($idItens), '?'));
                $sql = "DELETE FROM produtos_variacoes WHERE id_item IN($placeholders)";
                $stmt = parent::$conexao->prepare($sql);
                // $stmt->bindValue(1, $id);
                $stmt->execute($idItens);
            }

            $sql = "DELETE FROM produtos_itens WHERE id_produto = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$id]);

            $sql = "DELETE FROM produtos WHERE id = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$id]);

            parent::$conexao->commit();
            return true;
            
        }catch(PDOException $e){
            parent::$conexao->rollBack();
            echo "Erro ao excluir produto: " . $e->getMessage();
            return false;    
        }
    }

    public function getPromotionDay(){
        $date = new DateTime('now');
        
        $sql = "SELECT * FROM produtos WHERE promotionStartDate = ? ORDER BY promotionPrice ASC LIMIT 15";
        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute([$date->format('Y-m-d')]);
        return $stmt->fetchAll(DAO::FETCH_CLASS, "Model\Product");
    }

    public function getBySellerId( $seller_id){

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