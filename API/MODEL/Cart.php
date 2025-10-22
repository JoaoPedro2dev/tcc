<?php 
    namespace Model;

    use DAO\CartDAO;

    class Cart {
        private ?int $id;
        private int $userId;

        public function __construct($userId) {
            $this->setUserId($userId);
        }

        public function createCart() : bool{
            return ((new CartDAO()) -> createCart($this));
        }

        public function getByUserId() : ?int{            
            return ((new CartDAO())->getByUserId($this->getUserId()));;
        }

        public function selectAll(array $array) : ?array{
            return ((new CartDAO())->selectAll($array));
        }

        public function selectToShelf(int $user_id){
            return ((new CartDAO())->selectToShelf($user_id));
        }

        // Getter e Setter para cartId
        public function getId(): int {
            return $this->id;
        }

        public function setId(int $cartId): void {
            $this->id = $cartId;
        }

        // Getter e Setter para userId
        public function getUserId(): int {
            return $this->userId;
        }

        public function setUserId(int $userId): void {
            $this->userId = $userId;
        }
    }
?>