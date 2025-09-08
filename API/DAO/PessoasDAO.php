<?php 
    namespace DAO;

    use DAO\DAO;
use Model\Pessoa;

    // use Model\Pessoa;

    class PessoasDAO extends DAO{
        
        public function login(string $email, string $password): ?Pessoa{
            $sql = "SELECT id, email, name, first_name, last_name, username, profile_photo, cep, nivel_acesso
                    FROM pessoas 
                    WHERE email = ? AND `password` = SHA1(?)";
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
                store_name,
                url,
                cpf, 
                cnpj,
                email, 
                telefone, 
                date_birth, 
                address, 
                criado_em, 
                password, 
                rua, 
                bairro, 
                cidade, 
                uf, 
                cep, 
                num_residencia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, sha1(?), ?, ?, ?, ?, ?, ?)";

            // $sqlUser = "INSERT INTO usuarios () VALUES()";

             
            $stmt = parent::$conexao->prepare($sql);

            return $stmt->execute([
                $pessoa->getNivelAcesso(),
                $pessoa->getName(),
                $pessoa->getProfilePhoto(),          // name
                $pessoa->getFirstName(),     // first_name
                $pessoa->getLastName(),      // last_name
                $pessoa->getUserName(), 
                $pessoa->getStoreName(), 
                $pessoa->getUrl(),    // username
                $pessoa->getCpf(),     
                $pessoa->getCnpj(),      // cpf
                $pessoa->getEmail(),         // email
                $pessoa->getTelefone(),      // telefone
                $pessoa->getDateBirth(),     // date_birth
                $pessoa->getAddress(),       // address
                $pessoa->getCriadoEm(),      // criado_em
                $pessoa->getPassword(), // password
                $pessoa->getRua(),           // rua
                $pessoa->getBairro(),        // bairro
                $pessoa->getCidade(),        // cidade
                $pessoa->getUf(),            // uf
                $pessoa->getCep(),           // cep
                $pessoa->getNumResidencia()  // num_residencia
            ]);            
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
            $sql = "UPDATE pessoa SET
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

        public function existsStoreName(string $store_name) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE store_name = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$store_name]);
            return $stmt->fetchColumn() > 0;
        }

        public function existsCPF(string $cpf) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE cpf = ?";
            $stmt = parent::$conexao->prepare($sql);
            $stmt->execute([$cpf]);
            return $stmt->fetchColumn() > 0;
        }

        public function existsCnpj(string $cnpj) : bool{
            $sql = "SELECT COUNT(*) FROM pessoas WHERE cnpj = ?";
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