<?php 
    header("Content-Type: application/json; cahrset=utf-8");

    // use Controller\TaskController;
    use Help\Functions;
    use Controller\ProductController;
    use Controller\CartController;
    use Controller\CartItemController;
    use Controller\CompraController;
use Controller\EnderecoController;
use Controller\HistoricoController;
use DAO\PessoasDAO;
    use Model\Product;
    use Controller\PessoaController;
    use Model\Compra;
    use Model\Pessoa;
    use Controller\PaymentCardController;
    use Controller\PedidosController;
use Controller\VendedorController;
use DAO\CompraDAO;
use DAO\ProductDAO;
use DAO\VendedorDAO;
use Model\Endereco;
use Model\Historico;
use Model\PaymentCard;
    use Model\Pedidos;
use Model\Vendedor;

    // use Controller\CartItemController;

    // Functions::verifyKey();

    
    switch(Functions::formatUrl()){
        case '/':
            // echo 'Bem vindo a Index ';
            echo json_encode(ProductController::index(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            break;

        case '/search':
            
            $var = trim($_GET['search'] ?? '');

            $search = htmlspecialchars($var, ENT_QUOTES, 'UTF-8');
            
            if($search === ''){
                die(json_encode(['status' => 'Você precisa de uma busca'], JSON_UNESCAPED_UNICODE));
            }

            $colors = json_decode($_GET['colors'] ?? '[]', true);
            $sizes = json_decode($_GET['sizes'] ?? '[]', true);
            $genders = json_decode($_GET['genders'] ?? '[]', true);
            $condictions = json_decode($_GET['condicitons'] ?? '[]', true);

            
            // echo 'Bem vindo a procura por texto ';
            
            echo json_encode(ProductController::selectSearch($search, $colors, $sizes, $genders, $condictions), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            break;

        case '/GET':
            Functions::verifyVar('id');
            $id = $_GET['id'];

            echo json_encode(ProductController::selectProduct($id), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;

        case '/GET/produtos/similar_items':
            try{
                $getArray = ['category', 'subCategory', 'style', 'id_produto'];
                
                foreach ($getArray as $get) {
                    Functions::verifyVar($get);
                }

                Functions::verifyIdPost('id_produto');

                echo json_encode(ProductController::getSimilarItems($_GET['category'], $_GET['subCategory'], $_GET['style'], $_POST['id_produto']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE); 
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/POST/cart':
            // echo 'Bem vindo adicionar carrinho';
            $user_id = trim($_GET['user_id'] ?? '');

            if($user_id === ''){
                die(json_encode(['status' => 'erro', 'desc' => 'Você precisa de um id de usuario'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            if(!filter_var($user_id, FILTER_VALIDATE_INT)){
                die(json_encode(['status' => 'erro', 'desc' => 'Digite um id valido'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }
            
            echo json_encode(CartController::addItem($user_id), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
        break;

        case '/POST/usuario/cadastro':
            
            if($_SERVER['REQUEST_METHOD'] === 'POST'){
                try{
                    Functions::verifyVar('nivel_acesso');

                    $isSeller = $_GET['nivel_acesso'] === 'vendedor' ? true : false;

                    $postArray = [
                        'first_name',
                        'last_name',
                        'cpf',
                        'email',
                        'date_birth',
                        'password',
                    ];

                    $setsArray = [
                        'setFirstName',
                        'setLastName',
                        'setCpf',
                        'setEmail',
                        'setDateBirth',
                        'setPassword',
                    ];

                    if ($isSeller) {
                        array_splice($postArray, 2, 0, ['store_name']); 
                        array_splice($postArray, 4, 0, ['cnpj']); 
                        array_splice($postArray, 6, 0, ['open_hour']);
                        array_splice($postArray, 8, 0, ['close_hour']);

                        array_splice($setsArray, 2, 0, ['setStoreName']); 
                        array_splice($setsArray, 4, 0, ['setCnpj']);
                        array_splice($setsArray, 6, 0, ['setOpenHours']);
                        array_splice($setsArray, 8, 0, ['setCloseHours']);    
                    }

                    $pessoa = new Pessoa();

                    $pessoa->setNivelAcesso($_GET['nivel_acesso']);

                    foreach($postArray as $post){
                        Functions::verifyPost($post);
                    }
                    
                    foreach($postArray as $i => $post){
                        $setter = $setsArray[$i];
                        $pessoa->$setter($_POST[$post]);
                    }

                    // $pessoa->setNivelAcesso('usuario');
                    $pessoa->setName();
                    $pessoa->setUserName(($_POST['username'] ?? null), null);  
                    $pessoa->setProfilePhoto(null, null);

                    
                    if(!$isSeller){
                        $storeName = $_POST['store_name'] ?? null;
                        $storeName = $storeName === '' ? null : $storeName;
                        $pessoa->setStoreName($storeName);
                    }
                    
                    $telefone = $_POST['telefone'] ?? null;
                    $telefone = $telefone === '' ? null : $telefone;
                    $pessoa->setTelefone($telefone);

                    if(!isset($_POST['checkAgreement'])){
                        throw new Exception(
                            json_encode(
                                ['success' => false,
                                'field' => 'checkAgreement',
                                'status' => 'Você precisa concordar com os termos de usuario'],
                                JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                            ));
                        exit;
                    }else{
                        $pessoa->setCheckAgreement();
                    }
                    
                    echo json_encode(PessoaController::insert($pessoa));
                }catch(Exception $e){
                    echo $e->getMessage();
                }
            }else{
                 echo json_encode(
                        ['success' => false, 
                        'status' => 'Metodo de requisição invalido'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
            
        break;

        case '/POST/usuario/profileUpdate':
            try{
                Functions::verifyVar('nivel_acesso');

                Functions::verifyId('id');
                Functions::verifyVar('id');

                $isSeller = $_GET['nivel_acesso'] === 'vendedor' ? true : false;

                $_POST['profile_photo'] = 'http://localhost/tcc/API/UPLOADS/profilePhotos/logo.jpg';

                $postArray = [
                    // 'id',
                    'first_name',
                    'last_name',
                    // 'user_name',
                    'profile_photo'
                ];

                $setsArray = [
                    // 'setId',
                    'setFirstName',
                    'setLastName',
                    // 'setuserName',
                    'setProfilePhoto',
                ];

                if ($isSeller) {
                    array_splice($postArray, 2, 0, ['store_name']); 

                    array_splice($setsArray, 2, 0, ['setStoreName']); 
                }

                $pessoa = new Pessoa();
                
                $pessoa->setId($_GET['id']);

                // $pessoa->setNivelAcesso($_GET['nivel_acesso']);

                foreach($postArray as $post){
                    Functions::verifyPost($post);
                }
                
                foreach($postArray as $i => $post){
                    $setter = $setsArray[$i];
                    $pessoa->$setter($_POST[$post]);
                }

                // $pessoa->setNivelAcesso('usuario');
                // $pessoa->setName();

                !$isSeller && $pessoa->setStoreName($_GET['store_name'] ?? null) ;

                Functions::verifyPost('username');

                $pessoa->setUserName($_POST['username'],$_GET['id'] );

                $pessoa->setName(); 


                $_FILES['profile_photo']['name'] && $pessoa->uploadProfilePhoto($_FILES['profile_photo'], __DIR__ . '/../UPLOADS/profilePhotos', $_POST['last_photo']);


                echo json_encode(PessoaController::profileUpdate($pessoa));
                

            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/GET/usuario/login':
            if($_SERVER['REQUEST_METHOD'] === 'POST'){
                try{
                    Functions::verifyPost('email');
                    Functions::verifyPost('password');

                    $user = PessoaController::login($_POST['email'], $_POST['password']);
                    $pessoa = new Pessoa();
                        
                    if($user){
                        $pessoa->createCookie($user);
                        echo json_encode(
                            [
                                'success' => true,
                                'userData' => PessoaController::checkAuth(),
                            ]
                            ,  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                    }else{
                        echo json_encode(['success' => false, 'field' => '', 'status' => 'Usuario ou senha incorretos'],  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                    }  
                         
                }catch(Exception $e){
                    echo $e->getMessage();
                }
            }else{
                 echo json_encode(
                        ['success' => false, 
                        'status' => 'Metodo de requisição invalido'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
        break;

        case '/GET/vendedor':
                try{
                    Functions::verifyVar('seller');
                    echo json_encode(VendedorController::selectByUrl($_GET['seller']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                }catch(Exception $e){
                    echo $e->getMessage();
                }
        break;

        case '/POST/update/vendedor':
            try{
                if($_SERVER['REQUEST_METHOD'] !== 'POST'){
                    die('Método de requisição inválido');
                }

                $postArray = [
                    'id',
                    'store_name',
                    'seller_description',
                    'telefone_contato',
                    'open_hours',
                    'close_hours',
                    'weekend',
                    'store_address',
                    'cep',
                    'rua',
                    'bairro',
                    'cidade',
                    'num_loja',
                    'complemento',
                    'uf',
                ];

                foreach($postArray as $post){
                    if($post === 'complemento') continue;
                    
                    Functions::verifyPost($post);
                }

                Functions::verifyIdPost('id');

                $vendedor = new Vendedor;

                $setsArray = [
                    'setId',
                    'setStoreName',
                    'setSellerDescription',
                    'setTelefone',
                    'setOpenHours',
                    'setCloseHours',
                    'setWeekend',
                    'setStoreAddress',
                    'setCep',
                    'setRua',
                    'setBairro',
                    'setCidade',
                    'setNumLoja',
                    'setComplemento',
                    'setUf',
                ];

                foreach($postArray as $i => $post){
                    $setter = $setsArray[$i];
                    if($setter === 'setStoreName'){
                        $vendedor->$setter($_POST[$post], $_POST['id']);
                    }else{
                        $vendedor->$setter($_POST[$post]);
                    }
                }

                if (!empty($_FILES['new_banner']['name'])) {
                    // Deleta o antigo
                    if($_POST['banner']){
                        $vendedor->deleteImage($_POST['banner']);
                    }

                    $vendedor->moveImage($_FILES['new_banner'], true);

                    $vendedor->updateBanner($vendedor->getBanner(), $_POST['id']);
                }

                if (!empty($_FILES['new_profile_photo']['name'])) {
                    // Deleta o antigo
                    if($_POST['profile_photo']){
                        $vendedor->deleteImage($_POST['profile_photo']);
                    }

                    $vendedor->moveImage($_FILES['new_profile_photo']);

                    $vendedor->updateProfilePhoto($vendedor->getProfilePhoto(), $_POST['id']);
                }


                echo json_encode(VendedorController::update($vendedor));
            }catch(Exception $e){
                echo $e->getMessage();   
            }
        break;

        case '/GET/seller_products':
            if($_SERVER['REQUEST_METHOD'] === 'POST'){
                try{
                    Functions::verifyPost('seller_id');
                    Functions::verifyIdPost('seller_id');
                    echo json_encode(ProductController::getBySellerId($_POST['seller_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                }catch(Exception $e){
                    echo $e->getMessage();
                }
            }else{
                 echo json_encode(
                        ['success' => false, 
                        'status' => 'Metodo de requisição invalido'],
                        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
        break;
        
        case '/POST/produto':
            // $_POST['id'] = 1;
            // $_POST['seller_id'] = 1;
            // $_POST['productName'] = 'aaaa';
            // $_POST['category'] = 'Camisetas';
            // $_POST['subCategory'] = 'basdasddas';
            // $_POST['brand'] = 'casd';
            // $_POST['gender'] = 'Masculino';
            // $_POST['condition'] = 'Novos';
            // $_POST['description'] = 'fadasdasdasdasd';
            // $_POST['price'] = 1;
            // $_POST['shippingCost'] = 0;
            // $_POST['salesQuantity'] = 0;
            // $_POST['deliveryTime'] = 1;
            // $_POST['itenStock'] = [
            //     [
            //         "cor" => "Laranja",
            //         "tamanhos" => [
            //             [ "tamanho" => "M", "qnt" => 10 ],
            //             [ "tamanho" =>  "G", "qnt"=> 8 ]
            //         ],
            //         "stockCor" => 18
            //     ]
            // ];

            try{
                $arrayPost = ['seller_id', 'productName', 'category', 'subCategory', 'style', 'brand', 'description', 'condition', 'gender'];

                $arraySetters = ['setSellerId', 'setProductName', 'setCategory', 'setSubCategory', 'setStyle', 'setBrand', 'setDescription', 'setCondition', 'setGender'];
                
                $produto = new Product();
                foreach($arrayPost as $post){
                    Functions::verifyPost($post);
                }

                Functions::verifyIdPost('seller_id');

                $produto = new Product();

                foreach($arrayPost as $i => $post){
                    $produto->{$arraySetters[$i]}($_POST[$post]);
                }
                
                if (!isset($_FILES['images'])) {
                    throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'images',
                            'status' => 'é obrigatório adicionar imagens para o produto'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
                }

                $produto->setItenStock(json_decode($_POST['itenStock'], true));

                $produto->setPrice($_POST['price']);
                $produto->setShippingCost($_POST['shippingCost']);
                $produto->setDeliveryTime($_POST['deliveryTime']);

                $produto->setSalesQuantity(0); 
                $produto->moveImage($_FILES['images']);
                
                echo json_encode(ProductController::insert($produto), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/POST/update/produto':
            // $_POST['id_produto'] = 5;
            // $_POST['productName'] = 'aaaa';
            // $_POST['category'] = 'Camisas';
            // $_POST['subCategory'] = 'basdasddas';
            // $_POST['brand'] = 'casd';
            // $_POST['gender'] = 'Masculino';
            // $_POST['style'] = 'style';
            // $_POST['condition'] = 'Novos';
            // $_POST['description'] = 'fadasdasdasdasd';
            // $_POST['price'] = 1;
            // $_POST['shippingCost'] = 0;
            // $_POST['salesQuantity'] = 0;
            // $_POST['deliveryTime'] = 1;
            // $_POST['itenStock'] = [
            //     [
            //         "cor" => "Laranja",
            //         "tamanhos" => [
            //             [ "tamanho" => "M", "qnt" => 10 ],
            //             [ "tamanho" =>  "G", "qnt"=> 8 ]
            //         ],
            //         "stockCor" => 18
            //     ]
            // ];

            try{
                $arrayPost = ['id', 'productName', 'category', 'subCategory', 'style', 'brand', 'description', 'condition', 'gender'];

                $arraySetters = ['setId', 'setProductName', 'setCategory', 'setSubCategory', 'setStyle', 'setBrand', 'setDescription', 'setCondition', 'setGender'];
                
                $produto = new Product();
                foreach($arrayPost as $post){
                    Functions::verifyPost($post);
                }

                $produto = new Product();

                foreach($arrayPost as $i => $post){
                    $produto->{$arraySetters[$i]}($_POST[$post]);
                }
                
                // $_POST['images'];

                if (!isset($_FILES['images'])) {
                    throw new Exception(
                        json_encode(
                            ['success' => false,
                            'field' => 'images',
                            'status' => 'é obrigatório adicionar imagens para o produto'],
                            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
                        ));
                }

                // print_r(json_decode($_POST['itenStock'], true));

                $produto->setItenStock(json_decode($_POST['itenStock'], true));

                $produto->setPrice($_POST['price']);
                $produto->setShippingCost($_POST['shippingCost']);
                $produto->setDeliveryTime($_POST['deliveryTime']);

                $produto->setSalesQuantity(0); 
                $produto->moveImage($_FILES['images']);
                // $produto->deleteImage('http://localhost/tcc/API/UPLOADS/images/img_68eac894494a64.80843415.png');
                
                echo json_encode(ProductController::update($produto), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/POST/adicionar-promocao':
            if($_SERVER['REQUEST_METHOD'] !== 'POST'){
                die('Método de requisição inválido');
            }

            try{
                $postArray = ['promotionPrice', 'promotionStartDate', 'promotionEndDate', 'product_id'];

                foreach($postArray as $post){
                    Functions::verifyPost($post);
                }

                $start_date = Functions::VerifyPromotionDates($_POST['promotionStartDate']);
                $end_date = Functions::VerifyPromotionDates($_POST['promotionEndDate'], true);

                Functions::verifyIdPost('product_id');   
                
                echo json_encode(ProductController::addPromotion($_POST['promotionPrice'], $start_date, $end_date, $_POST['product_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }

        break;

        case '/POST/remover-promocao':
            if($_SERVER['REQUEST_METHOD'] !== 'POST'){
                die('Método de requisição inválido');
            }

            try{
                Functions::verifyPost('product_id');
                Functions::verifyIdPost('product_id');   
                
                echo json_encode(ProductController::removePromotion($_POST['product_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }

        break;
            
        case '/POST/cart/insert':
            // echo 'Bem vindo adicionar itens ao carrinho';

            Functions::verifyId('user_id');
            Functions::verifyVar('user_id');
            
            $user_id = Functions::verifyId('user_id');

            $cor = Functions::verifyVar('cor');
            $tamanho = Functions::verifyVar('tamanho');

            $product_id = Functions::verifyId('product_id');

            $qty = Functions::verifyId('qty');

            $cartId = CartController::getId($user_id);
            
            echo json_encode(CartItemController::addItem($cartId, $product_id, $cor, $tamanho, $qty), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
        break;

        case '/GET/cart_item':
            // echo 'Bem vindo selecionar itens do carrinho';
            $user_id = trim($_GET['user_id'] ?? '');

            if($user_id === ''){
                die(json_encode(['status' => 'erro', 'desc' => 'Você precisa de um id de usuario'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            if(!filter_var($user_id, FILTER_VALIDATE_INT)){
                die(json_encode(['status' => 'erro', 'desc' => 'Digite um id valido'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            $cartId = CartController::getId($user_id);

            // echo json_encode($cartId);
            
            echo json_encode(CartItemController::getUserId($cartId), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
        break;

        case '/GET/cartItens':
            $user_id = trim($_GET['user_id'] ?? '');

            if($user_id === ''){
                die(json_encode(['status' => 'erro', 'desc' => 'Você precisa de um id de usuario'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            if(!filter_var($user_id, FILTER_VALIDATE_INT)){
                die(json_encode(['status' => 'erro', 'desc' => 'Digite um id valido'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }
            
            $cartId = CartController::getId($user_id);

            // echo $cartId;

            $cartItens = CartItemController::getUserId($cartId);

            $idArray = 
            !empty($cartItens) 
            ? array_map(function($item){
                return $item->productId;
            }, $cartItens) 
            : [];

            // print_r($cartItens);

            $qtyArray = 
            !empty($cartItens) 
            ? array_map(function($item){
                return $item->quantity;
            }, $cartItens) 
            : [];

            $cores = 
            !empty($cartItens) 
            ? array_map(function($item){
                return $item->cor;
            }, $cartItens) 
            : [];

            $tamanhos = 
            !empty($cartItens) 
            ? array_map(function($item){
                return $item->tamanho;
            }, $cartItens) 
            : [];

            $product = CartController::getAll($idArray);

            if($product){
                foreach($product as $i =>  $item){
                    $item->setQuantity( $qtyArray[$i] );
                    $item->setCor($cores[$i]);
                    $item->setTamanho($tamanhos[$i]);
                }
            }

            echo json_encode($product ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;

        case '/POST/cart-item-controll':
            $product_id = Functions::verifyId('product_id');
            
            Functions::verifyVar('user_id');
            $userId = Functions::verifyId('user_id');
            $userId = Functions::verifyId('user_id');
            
            $cartId = CartController::getId($userId);

            $operation = trim($_GET['operation'] ?? '');

            echo json_encode(CartItemController::quantityControll($cartId, $product_id, $operation),  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
        break;

        case '/DELETE/cart-item':
            $product_id = Functions::verifyId('product_id');
            
            Functions::verifyVar('user_id');
            $userId = Functions::verifyId('user_id');
            $userId = Functions::verifyId('user_id');
            
            $cartId = CartController::getId($userId);

            echo json_encode(CartItemController::delete($cartId, $product_id),  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        break;

        case '/POST/logout':
            $pessoa = new Pessoa();
            echo json_encode($pessoa->logout(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
        break;

        case '/GET/me':
            $user = PessoaController::checkAuth();

            if ($user) {
                $dados = PessoaController::getAccountData($user['id']);

                echo json_encode([
                    "success" => true,
                    "user" => $dados // dados do payload JWT    
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            } else {
                // http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "user" => 'não autenticado'
                ]);
            }
            
        break;

        case '/GET/finalizar_compra':
            try{
                
                // echo json_encode(CompraController::insert(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/POST/compras':
            try{
                $postArray = [
                    'id_cliente',
                    'cpf_cliente',
                    'id_loja',
                    // 'cnpj_loja',
                    'endereco_entrega',
                    'forma_pagamento',
                    // 'parcelas',
                    // 'valor_parcelas',
                    // 'frete_total',
                ];

                foreach($postArray as $post){
                    Functions::verifyPost($post);
                }
                
                $setters = [
                    "setIdCliente",
                    "setCpfCliente",
                    "setIdLoja",
                    // "setCnpjLoja",
                    "setEnderecoEntrega",
                    "setFormaPagamento",
                    // "setParcelas",
                    // "setValorParcelas",
                    // "setFreteTotal",
                ];

                $compra = new Compra();

                $compra->setFreteTotal($_POST['frete_total']);

                $compra->setIdCartao($_POST['id_cartao']);
                $compra->setParcelas($_POST['parcelas']);
                $compra->setValorParcelas($_POST['valor_parcelas']);

                foreach ($postArray as $i => $post) {
                    $setter = $setters[$i];
                    $compra->$setter($_POST[$post]);
                }

                Functions::verifyPost('itens');
                
                $dataItens = json_decode($_POST['itens'], true);

                // print_r($dataItens);

                foreach ($dataItens as $item) {
                    $compra->adicionarItem($item);
                }

                $compra->setStatus('pendente');
            
                if(CompraController::insert($compra)){
                    echo json_encode(['success' => true, 'status' => 'Compra realisada com sucesso'],  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                }else{
                    echo json_encode(['success' => false, 'field' => 'Error', 'status' => 'Algo deu errado'],  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                }
            
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/GET/compras':
            // $_POST['id'] = 2;
            
            try{
                Functions::verifyPost('id');
                Functions::verifyIdPost('id');

                echo json_encode(CompraController::getAllById($_POST['id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/GET/compra-by-id':
            $_POST['id_compra'] = 2;
            
            try{
                Functions::verifyPost('id_compra');
                Functions::verifyIdPost('id_compra');

                echo json_encode(CompraController::getById($_POST['id_compra']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/GET/paymentcard':

            // $_POST['id'] = 1;

            try{
                Functions::verifyPost('id');
                Functions::verifyIdPost('id');

                echo json_encode(PaymentCardController::selectAll($_POST['id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/POST/paymentcard':

            // $_POST['user_id'] = 1;

            // $_POST['complete_number'] = '1111111111111111';
            
            // $_POST['cvv'] = '123';

            $_POST['expiry'] = '11/99';

            // $_POST['cardholder_name'] = 'este texto deve possuir uns vinte e quatro caracteres para mais';

            try{
                $vars = ['user_id', 'complete_number', 'cvv', 'expiry', 'cardholder_name'];

                Functions::verifyIdPost('user_id');

                foreach($vars as $var){
                    Functions::verifyPost($var);
                }

                $model = new PaymentCard();

                $model->setUserId($_POST['user_id']);
                $model->setCompleteNumber($_POST['user_id'], $_POST['complete_number']);
                $model->setLast4();
                $model->setEncryptedCvv($_POST['cvv']);
                $model->setExpMonth($_POST['expiry']);
                $model->setExpYear($_POST['expiry']); 
                $model->setCardholderName($_POST['cardholder_name']);

                echo json_encode(PaymentCardController::insert($model), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/POST/DELETE/paymentcard':
            //$_POST['id_card'] = 7;
            try{
                Functions::verifyPost('id_card');
                Functions::verifyIdPost('id_card');
                
                echo json_encode(PaymentCardController::delete($_POST['id_card']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/POST/address':
            try{
                $varArray = ['user_id', 'rua', 'numero', 'bairro', 'cidade', 'uf', 'cep'];

                foreach($varArray as $var){
                    Functions::verifyPost($var);
                }

                Functions::verifyPost('user_id');

                if($_POST['cidade'] != 'Jaú'){
                    echo json_encode(['success' => false, 'field' => 'cep_localidade', 'status' => 'Desculpe, não atendemos fora da cidadede Jaú'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                    exit;
                }

                $model = new Endereco();
                
                $model->setId($_POST['user_id']);
                $model->setRua($_POST['rua']);
                $model->setNumResidencia($_POST['numero']);

                $complemento = trim($_POST['complemento'] ?? '');
                $model->setComplemento($complemento !== '' ? $complemento : null);


                $model->setBairro($_POST['bairro']);
                $model->setCidade($_POST['cidade']);
                $model->setUf($_POST['uf']);
                $model->setCep($_POST['cep']);
                $model->setAddrees();
                
                echo json_encode(EnderecoController::insert($model), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;
 
        case '/POST/historico':
            try{
                Functions::verifyIdPost('id_usuario');
                Functions::verifyIdPost('id_produto');

                Functions::verifyPost('id_usuario');
                Functions::verifyPost('id_produto');

                echo json_encode(HistoricoController::insert($_POST['id_usuario'], $_POST['id_produto']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/GET/historio':            
            try{
                Functions::verifyPost('id');
                Functions::verifyIdPost('id');

                echo json_encode(HistoricoController::getHistory($_POST['id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/POST/DELETE/historico':
            try{
                Functions::verifyPost('id_historico');
                Functions::verifyIdPost('id_historico');

                Functions::verifyPost('user_id');
                Functions::verifyIdPost('user_id');
                
                echo json_encode(HistoricoController::delete($_POST['id_historico'], $_POST['user_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/GET/shelf':
            // $_POST['user_id'] = 1;

            try{
                Functions::verifyPost('user_id');
                Functions::verifyIdPost('user_id');

                echo json_encode(PessoaController::preferenceProducts($_POST['user_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }

        break;

        case '/GET/carttohshelf':
            $_POST['user_id'] = 1;
            try{
                Functions::verifyPost('user_id');
                Functions::verifyIdPost('user_id');

                echo json_encode(CartController::selectToShelf($_POST['user_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }catch(Exception $e){
                echo $e->getMessage();
            }
        break;

        case '/GET/promotions':
            echo json_encode(ProductController::getPromotionDay(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;
            
        default: die("not found");
    }
?>