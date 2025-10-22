<?php 
    namespace DAO;

    use DAO\DAO;
use Model\Pessoa;

    // use Model\Pessoa;

    class PessoasDAO extends DAO{

        public function getAccountData(int $id) : ?Pessoa{
            $sql = "SELECT p.id, p.email, p.name, p.first_name, p.last_name, p.username, p.cpf, p.telefone, p.profile_photo, v.`url`, p.cep, p.nivel_acesso, p.rua, p.bairro, p.cidade, p.uf, p.cep, p.num_residencia, p.complemento, p.address, v.id AS seller_id
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
                return $stmt->execute([$lastIdUser, $pessoa->getStoreName(), $pessoa->getCnpj(), $pessoa->getOpenHours(), $pessoa->getCloseHours(), $pessoa->getUrl()]);
            }else{
                $sql = "INSERT INTO usuarios (id_pessoa) VALUES(?)";
                $stmt = parent::$conexao->prepare($sql);
                return $stmt->execute([$lastIdUser]);
            }
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
                        p.id, p.images, p.availableColors, p.productName, p.price, 
                        p.promotionPrice, p.shippingCost, p.category, p.subCategory, `condition`, p.stockTotal,
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

            return $stmt->fetchAll(DAO::FETCH_CLASS, 'Model\Product');
        }


        public function profileUpdate(Pessoa $pessoa) : bool{
            $sql = "UPDATE pessoas SET 
                    profile_photo = ?, 
                    name = ?,
                    first_name = ?, 
                    last_name = ?, 
                    username = ?, 
                    store_name = ?,
                    url = ?
                    WHERE id = ?";

            $stmt = parent::$conexao->prepare($sql);

            $stmt->execute([
                $pessoa->getProfilePhoto(),
                $pessoa->getName(),          // name
                $pessoa->getFirstName(),     // first_name
                $pessoa->getLastName(),      // last_name
                $pessoa->getUserName(), 
                $pessoa->getStoreName(), 
                $pessoa->getUrl(),
                $pessoa->getId(),
            ]);

            // if ($stmt->rowCount() > 0) {
                $stmt = parent::$conexao->prepare("SELECT * FROM pessoas WHERE id = ?");
                $stmt->execute([$pessoa->getId()]);
                $pessoaAtualizada = $stmt->fetchObject("Model\Pessoa");

                if($pessoaAtualizada){
                    $pessoaAtualizada->createCookie($pessoaAtualizada);
                    return true;
                }
            // }
            return false;
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

        public function existsCPF(string $cpf) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE cpf = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$cpf]);
            return $stmt->fetchColumn() > 0;
        }

        public function existsCnpj(string $cnpj) : bool{
            $sql = "SELECT COUNT(*) FROM vendedores WHERE cnpj = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$cnpj]);
            return $stmt->fetchColumn() > 0;
        }

        
        public function existsEmail(string $email) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE email = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$email]);
            return $stmt->fetchColumn() > 0;
        }

            
        public function existsTelefone(string $telefone) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE telefone = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$telefone]);
            return $stmt->fetchColumn() > 0;
        }

    }
?>