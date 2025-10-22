<?php 
namespace Model;
use DAO\EnderecoDAO;
use Exception;

    class Endereco{
        public int $id;
        public string $addrees;
        public string $rua;
        public string $bairro;
        public string $cidade;
        public string $uf;
        public string $cep;
        public string $num_residencia;
        public $complemento;

        public function insert(Endereco $model){
            return ((new EnderecoDAO())->insert($model));
        }

        // GETTERS
        public function getId(): int {
            return $this->id;
        }

        public function getAddrees(): string {
            return $this->addrees;
        }

        public function getRua(): string {
            return $this->rua;
        }

        public function getBairro(): string {
            return $this->bairro;
        }

        public function getCidade(): string {
            return $this->cidade;
        }

        public function getUf(): string {
            return $this->uf;
        }

        public function getCep(): string {
            return $this->cep;
        }

        public function getNumResidencia(): string {
            return $this->num_residencia;
        }

        public function getComplemento() {
            return $this->complemento;
        }

        // SETTERS
        public function setId(int $id): void {
            $this->id = $id;
        }

        public function setAddrees(): void {
            $address = ($this->complemento !== false
            ? 
            ($this->rua.", ".$this->num_residencia. " - ".$this->bairro.", ".$this->cidade." - ".$this->uf.", ".$this->cep)
            : ($this->rua.", ".$this->num_residencia.", ".$this->complemento." - ".$this->bairro.", ".$this->cidade." - ".$this->uf.", ".$this->cep));

            $this->addrees = $address;
        }

        public function setRua(string $rua): void {
            $this->rua = trim($rua);
        }

        public function setBairro(string $bairro): void {
            $this->bairro = trim($bairro);
        }

        public function setCidade(string $cidade): void {
            $this->cidade = trim($cidade);
        }

        public function setUf(string $uf): void {
            $this->uf = trim($uf);
        }

        public function setCep(string $cep): void {
            $this->cep = trim($cep);
        }

        public function setNumResidencia(string $num_residencia): void {
            if(preg_match('/\D/', $num_residencia)){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'numero',
                            'status' => 'O número da residencia não pode conter letras nem caracteres especiais'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            
            $this->num_residencia = $num_residencia;
        }

        public function setComplemento($complemento): void {
            $this->complemento = $complemento;
        }
    }
?>