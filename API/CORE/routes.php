<?php 
    header("Content-Type: application/json; cahrset=utf-8");

    // use Controller\TaskController;
    use Help\Functions;
    use Controller\ProductController;
    use Controller\CartController;
    use Controller\CartItemController;
    use DAO\PessoasDAO;
    use Model\Product;
    use Controller\PessoaController;
    use Model\Pessoa;

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
            Functions::verifyId('id');

            $id = $_GET['id'];

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

        case '/POST/usuario/cadastro':
            
            if($_SERVER['REQUEST_METHOD'] === 'POST'){
                                    // $_POST['store_name'] = null;

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

                        array_splice($setsArray, 2, 0, ['setStoreName']); 
                        array_splice($setsArray, 4, 0, ['setCnpj']); 
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
                    $pessoa->setUserName($_POST['username'] ?? null);  

                    
                    if(!$isSeller){
                        $storeName = $_POST['store_name'] ?? null;
                        $storeName = $storeName === '' ? null : $storeName;
                        $pessoa->setStoreName($storeName);
                    }
                    
                    $telefone = $_POST['telefone'] ?? null;
                    $telefone = $telefone === '' ? null : $telefone;
                    $pessoa->setTelefone($telefone);
                    
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

        case '/GET/usuario/login':
            if($_SERVER['REQUEST_METHOD'] === 'POST'){
                try{
                    $postArray = [
                        'email',          // email
                        'password',       // password
                    ];

                    foreach($postArray as $post){
                        Functions::verifyPost($post);
                    }

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
            
        case '/POST/cart/insert':
            // echo 'Bem vindo adicionar itens ao carrinho';

            Functions::verifyId('user_id');
            Functions::verifyVar('user_id');
            
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
                echo json_encode([
                    "success" => true,
                    "user" => $user // dados do payload JWT    
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            } else {
                // http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "user" => 'não autenticado'
                ]);
            }
            
        break;

        default: die("not found");

    }
?>