<?php 
    namespace DAO;

    use DAO\DAO;
use Model\Pessoa;

    // use Model\Pessoa;

    class PessoasDAO extends DAO{

        public function getAccountData(int $id) : ?Pessoa{
            $sql = "SELECT p.*, v.`url`, v.id AS seller_id, v.cnpj
                    FROM pessoas p
                    LEFT JOIN vendedores v ON v.id_pessoa = p.id
                    WHERE p.id = ?";

            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$id]);
            return $stmt->fetchObject("Model\Pessoa");
        }
        
        public function login(string $email, string $password): ?Pessoa{
            $sql = "SELECT p.*, v.id AS seller_id, v.url
                    FROM pessoas p
                    LEFT JOIN vendedores v ON v.id_pessoa = p.id
                    WHERE p.email = ? AND p.`password` = SHA1(?)";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->bindValue(1, $email);
            $stmt->bindValue(2, $password);
            $stmt->execute();
            
            $pessoa = $stmt->fetchObject("Model\Pessoa");

            if($pessoa){
                return $pessoa;
            }else{
                return null;
            }

        }

        public function insert(Pessoa $pessoa) : bool{
            $sql = "INSERT INTO pessoas (
                nivel_acesso, 
                name, 
                profile_photo, 
                first_name, 
                last_name, 
                username, 
                cpf, 
                email, 
                telefone, 
                date_birth, 
                criado_em, 
                `agreement`,
                password
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, sha1(?))";
             
            $stmt = parent::$conexao->prepare($sql);

            $stmt->execute([
                $pessoa->getNivelAcesso(),
                $pessoa->getName(),
                $pessoa->getProfilePhoto(),          // name
                $pessoa->getFirstName(),     // first_name
                $pessoa->getLastName(),      // last_name
                $pessoa->getUserName(), 
                $pessoa->getCpf(),     
                $pessoa->getEmail(),         // email
                $pessoa->getTelefone(),      // telefone
                $pessoa->getDateBirth(),     // date_birth
                $pessoa->getCriadoEm(),    
                $pessoa->getCheckAgreement(),  // criado_em
                $pessoa->getPassword(), // password
            ]);   

            $lastIdUser = parent::$conexao->lastInsertId();
            
            if($pessoa->getNivelAcesso() === 'vendedor'){
                $sql = "INSERT INTO vendedores (id_pessoa, store_name, cnpj, open_hours, close_hours, `url`) VALUES(?, ?, ?, ?, ?, ?)";
                $stmt = parent::$conexao->prepare($sql);
                $stmt->execute([$lastIdUser, $pessoa->getStoreName(), $pessoa->getCnpj(), $pessoa->getOpenHours(), $pessoa->getCloseHours(), $pessoa->getUrl()]);
            }else{
                $sql = "INSERT INTO usuarios (id_pessoa) VALUES(?)";
                $stmt = parent::$conexao->prepare($sql);
                $stmt->execute([$lastIdUser]);
            }

            $stmt = parent::$conexao->prepare("INSERT INTO carrinhos (userId) VALUES(?)");
            return $stmt->execute([$lastIdUser]);
        }

        public function update(Pessoa $pessoa) : bool{
            

            $sql = "UPDATE pessoas SET
                
                cpf = ?, 
                cnpj = ?,
                email = ?, 
                telefone = ?, 
                date_birth = ?, 
                
            WHERE id = ?";  
             
            $stmt = parent::$conexao->prepare($sql);

            return $stmt->execute([
                  // username
                $pessoa->getCpf(),     
                $pessoa->getCnpj(),      // cpf
                $pessoa->getEmail(),         // email
                $pessoa->getTelefone(),      // telefone
                $pessoa->getDateBirth(),     // date_birth
                
            ]);            
        }

        public function preferenceProducts(int $user_id)
        {
            // Função auxiliar para gerar placeholders (?,?,?)
            $placeholders = fn(array $array) => count($array)
                ? implode(',', array_fill(0, count($array), '?'))
                : 'NULL';

            // 1️⃣ Buscar IDs de produtos visualizados pelo usuário
            $sql = "SELECT produto_id FROM historico WHERE user_id = ? LIMIT 25";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$user_id]);

            $idsAssoc = $stmt->fetchAll(DAO::FETCH_ASSOC);
            $ids = array_column($idsAssoc, 'produto_id');

            if (empty($ids)) {
                return [];
            }

            // 2️⃣ Buscar categorias e subcategorias dos produtos históricos
            $sql = "SELECT 
                        GROUP_CONCAT(DISTINCT category) AS categories,
                        GROUP_CONCAT(DISTINCT subCategory) AS subCategories
                    FROM produtos 
                    WHERE id IN (" . $placeholders($ids) . ")";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute($ids);
            $data = $stmt->fetch(DAO::FETCH_ASSOC);

            $categories = array_filter(array_unique(explode(',', $data['categories'] ?? '')));
            $subCategories = array_filter(array_unique(explode(',', $data['subCategories'] ?? '')));

            if (empty($categories) && empty($subCategories)) {
                return [];
            }

            // 3️⃣ Buscar até 15 produtos por categoria correspondente
            // usando ROW_NUMBER() (MySQL 8+)
            $sql = "
                SELECT * FROM (
                    SELECT 
                        p.id, p.images, p.productName, p.price, 
                        p.promotionPrice, promotionStartDate, promotionEndDate, p.shippingCost, p.category, p.subCategory, `condition`, p.stockTotal, p.sellerId, p.brand, style, gender, description,
                        (
                            (p.category IN (" . $placeholders($categories) . ")) +
                            (p.subCategory IN (" . $placeholders($subCategories) . "))
                        ) AS compatibility,
                        ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY 
                            ((p.category IN (" . $placeholders($categories) . ")) +
                            (p.subCategory IN (" . $placeholders($subCategories) . "))
                            ) DESC
                        ) AS row_num
                    FROM produtos p
                    WHERE 
                        (p.category IN (" . $placeholders($categories) . "))
                        OR (p.subCategory IN (" . $placeholders($subCategories) . "))
                ) ranked
                WHERE ranked.row_num <= 10
                ORDER BY ranked.compatibility DESC, ranked.category
            ";

            // Montar parâmetros
            $params = array_merge(
                $categories, $subCategories, // para compatibilidade
                $categories, $subCategories, // para ORDER BY
                $categories, $subCategories  // para WHERE
            );

            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll(DAO::FETCH_ASSOC);

            // Agrupar produtos (no caso de array de ids)
            $produtos = [];
            foreach ($rows as $row) {
                $pid = $row['id'];
                if (!isset($produtos[$pid])) {
                    $produto = new \Model\Product();
                    $produto->setId($row['id']);
                    $produto->setSellerId($row['sellerId']);
                    // $produto->setSellerUrl($row['url']);
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
                    // $produto->setSalesQuantity($row['salesQuantity']);
                    $produto->setPromotionPrice($row['promotionPrice']);
                    // $produto->setDeliveryTime($row['deliveryTime']);
                    $produto->setPromotionStartDate($row['promotionStartDate']);
                    $produto->setPromotionEndDate($row['promotionEndDate']);
                    $produto->setImages(!empty($row['images']) ? json_decode($row['images']) : null);
               
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

        public function profileUpdate(Pessoa $pessoa) : bool{
            $sql = "UPDATE pessoas SET 
                    profile_photo = ?, 
                    name = ?,
                    first_name = ?, 
                    last_name = ?, 
                    username = ?
                    WHERE id = ?";

            $stmt = parent::$conexao->prepare($sql);

            $stmt->execute([
                $pessoa->getProfilePhoto(),
                $pessoa->getName(),          // name
                $pessoa->getFirstName(),     // first_name
                $pessoa->getLastName(),      // last_name
                $pessoa->getUserName(), 
                $pessoa->getId(),
            ]);

            // if ($stmt->rowCount() > 0) {
                // $stmt = parent::$conexao->prepare("SELECT * FROM pessoas WHERE id = ?");
                // $stmt->execute([$pessoa->getId()]);
                // $pessoaAtualizada = $stmt->fetchObject("Model\Pessoa");

                // if($pessoaAtualizada){
                //     $pessoaAtualizada->createCookie($pessoaAtualizada);
                //     return true;
                // }
            // }
            return true;
        }

        public function personalInfoUpdate(Pessoa $pessoa):bool{
            $sql = "UPDATE pessoas SET cpf = ?, email = ?, date_birth = ?, telefone = ? WHERE id = ?";

            $stmt = parent::$conexao->prepare($sql);
            return $stmt->execute([$pessoa->getCpf(), $pessoa->getEmail(), $pessoa->getDateBirth(), $pessoa->getTelefone(), $pessoa->getId()]);
        }

        public function addressUpdate(Pessoa $pessoa) : bool{
            $sql = "UPDATE pessoas SET
                    address = ?, 
                    rua = ?, 
                    bairro = ?, 
                    cidade = ?, 
                    uf = ?, 
                    cep = ?, 
                    num_residencia = ?
                    WHERE id = ?";

            $stmt = parent::$conexao->prepare($sql);

            return $stmt->execute([
                $pessoa->getAddress(),       // address
                $pessoa->getRua(),           // rua
                $pessoa->getBairro(),        // bairro
                $pessoa->getCidade(),        // cidade
                $pessoa->getUf(),            // uf
                $pessoa->getCep(),           // cep
                $pessoa->getNumResidencia(),  // num_residencia
                $pessoa->getId(),
            ]);
        }

        public function updatePassword(string $password, int $id): bool{
            $sql = "UPDATE pessoas SET `password` = SHA1(?) WHERE id = ?";
            $stmt = parent::$conexao->prepare($sql);
            return $stmt->execute([$password, $id]);
        }
        
        public function updateCnpj(string $cnpj, int $id): bool{
            $sql = "UPDATE vendedores SET cnpj = ? WHERE id_pessoa = ?";
            $stmt = parent::$conexao->prepare($sql);
            return $stmt->execute([$cnpj, $id]);
        }

        public function existsUsername(string $username, int $id) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE username = ? AND id != ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$username, $id]);
            return $stmt->fetchColumn() > 0;
        }

        public function existsStoreName(string $store_name, int $id = 0) : bool{
            $sql = "SELECT COUNT(*) FROM vendedores WHERE store_name = ? AND id_pessoa != ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$store_name, $id]);
            return $stmt->fetchColumn() > 0;
        }

        public function existsCPF(string $cpf, int $id = 0) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE cpf = ? AND id != ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$cpf, $id]);
            return $stmt->fetchColumn() > 0;
        }

        public function existsCnpj(string $cnpj) : bool{
            $sql = "SELECT COUNT(*) FROM vendedores WHERE cnpj = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$cnpj]);
            return $stmt->fetchColumn() > 0;
        }

        
        public function existsEmail(string $email, int $id = 0) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE email = ? AND id != ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$email, $id]);
            return $stmt->fetchColumn() > 0;
        }

            
        public function existsTelefone(string $telefone, int $id = 0) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE telefone = ? AND id != ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$telefone, $id]);
            return $stmt->fetchColumn() > 0;
        }

    }
?>