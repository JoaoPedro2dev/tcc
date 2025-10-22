<?php
    namespace Model;

use DAO\PaymentCardDAO;
use Exception;

    class PaymentCard
    {
        // Propriedades correspondentes à tabela
        public ?int $id;
        public int $user_id;
        public ?string $encrypted_pan; // base64 do cipher
        public ?string $complete_number;
        public ?string $hidden_number;
        public ?string $encrypted_cvv; // base64 do cipher (opcional)
        public ?string $iv;          
        public ?string $brand;  // base64 do IV
        public ?string $last4;
        public ?int $exp_month;
        public ?int $exp_year;
        public ?string $cardholder_name;
        public  $created_at;

        public function __construct() {
            // $this->date = $var;
        }

        
        public function insert(PaymentCard $model): ?int{
            return ((new PaymentCardDAO())->insert($model));
        }

        public function selectAll(int $user_id):?array{
            return ((new PaymentCardDAO())->selectAll($user_id));
        }

        public function delete(int $id_card) : bool{
            return ((new PaymentCardDAO())->delete($id_card));
        }

        public function getId(): ?int { return $this->id; }
        public function setId(int $id): void { $this->id = $id; }

        public function getUserId(): int { return $this->user_id; }
        public function setUserId(int $uid): void { $this->user_id = $uid; }

        public function getEncryptedPan(): ?string { return $this->encrypted_pan; }
        public function setEncryptedPan(?string $cipherBase64): void { $this->encrypted_pan = $cipherBase64; }

        public function getCompleteNumber(): ?string {return $this->complete_number;}
        public function setCompleteNumber($user_id, $complete_number): void{

            $complete_number =  preg_replace('/\D/', '', $complete_number);

            if(strlen($complete_number) < 16  || strlen($complete_number) > 16){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'number',
                            'status' => 'O numero do cartão deve possuir 16 números'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));

                exit;
            }

            if((new PaymentCardDAO())->existsCardNumber($user_id, $complete_number)){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'number',
                        'status' => 'Este cartão já está cadaastrado'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
                
                exit;
            }

            $this->complete_number = $complete_number;
        }

        public function getHiddenNumber(): ?string {return $this->hidden_number;}
        public function setHiddenNumber(): void{
            $this->hidden_number = "**** **** **** ".$this->last4;
        }

        public function getEncryptedCvv(): ?string { return $this->encrypted_cvv; }
        public function setEncryptedCvv(?string $cvv): void {
            $cvv =  preg_replace('/\D/', '', $cvv);

            if(strlen($cvv) < 3 || strlen($cvv) > 4){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'cvv',
                            'status' => 'O numero CVV deve possuir de 3 a 4 números'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));

                exit;
            }
            
            $this->encrypted_cvv = $cvv;
        }

        public function getIv(): ?string { return $this->iv; }
        public function setIv(?string $ivBase64): void { $this->iv = $ivBase64; }

        public function getBrand(): ?string { return $this->brand; }
        public function setBrand(?string $brand): void { $this->brand = $brand; }

        public function getLast4(): ?string { return $this->last4; }
        public function setLast4(): void {
            $this->last4 = substr($this->complete_number, -4);
        }

        public function getExpMonth(): ?string { return $this->exp_month; }
        public function setExpMonth(?string $date): void {
            if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', $date)) {
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'expiry',
                        'status' => 'digite uma data de expiração válida'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));

                exit;
            }

            $this->exp_month = substr($date, 0, 2);
        }

        public function getExpYear(): ?string { return $this->exp_year; }
        public function setExpYear(?string $date): void {
            if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', $date)) {
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'expiry',
                        'status' => 'digite uma data de expiração válida'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));

                exit;
            }
            
            $this->exp_year = substr($date, -2);
        }

        public function getCardholderName(): ?string { return $this->cardholder_name; }
        public function setCardholderName(?string $name): void {
            $name = preg_replace('/\d/', '', $name);

            if(strlen($name) < 3){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'expiry',
                        'status' => 'Nome deve ter no mínimo 3 letras'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));

                exit;
            }

            $name = strtoupper($name);

            if(strlen($name) > 24) $name = substr($name, 0, 23).".";

            
            $this->cardholder_name = $name;
        }

        public function getCreatedAt(): ?\DateTimeInterface { return $this->created_at; }
        public function setCreatedAt(\DateTimeInterface $dt): void { $this->created_at = $dt; }

        /**
         * Verifica se o cartão está expirado com base em exp_month/exp_year.
         */
        public function isExpired(\DateTimeInterface $reference = null): bool
        {
            $reference = $reference ?? new \DateTimeImmutable('now');
            if (!$this->exp_month || !$this->exp_year) {
                return false; // sem dados, não assume expirado
            }

            // cria data no último dia do mês de validade
            $year = (int)$this->exp_year;
            $month = (int)$this->exp_month;
            // último dia do mês -> cria primeiro dia do mês seguinte e subtrai 1 dia
            $nextMonth = \DateTimeImmutable::createFromFormat('!Y-n-j', sprintf('%d-%d-1', ($month === 12 ? $year + 1 : $year), ($month === 12 ? 1 : $month + 1)));
            $expiryDate = $nextMonth->modify('-1 day')->setTime(23, 59, 59);

            return $reference > $expiryDate;
        }
    }

?>