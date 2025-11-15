<?php 

namespace Model;

use DAO\PessoasDAO;
use DAO\VendedorDAO;
use Exception;

class Vendedor extends Pessoa{
    public int $id_pessoa;
    public ?string $telefone_contato;
    public $banner;
    public int $itens_for_sale;
    public int $itens_sold;
    public ?string $seller_description;
    public ?string $store_address;
    public ?string $num_loja; 
    public string $weekend;

    public function selectByUrl(string $url){
        return ((new VendedorDAO())->selectByUrl($url));
    }

    public function update(Vendedor $model){
        return ((new VendedorDAO())->update($model));
    }

    public function updateBanner($caminhoFinal, $id){
        return ((new VendedorDAO())->updateBanner($caminhoFinal, $id));
    }

    public function updateProfilePhoto($caminhoFinal, $id){
        return ((new VendedorDAO())->updateProfilePhoto($caminhoFinal, $id));
    }

    public function getIdPessoa(): int {
        return $this->id_pessoa;
    }

    public function getTelefone(): ?string {
        return $this->telefone_contato;
    }

    public function getBanner(): ?string {
        return $this->banner;
    }

    public function getItensForSale(): int {
        return $this->itens_for_sale;
    }

    public function getItensSold(): int {
        return $this->itens_sold;
    }

    public function getSellerDescription(): string {
        return $this->seller_description;
    }

    // public function getOpenHours(): string {
    //     return $this->open_hours;
    // }

    // public function getCloseHours(): string {
    //     return $this->close_hours;
    // }

    public function getStoreAddress() : string {
        return $this->store_address;
    }

    public function getNumLoja(): string{
        return $this->num_loja;
    }

    public function getWeekend(): string {
        return $this->weekend;
    }

    // --- SETTERS ---

    public function setIdPessoa(int $id_pessoa): void {
        $this->id_pessoa = $id_pessoa;
    }

    public function setTelefoneContato(?string $telefone, ?int $id = 0): void {
        if(!empty($telefone)){
            $telefone = preg_replace('/\D/', '', $telefone);;
            
            if((new VendedorDAO())->existsTelefone($telefone, $id)){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'telefone_contato',
                        'status' => 'Este telefone já está em uso'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    )
                );
            }

            if(strlen($telefone) < 11 || strlen($telefone) > 11){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'telefone_contato',
                        'status' => 'O telefone deve ter no minimo 11 digitos e no máximo 11'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
            }
        }
            
        $this->telefone_contato = $telefone;
    }

    public function setBanner($banner): void {
        $this->banner = $banner;
    }

    public function setItensForSale(int $itens_for_sale): void {
        $this->itens_for_sale = $itens_for_sale;
    }

    public function setItensSold(int $itens_sold): void {
        $this->itens_sold = $itens_sold;
    }

    public function setSellerDescription(string $seller_description): void {
        $this->seller_description = $seller_description;
    }

    // public function setOpenHours(string $open_hours): void {
    //     $this->open_hours = $open_hours;
    // }

    // public function setCloseHours(string $close_hours): void {
    //     $this->close_hours = $close_hours;
    // }

    public function setStoreAddress(string $store_address): void {
        $this->store_address = $store_address;
    }

    public function setNumLoja(string $num_loja): void {
        $this->num_loja = $num_loja;
    }

    public function setWeekend(string $weekend): void {
        $this->weekend = $weekend;
    }

    public function moveImage($images, $banner = false){
            $diretorioDestino = __DIR__ . '/../UPLOADS/profilePhotos/';

            $limiteMb = 5 * 1024 * 1024;
            $tiposPermitidos = ['jpg', 'png', 'jpeg', 'webp'];
            $results = [];

            $nomeTmp = $images['tmp_name'];
            $originalName = basename($images['name']);
            
            $error = $images['error'];
            $size = $images['size'];

            if($error !== UPLOAD_ERR_OK){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'images',
                        'status' => 'Erro no upload do arquivo',
                        ],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            $infoImg = getimagesize($nomeTmp);
            if($infoImg === false){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'images',
                        'status' => 'Não é uma imagem válida',
                        ],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            $extensao = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            if(!in_array($extensao, $tiposPermitidos)){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'images',
                        'status' => 'Este tipo de arquivo não é permitido',
                        ],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            if($size > $limiteMb){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'images',
                        'status' => 'Esta imagem é muito grande, máximo de 5MB',
                        ],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            $nomeUnico = uniqid("img_", true).".".$extensao;    
            $caminhoDestino = $diretorioDestino . '/' . $nomeUnico;
            $caminhoBanco = "http://localhost/tcc/API/UPLOADS/profilePhotos/".$nomeUnico;

            //movendo o arquivo
            if(move_uploaded_file($nomeTmp, $caminhoDestino)){
                $caminhoBanco;
            }else{
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'images',
                        'status' => 'Algo deu errado ao salvar o arquivo'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            if($banner){
                $this->setBanner($caminhoBanco);
            }else{
                $this->setProfilePhoto($caminhoBanco);
            }
    }

    public function deleteImage($imageUrl)
    {
        $diretorioDestino = __DIR__ . '/../UPLOADS/profilePhotos/';

        if (empty($imageUrl)) {
            throw new Exception(json_encode([
                'success' => false,
                'field' => 'image',
                'status' => 'Nenhuma imagem foi informada.'
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }

        // Exemplo de URL: http://localhost/tcc/API/UPLOADS/images/img_67164af5b8c1f.jpg
        $fileName = basename($imageUrl);
        $caminhoCompleto = $diretorioDestino . $fileName;

        // Verifica se o arquivo realmente existe
        if (!file_exists($caminhoCompleto)) {
            throw new Exception(json_encode([
                'success' => false,
                'field' => 'image',
                'status' => 'Imagem não encontrada no servidor.'
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }

        // Tenta apagar o arquivo
        if (unlink($caminhoCompleto)) {
            return [
                'success' => true,
                'field' => 'image',
                'status' => 'Imagem excluída com sucesso.'
            ];
        } else {
            throw new Exception(json_encode([
                'success' => false,
                'field' => 'image',
                'status' => 'Falha ao excluir a imagem.'
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    }
}
?>