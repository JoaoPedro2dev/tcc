<?php 

namespace Model;

use DAO\PessoasDAO;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use DateTime;


class Pessoa {
    public int $id;
    public ?int $seller_id;
    public string $nivel_acesso;
    public string $name;
    public string $first_name;
    public string $last_name;
    public ?string $username;
    public ?string $store_name;
    public ?string $url;
    public ?string $profile_photo;
    public ?string $cpf;
    public ?string $cnpj;
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
    public ?string $complemento;
    public ?bool $active;
    
    public string $open_hours;
    public string $close_hours;

    public string $agreement;

    public function __construct()
    {
        $this->setCriadoEm();
    }

    public function getAccountData(int $id) : ?Pessoa{
        return ((new PessoasDAO())->getAccountData($id));
    }

    public function preferenceProducts(int $user_id){
        return ((new PessoasDAO())->preferenceProducts($user_id));
    }

    public function login(string $email, string $password): ?Pessoa{
        return ((new PessoasDAO())->login($email, $password));
    }

    public function insert(Pessoa $pessoa) : bool {
        return ((new PessoasDAO())->insert($pessoa));
    }

    public function profileUpdate(Pessoa $pessoa) : bool{
        return ((new PessoasDAO())->profileUpdate($pessoa));   
    }

    public function personalInfoUpdate(Pessoa $pessoa):bool{
        return ((new PessoasDAO())->personalInfoUpdate($pessoa));
    }

    public function updatePassword(string $password, int $id): bool{
        return ((new PessoasDAO())->updatePassword($password, $id));
    }

    public function updateCnpj(string $cnpj, int $id): bool{
        return ((new PessoasDAO())->updateCnpj($cnpj, $id));
    }

