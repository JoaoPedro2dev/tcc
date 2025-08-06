<?php 
    namespace Model;

    use DAO\ProductDAO;

    class Product
    {
        public int $id;
        public int $sellerId;
        public string $productName;
        public string $sellerName;
        public string $category;
        public string $gender;
        public string $condition;
        public string $availableColors;
        public string $availableSizes;
        public string $description;
        public float $price;
        public string $paymentMethods;
        public int $installments;
        public int $fees;
        public float $shippingCost;
        public int $salesQuantity;
        public int $stockTotal;
        public string $promotionStartDate;  // YYYY-MM-DD
        public string $promotionEndDate;    // YYYY-MM-DD
        public float $promotionPrice;
        public int $deliveryTime;            // prazo_entrega em dias
        public string $images;

        public function selectAll(): array{
            return ((new ProductDAO())->selectAll());
        }

        public function getBeLike($search): ?array{
            return ((new ProductDAO())->getBeLike($search));
        }
        
        // Getters e Setters

        public function getId(): int
        {
            return $this->id;
        }
        public function setId(int $id): void
        {
            $this->id = $id;
        }

        public function getSellerId(): int
        {
            return $this->sellerId;
        }
        public function setSellerId(int $sellerId): void
        {
            $this->sellerId = $sellerId;
        }

        public function getProductName(): string
        {
            return $this->productName;
        }
        public function setProductName(string $productName): void
        {
            $this->productName = $productName;
        }

        public function getCategory(): string
        {
            return $this->category;
        }
        public function setCategory(string $category): void
        {
            $this->category = $category;
        }

        public function getGender(): string
        {
            return $this->gender;
        }
        public function setGender(string $gender): void
        {
            $this->gender = $gender;
        }

        public function getCondition(): string
        {
            return $this->condition;
        }
        public function setCondition(string $condition): void
        {
            $this->condition = $condition;
        }

        public function getAvailableColors(): string
        {
            return $this->availableColors;
        }
        public function setAvailableColors(string $availableColors): void
        {
            $this->availableColors = $availableColors;
        }

        public function getAvailableSizes(): string
        {
            return $this->availableSizes;
        }
        public function setAvailableSizes(string $availableSizes): void
        {
            $this->availableSizes = $availableSizes;
        }

        public function getDescription(): string
        {
            return $this->description;
        }
        public function setDescription(string $description): void
        {
            $this->description = $description;
        }

        public function getPrice(): float
        {
            return $this->price;
        }
        public function setPrice(float $price): void
        {
            $this->price = $price;
        }

        public function getShippingCost(): float
        {
            return $this->shippingCost;
        }
        public function setShippingCost(float $shippingCost): void
        {
            $this->shippingCost = $shippingCost;
        }

        public function getSalesQuantity(): int
        {
            return $this->salesQuantity;
        }
        public function setSalesQuantity(int $salesQuantity): void
        {
            $this->salesQuantity = $salesQuantity;
        }

        public function getPromotionStartDate(): string
        {
            return $this->promotionStartDate;
        }
        public function setPromotionStartDate(string $promotionStartDate): void
        {
            $this->promotionStartDate = $promotionStartDate;
        }

        public function getPromotionEndDate(): string
        {
            return $this->promotionEndDate;
        }
        public function setPromotionEndDate(string $promotionEndDate): void
        {
            $this->promotionEndDate = $promotionEndDate;
        }

        public function getPromotionPrice(): float
        {
            return $this->promotionPrice;
        }
        public function setPromotionPrice(float $promotionPrice): void
        {
            $this->promotionPrice = $promotionPrice;
        }

        public function getDeliveryTime(): int
        {
            return $this->deliveryTime;
        }
        public function setDeliveryTime(int $deliveryTime): void
        {
            $this->deliveryTime = $deliveryTime;
        }

        public function getImages(): string
        {
            return $this->images;
        }
        public function setImages(string $images): void
        {
            $this->images = $images;
        }
    }

?>