<?php 

    namespace Model;

    use DAO\PessoasDAO;
    use Exception;
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;
    use DateTime;


    class Pessoa {
        public int $id;
        public string $nivel_acesso;
        public string $name;
        public string $first_name;
        public string $last_name;
        public ?string $username;
        public ?string $store_name;
        public ?string $url;
        public string $profile_photo;
        public ?string $cpf;
        public string $cnpj;
        public ?string $email;
        public ?string $telefone;
        public string $date_birth;
        public ?string $address;
        public ?string $criado_em;
        public string $password;
        public ?string $rua;
        public ?string $bairro;
        public ?string $cidade;
        public ?string $uf;
        public ?string $cep;
        public ?string $num_residencia;
        public bool $active;

        public function __construct()
        {
            $this->address = null;
            $this->rua = null;
            $this->bairro = null;
            $this->cidade = null;
            $this->uf = null;
            $this->cep = null;
            $this->num_residencia = null;
            $this->setCriadoEm();
            $this->setProfilePhoto(null);
        }

        public function login(string $email, string $password): ?Pessoa{
            return ((new PessoasDAO())->login($email, $password));
        }

        public function insert(Pessoa $pessoa) : bool {
            return ((new PessoasDAO())->insert($pessoa));
        }

        public function createCookie(Pessoa $pessoa): bool{        
            $token = JWT::encode([
                'id' => $pessoa->getId(),
                'access' => $pessoa->getNivelAcesso(),
                'name' => $pessoa->getName(),
                'username' => $pessoa->getUserName(),
                'email' => $pessoa->getEmail(),
                'cep' => $pessoa->getCep(),
                'img' => $pessoa->profile_photo,
                'exp' => time() + 3600 // expira em 1 hora
            ], $_ENV['secretKey'], 'HS256');

            setcookie("auth", $token, [
                "expires" => time() + 3600,
                "path" => "/",
                "httponly" => true,
                "samesite" => "Lax",
                "secure" => false // true em produção com HTTPS
            ]);

            return $_COOKIE['auth'] = $token; // agora já existe no request atual
        }

        public function logout(): bool {
            // sobrescreve o cookie expirado, com os mesmos atributos do login

            return setcookie("auth", "", [
                "expires" => time() - 3600,
                "path" => "/",           // MESMO PATH do login
                "httponly" => true,
                "samesite" => "Lax",
                "secure" => false        // MESMO secure do login
            ]);
        }


        // Getters e Setters
        public function getId(): int { return $this->id; }
        public function setId(int $id): void { $this->id = $id; }

        public function getNivelAcesso(): string { return $this->nivel_acesso; }
        public function setNivelAcesso(string $nivel_acesso): void {
            if($nivel_acesso !== 'admin' && $nivel_acesso !== 'usuario' && $nivel_acesso !== 'vendedor'){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'status' => 'Nivel de acesso não reconhecido'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
            }
            
            $this->nivel_acesso = $nivel_acesso; 
        }

        public function getFirstName(): string { return $this->first_name; }
        public function setFirstName(string $first_name): void {
            $first_name = preg_replace('/[0-9\s]/u', '', $first_name);
            $this->first_name = mb_convert_case($first_name, MB_CASE_TITLE, "UTF-8");
        }

        public function getLastName(): string { return $this->last_name; }
        public function setLastName(string $last_name): void {
            $last_name = preg_replace('/[0-9\s]/u', '', $last_name);
            $this->last_name = mb_convert_case($last_name, MB_CASE_TITLE, "UTF-8");
        }

        public function getName(): string { return $this->name; }
        public function setName(): void {
            $this->name = $this->first_name." ".$this->last_name;
        }

        public function getUserName(): ?string { return $this->username; }
        public function setUserName($username): void {
                 
            if(empty($username)){
                $baseUsername = $this->first_name."_".$this->last_name;

                $username = $baseUsername;
                $i = 1;

                $dao = new PessoasDAO();

                while ($dao->existsUsername($username)) {
                    $username = $baseUsername . $i;
                    $i++;
                }

                $this->username = strtolower($username);
            }else{
                if((new PessoasDAO())->existsUsername($username)){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'username',
                        'status' => 'Este nome de usuario já está em uso'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
                }
                $this->username = $username;
            }
        }

        public function getStoreName(): ?string { return $this->store_name; }
        public function setStoreName(?string $store_name): void {
                if(!empty($store_name)){
                    $dao = new PessoasDAO();

                    if($dao->existsStoreName($store_name)){
                        throw new Exception(
                            json_encode(
                                ['success' => false,
                                'field' => 'store_name',
                                'status' => 'Este nome de loja já está em uso'],
                                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                        exit;
                    }

                    $store_name = $store_name;
                    
                    $this->setUrl(strtolower($store_name));
                }

                $this->store_name = $store_name;

        }

        public function getUrl(): ?string { return $this->url ?? null; }
        public function setUrl($store_name): void {
                if($store_name){
                    $url = str_replace(["/", " ", "?", "&"], "_", $store_name);
                }

                $this->url =  $url;

        }

        public function getProfilePhoto(): string { return $this->profile_photo; }
        public function setProfilePhoto(?string $profile_photo):void{
            if(empty($profile_photo)){
                $this->profile_photo = $profile_photo ?? 'http://localhost/tcc/API/UPLOADS/profilePhotos/imgPadrao.png';
            }else{
                $this->profile_photo = $profile_photo ?? $profile_photo;
            }
        }

        public function getCpf(): string { return $this->cpf; }
        public function setCpf(string $cpf) {

            $cpf = preg_replace('/\D/', '', $cpf);;

            if(strlen($cpf) < 11 || strlen($cpf) > 11){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'cpf',
                        'status' => 'O CPF deve ter no mínimo 11 digitos e no máximo 11'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
            }

            if((new PessoasDAO())->existsCpf($cpf)){
                throw new Exception(
                     json_encode(
                        ['success' => false,
                        'field' => 'cpf',
                        'status' => 'Este cpf já está em uso'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));;
            }

            $this->cpf = $cpf;
        }

        public function getCnpj(): ?string { return $this->cnpj ?? null; }
        public function setCnpj(string $cnpj) {

            $cnpj = preg_replace('/\D/', '', $cnpj);;

            if(strlen($cnpj) < 14 || strlen($cnpj) > 14){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'cnpj',
                        'status' => 'O CNPJ deve ter no mínimo 14 digitos e no máximo 14'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
            }

            if((new PessoasDAO())->existsCnpj($cnpj)){
                throw new Exception(
                     json_encode(
                        ['success' => false,
                        'field' => 'cnpj',
                        'status' => 'Este CNPJ já está em uso'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));;
            }

            $this->cnpj = $cnpj;
        }

        public function getEmail(): ?string { return $this->email; }
        public function setEmail(string $email): void {
            if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'email',
                        'status' => 'Email inválido'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
            }

            if((new PessoasDAO())->existsEmail($email)){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'email',
                        'status' => 'Este email já está em uso'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
            }
            
            $this->email = $email; 
        }

        public function getTelefone(): ?string { return $this->telefone; }
        public function setTelefone(?string $telefone): void {
            if(!empty($telefone)){
                $telefone = preg_replace('/\D/', '', $telefone);;
                
                if((new PessoasDAO())->existsTelefone($telefone)){
                    throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'telefone',
                            'status' => 'Este telefone já está em uso'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        )
                    );
                }

                if(strlen($telefone) < 11 || strlen($telefone) > 11){
                    throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'telefone',
                            'status' => 'O telefone deve ter no minimo 11 digitos e no máximo 11'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
                }
            }
            
            $this->telefone = $telefone;
        }

        public function getDateBirth(): string { return $this->date_birth; }
        public function setDateBirth(string $date_birth): void {
            $atualDate = new DateTime();
            $formatedBirth = DateTime::createFromFormat('Y-m-d', $date_birth);

            if(!$formatedBirth || $formatedBirth->format('Y-m-d') !== $date_birth){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'date_birth',
                        'status' => 'Formato de data inválido'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    )
                );
            }else if($atualDate < $formatedBirth){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'date_birth',
                        'status' => 'Data inválida'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    )
                );
            }else if(($formatedBirth->diff($atualDate)->y) < 18){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'date_birth',
                        'status' => 'Você precisa ser maior de idade'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    )
                ); 
            }       

            $this->date_birth = $date_birth;
        }

        public function getAddress(): ?string { return $this->address; }
        public function setAddress(?string $address): void { $this->address = $address; }

        public function getCriadoEm(): ?string { return $this->criado_em; }
        public function setCriadoEm(): void {
            $this->criado_em = (new DateTime())->format('Y-m-d H:i:s');
        }

        public function getPassword(): string { return $this->password; }
        public function setPassword(string $password): void {
            // 1. Tamanho
            if (strlen($password) < 6 || strlen($password) > 12) {
                throw new Exception(json_encode(
                    [
                        'success' => false,
                        'field'   => 'password',
                        'status'  => 'Sua senha deve ter entre 6 e 12 caracteres'
                    ],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            // 2. Letra minúscula
            if (!preg_match('/[a-z]/', $password)) {
                throw new Exception(json_encode(
                    [
                        'success' => false,
                        'field'   => 'password',
                        'status'  => 'Sua senha deve conter pelo menos 1 letra minúscula'
                    ],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            // 3. Letra maiúscula
            if (!preg_match('/[A-Z]/', $password)) {
                throw new Exception(json_encode(
                    [
                        'success' => false,
                        'field'   => 'password',
                        'status'  => 'Sua senha deve conter pelo menos 1 letra maiúscula'
                    ],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            // 4. Número
            if (!preg_match('/[0-9]/', $password)) {
                throw new Exception(json_encode(
                    [
                        'success' => false,
                        'field'   => 'password',
                        'status'  => 'Sua senha deve conter pelo menos 1 número'
                    ],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            // 5. Caractere especial
            if (!preg_match('/[\W_]/', $password)) { // \W pega não-alfanumérico, incluindo símbolos
                throw new Exception(json_encode(
                    [
                        'success' => false,
                        'field'   => 'password',
                        'status'  => 'Sua senha deve conter pelo menos 1 caractere especial'
                    ],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            $this->password = $password;
        }

        public function getRua(): ?string { return $this->rua; }
        public function setRua(string $rua): void { $this->rua = $rua; }

        public function getBairro(): ?string { return $this->bairro; }
        public function setBairro(string $bairro): void { $this->bairro = $bairro; }

        public function getCidade(): ?string { return $this->cidade; }
        public function setCidade(string $cidade): void { $this->cidade = $cidade; }

        public function getUf(): ?string { return $this->uf; }
        public function setUf(string $uf): void { $this->uf = $uf; }

        public function getCep(): ?string { return $this->cep; }
        public function setCep(string $cep): void { $this->cep = $cep; }

        public function getNumResidencia(): ?string { return $this->num_residencia; }
        public function setNumResidencia(string $num_residencia): void { $this->num_residencia = $num_residencia; }

        public function isActive(): bool { return $this->active; }
        public function setActive(bool $active): void { $this->active = $active; }
    }


?>