    public function createCookie(Pessoa $pessoa): bool{        
        $token = JWT::encode([
            'id' => $pessoa->getId(),
            'seller_id'=> $pessoa->getSellerId(),
            'nivel_acesso' => $pessoa->getNivelAcesso(),
            'url' => $pessoa->getUrl() ,
            'firstName' => $pessoa->getFirstName(),
            'lastName' => $pessoa->getLastName(),
            'name' => $pessoa->getName(),
            'cpf' => $pessoa->getCpf(),
            'username' => $pessoa->getUserName(),
            'data_aniversario' => $pessoa->getDateBirth(),
            'telefone'=> $pessoa->getTelefone(),
            'email' => $pessoa->getEmail(),
            'cep' => $pessoa->getCep(),
            'endereco' => $pessoa->getCep() ? ($pessoa->getRua().', '.$pessoa->getNumResidencia().' - '.$pessoa->getBairro().', '.$pessoa->getCidade().' - '.$pessoa->getUf().', '.$pessoa->getCep()) : 'Error 1',
            'profile_photo' => $pessoa->getProfilePhoto(),
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

    public function getSellerId(): ?int { return $this->seller_id; }
    public function setSellerId(int $seller_id): void { $this->seller_id = $seller_id; }

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

    public function setUserName(?string $username, ?int $id = 0): void
    {
        $dao = new PessoasDAO();

        // Caso não informe username, gerar automaticamente
        if (empty($username)) {
            $base = strtolower($this->sanitizeUserName(
                $this->first_name . "_" . $this->last_name
            ));

            $username = $base;
            $i = 1;

            // Caso exista, incrementa
            while ($dao->existsUsername($username, $id ?? 0)) {
                $username = $base . $i;
                $i++;
            }
        } else {
            $username = strtolower($this->sanitizeUserName($username));

            if ($dao->existsUsername($username, $id)) {
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'username',
                        'status' => 'Este nome de usuario já está em uso'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
            }
        }

        $this->username = $username;
    }

    private function sanitizeUserName(string $username): string
    {
        // Remove acentos e caracteres inválidos
        $username = iconv('UTF-8', 'ASCII//TRANSLIT', $username);
        return preg_replace('/[^a-zA-Z0-9_]/', '', $username);
    }

    public function getStoreName(): ?string { return $this->store_name; }
    public function setStoreName(?string $store_name, int $id = 0): void {
            if(!empty($store_name)){
                $dao = new PessoasDAO();

                if($dao->existsStoreName($store_name, $id)){
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

    public function getProfilePhoto(): ?string { return $this->profile_photo; }
    public function setProfilePhoto(?string $profile_photo, ?string $last_photo = null):void{
        if(!$profile_photo){
            $this->profile_photo = 'http://localhost/tcc/API/UPLOADS/profilePhotos/imgPadrao.png';
        }else{
            $this->profile_photo = $profile_photo ?? $last_photo;
        }
    }

    public function uploadProfilePhoto(array $file, string $uploadDir, string $last_photo ): string {
        // valida se o upload existe e não tem erro
        if(!empty($file)){
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception(
                json_encode(
                    ['success' => false,
                    'field' => 'profile_photo',
                    'status' => "Erro no upload do arquivo."],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                )
            );
        }

        // tipos permitidos
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception(
                json_encode(
                    ['success' => false,
                    'field' => 'profile_photo',
                    'status' => "Formato inválido. Apenas JPG, PNG e GIF são permitidos."],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                )
            );
        }

        // limite de tamanho (2MB)
        $maxSize = 2 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            throw new Exception(
                json_encode(
                    ['success' => false,
                    'field' => 'profile_photo',
                    'status' => "Arquivo muito grande. Máximo permitido: 2MB."],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                )
            );
        }

        // garante que o diretório existe
        if (!is_dir($uploadDir)) {
            throw new Exception(
                json_encode(
                    ['success' => false,
                    'field' => 'profile_photo',
                    'status' => "O diretório informado não existe.",
                    'upload' => $uploadDir,],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
            )
            );
        }

        // cria um nome único para o arquivo
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = "profile_" . $this->id . "_" . time() . "." . $ext;
        $filePath = rtrim($uploadDir, '/') . "/" . $fileName;

        // move o arquivo
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            throw new Exception(
                json_encode(
                    ['success' => false,
                    'field' => 'profile_photo',
                    'status' => "Falha ao mover o arquivo."],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                )
            );
        }

        // monta o caminho que será salvo no banco
        $url = "http://localhost/tcc/API/UPLOADS/profilePhotos/" . $fileName;

        // já seta no objeto
        $this->setProfilePhoto($url, $last_photo);

        return $url;
        }else{
            return 'valor de foto nulo';
        }
    }

    public function getCpf(): string { return $this->cpf; }
    public function setCpf(string $cpf, int $id = 0) {

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

        if((new PessoasDAO())->existsCpf($cpf, $id)){
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
    public function setEmail(string $email, int $id = 0): void {
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            throw new Exception(
                json_encode(
                    ['success' => false,
                    'field' => 'email',
                    'status' => 'Email inválido'],
                    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
        }

        if((new PessoasDAO())->existsEmail($email, $id)){
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
    public function setTelefone(?string $telefone, ?int $id = 0): void {
        if(!empty($telefone)){
            $telefone = preg_replace('/\D/', '', $telefone);;
            
            if((new PessoasDAO())->existsTelefone($telefone, $id)){
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

    public function getOpenHours():string{
        return $this->open_hours;
    }

    public function setOpenHours(string $open_hours): void { $this->open_hours = $open_hours; }

    public function getCloseHours():string{
        return $this->close_hours;
    }

    public function setCloseHours(string $close_hours): void { $this->close_hours = $close_hours; }

    public function getCheckAgreement() : string {
        return $this->agreement;
    }

    public function getComplemento():string{
        return $this->complemento;
    }
    public function setComplemento($complemento) : void {
        $this->complemento = $complemento;
    }

    public function setCheckAgreement() : void {
        $this->agreement = 'concordou';
    }

    
}


?>