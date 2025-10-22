<?php 
    namespace Model;

    use DAO\ProductDAO;
use DateTime;
use Exception;

    class Product
    {
        public int $id;
        public int $sellerId;
        public string $seller_url;
        public string $productName;
        public string $username;
        public ?string $store_name;
        public string $category;
        public string $subCategory; 
        public string $style;
        public string $brand; 
        public string $gender;
        public string $condition;
        public string $description;
        public $price;
        public string $paymentMethods;
        public float $shippingCost;
        public int $salesQuantity;
        // public int $stockTotal;
        public ?string $promotionStartDate;  // YYYY-MM-DD
        public ?string $promotionEndDate;    // YYYY-MM-DD
        public ?float $promotionPrice;
        public int $deliveryTime;            // prazo_entrega em dias
        public  $images;
        public string $profile_photo;
        public ?int $relevancia;
        public ?int $quantity; 
        public ?int $compatibility;
        public ?int $row_num;
        public ?int $stockTotal;
        public $data_criacao;
        public $cor;
        public $tamanho;
        public $itenStock;
        
        public function insert(Product $model){
            return ((new ProductDAO())->insert($model));
        }

        public function update(Product $model){
            return ((new ProductDAO())->update($model));
        }

        public function selectAll(): array{
            return ((new ProductDAO())->selectAll());
        }

        public function getById($id){
            return ((new ProductDAO())->getById($id));
        }

        public function getBeLike($search, $colors, $sizes, $genders, $conditions): ?array{
            return ((new ProductDAO())->getBeLike($search, $colors, $sizes, $genders, $conditions));
        }

        public function addPromotion(float $promotion_price, string $start_date, string $end_date, int $product_id):bool{
            return ((new ProductDAO())->addPromotion( $promotion_price,  $start_date, $end_date, $product_id));
        }

        public function removePromotion(int $product_id):bool{
            return ((new ProductDAO())->removePromotion($product_id));
        }

        public function getSimilarItems(string $category, string $subCategory, string $style, int $id_produto){
            return ((new ProductDAO())->getSimilarItems($category, $subCategory, $style, $id_produto));
        }

        // Getters e Setters
        public function getPromotionDay(){
            return ((new ProductDAO())->getPromotionDay());
        }

        public function getBySellerId(int $seller_id){
            return ((new ProductDAO())->getBySellerId($seller_id));
        }

        public function getSellerUrl(): string
        {
            return $this->seller_url;
        }
        public function setSellerUrl(string $seller_url): void
        {
            $this->seller_url = $seller_url;
        }

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
            if(strlen($productName) < 3){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'productName',
                            'status' => 'O nome do produto deve ter no minímo 3 caracteres'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }

            if(strlen($productName) > 180){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'productName',
                            'status' => 'O nome do produto deve ter no máximo 180 letras'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            
            $this->productName = ucwords($productName);
        }

        public function getCategory(): string
        {
            return $this->category;
        }
        public function setCategory(string $category): void
        {
            $categorias = ['Camisas', 'Calças', 'Shorts', 'Acessórios', 'Calçados', 'Infantil'];
            if(!in_array($category, $categorias)){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'category',
                            'status' => 'Esta categoria não é reconhecida'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            
            $this->category = $category;
        }
        
        public function getSubCategory(): string
        {
            return $this->subCategory;
        }
        public function setSubCategory(string $subCategory): void
        {   

            if(strlen($subCategory) < 3){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'subCategory',
                            'status' => 'Categoria deve ter no mínimo 3 caracteres'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }

            if(strlen($subCategory) > 100){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'subCategory',
                            'status' => 'Categoria deve ter no máximo 100 caracteres'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }

            $this->subCategory = ucfirst($subCategory);
        }

        public function getStyle() : string{
            return $this->style;
        }

        public function setStyle(string $style):void{
            $this->style = $style;
        }

        public function getBrand(): string
        {            
            return $this->brand;
        }
        public function setBrand(string $brand): void
        {
            if(strlen($brand) < 3){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'brand',
                            'status' => 'O nome de uma marca deve ter no minímo 3 caracteres'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }

            if(strlen($brand) > 180){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'brand',
                            'status' => 'O nome de uma marca deve ter no máximo 180 letras'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            
            $this->brand = ucwords($brand);
        }

        public function getGender(): string
        {
            return $this->gender;
        }
        public function setGender(string $gender): void
        {
            $generos = ['Masculino', 'Feminino', 'Unissex'];
            if(!in_array($gender, $generos)){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'gender',
                            'status' => 'Este gênero não é reconhecido'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            
            $this->gender = $gender;
        }

        public function getCondition(): string
        {
            return $this->condition;
        }
        public function setCondition(string $condition): void
        {
            $condicoes = ['Novos', 'Seminovos', 'Usados'];
            if(!in_array($condition, $condicoes)){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'condition',
                            'status' => 'Esta condição não é reconhecida'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            $this->condition = $condition;
        }

        public function getDescription(): string
        {
            return $this->description;
        }
        public function setDescription(string $description): void
        {
            if(strlen($description) < 10){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'description',
                            'status' => 'A descrição de um produto deve ter no mínimo 10 caracteres'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }

            if(strlen($description) > 300){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'description',
                            'status' => 'A descrição de um produto deve ter no máximo 300 caracteres'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }

            $this->description = $description;
        }

        public function getPrice()
        {
            return $this->price;
        }
        public function setPrice($price): void
        {   
            if(trim($price) === ''){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'price',
                            'status' => 'Adicione um preço ao produto'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }

            $price = number_format( (float) $price, 2);

            if($price < 0.01){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'price',
                            'status' => 'O produto não pode custar 0 reais'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }

            $this->price = $price;
        }

        public function getShippingCost(): float
        {
            return $this->shippingCost;
        }
        public function setShippingCost( $shippingCost): void
        {
             if(trim($shippingCost) === ''){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'shippingCost',
                            'status' => 'Adicione um preço ao frete do produto'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            
            $shippingCost = number_format( ((float) $shippingCost), 2);

            if($shippingCost < 0){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'shippingCost',
                            'status' => 'O Frete não pode custar menos que 0 reais'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            
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
        public function setPromotionStartDate(?string $promotionStartDate): void
        {   
            $this->promotionStartDate = $promotionStartDate ?? '';
        }

        public function getPromotionEndDate(): string
        {
            return $this->promotionEndDate;
        }
        public function setPromotionEndDate(?string $promotionEndDate): void
        {   
            $this->promotionEndDate = $promotionEndDate;
        }

        public function getPromotionPrice(): float
        {
            return $this->promotionPrice;
        }
        public function setPromotionPrice(?float $promotionPrice): void
        {
            $this->promotionPrice = $promotionPrice;
        }

        public function getDeliveryTime(): int
        {
            return $this->deliveryTime;
        }
        public function setDeliveryTime($deliveryTime): void
        {
             if(trim($deliveryTime) === ''){
                throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'deliveryTime',
                            'status' => 'Adicione um tempo em dia para a entrega'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
            }
            
            if(!is_numeric($deliveryTime)){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'deliveryTime',
                        'status' => 'Digite um número de dias válidos'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
            }
            $this->deliveryTime = $deliveryTime;
        }

        public function getImages()
        {
            return $this->images;
        }
        public function setImages( $images): void
        {
            $this->images = json_encode($images);
        }

        public function moveImage($images){
            $diretorioDestino = __DIR__ . '/../UPLOADS/images/';

            $limiteImages = 5; 
            $total = count($images['name']);
            $limiteMb = 5 * 1024 * 1024;
            $tiposPermitidos = ['jpg', 'png', 'jpeg', 'webp'];
            $results = [];

            if(count($images['name']) > $limiteImages){
                throw new Exception(
                    json_encode(
                        ['success' => false,
                        'field' => 'images',
                        'status' => 'Você pode adicionar no máximo 5 (Cinco) imagens para um produto'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                ));
            }

            for($i = 0; $i < $total; $i++){

                $nomeTmp = $images['tmp_name'][$i];
                $originalName = basename($images['name'][$i]);
                
                $error = $images['error'][$i];
                $size = $images['size'][$i];

                if($error !== UPLOAD_ERR_OK){
                    throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'images',
                            'status' => 'Erro no upload do arquivo',
                            'index' => $i],
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
                            'index' => $i],
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
                            'index' => $i],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
                }

                if($size > $limiteMb){
                    throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'images',
                            'status' => 'Esta imagem é muito grande, máximo de 5MB',
                            'index' => $i],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
                }

                $nomeUnico = uniqid("img_", true).".".$extensao;    
                $caminhoDestino = $diretorioDestino . '/' . $nomeUnico;
                $caminhoBanco = "http://localhost/tcc/API/UPLOADS/images/".$nomeUnico;

                //movendo o arquivo
                if(move_uploaded_file($nomeTmp, $caminhoDestino)){
                    $results[] = $caminhoBanco;
                }else{
                    throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'images',
                            'status' => 'Algo deu errado ao salvar o arquivo',
                            'index' => $i],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                    ));
                }
            }

            $this->setImages($results);
        }

        public function deleteImage($imageUrl)
        {
            $diretorioDestino = __DIR__ . '/../UPLOADS/images/';

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

        public function getQuantity(): int {    
            return $this->quantity;
        }

        public function setCor(string $cor): void {
            $this->cor = $cor;
        }

        public function getCor(): string {
            return $this->cor;
        }

        public function setTamanho(string $tamanho): void {
            $this->tamanho = $tamanho;
        }

        public function getTamanho(): string {
            return $this->tamanho;
        }

        public function setQuantity($quantity): void{
            $this->quantity = $quantity;
        }

        public function getItenStock(){
            return $this->itenStock ?? [];
        }

        public function setItenStock($itensStock, $isBd = false): void
        {
            if(!$isBd){
                if (empty($itensStock)) {
                    throw new Exception(json_encode([
                        'success' => false,
                        'field' => 'itenStock',
                        'status' => 'Adicione cores e tamanhos ao seu produto',
                    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                }

                // Soma total de todas as cores
                $totalStock = array_reduce($itensStock, function($carry, $item) {
                    return $carry + ($item['stockTotalColor'] ?? 0);
                }, 0);

                if ($totalStock <= 0) {
                    throw new Exception(json_encode([
                        'success' => false,
                        'field' => 'itenStock',
                        'status' => 'Adicione pelo menos uma quantidade de estoque',
                    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                }
            }
            foreach ($itensStock as &$item) {
                if (empty($item['tamanhos'])) {
                    throw new Exception(json_encode([
                        'success' => false,
                        'field' => 'itenStock',
                        'status' => 'Adicione tamanhos ao seu produto',
                    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                }

                // Remove tamanhos sem quantidade
                $item['tamanhos'] = array_values(array_filter(
                    $item['tamanhos'],
                    fn($tamanho) => ($tamanho['qnt'] ?? 0) > 0
                ));
            }

            // Remove cores que ficaram sem tamanhos válidos
            $itensStock = array_values(array_filter(
                $itensStock,
                fn($item) => !empty($item['tamanhos'])
            ));

            $this->itenStock = $itensStock;
        }

    }

?>