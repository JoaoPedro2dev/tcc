<?php 
    header("Content-Type: application/json; cahrset=utf-8");

    // use Controller\TaskController;
    use Help\Functions;
    use Controller\ProductController;
    use Controller\CartController;
    use Controller\CartItemController;
    use Model\Product;

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
            // echo 'Bem vindo a Index ';
            $id = trim($_GET['id'] ?? '');

            if($id === ''){
                die(json_encode(['status' => 'erro', 'desc' => 'Você precisa de um id'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            if(!filter_var($id, FILTER_VALIDATE_INT)){
                die(json_encode(['status' => 'erro', 'desc' => 'Digite um id valido'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            echo json_encode(ProductController::selectProduct($id), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

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

        case '/POST/cart-item-add':
            // echo 'Bem vindo adicionar itens ao carrinho';
            
            $user_id = Functions::verifyId('user_id');

            $product_id = Functions::verifyId('product_id');

            $qty = Functions::verifyId('qty');

            $cartId = CartController::getId($user_id);
            
            echo json_encode(CartItemController::addItem($cartId, $product_id, $qty), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
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


            $product = CartController::getAll($idArray);

            if($product){
                foreach($product as $i =>  $item){
                    $item->setQuantity( $qtyArray[$i] );
                }
            }

            echo json_encode($product ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;

        case '/POST/cart-item-controll':
            $product_id = Functions::verifyId('product_id');

            $operation = trim($_GET['operation'] ?? '');

            echo json_encode(CartItemController::quantityControll($product_id, $operation),  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            
            break;

        case '/DELETE/cart-item':
            $product_id = Functions::verifyId('product_id');

            echo json_encode(CartItemController::delete($product_id),  JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

            break;
            
        default: die("not found");
    }
?>