<?php 
    include_once"conexao.php";

    session_start();

    echo $_SESSION['nome'] . " " . " " . $_SESSION['id']. " " . $_SESSION['admin'] ."<a href='login/deslogar.php'>Deslogar</a>"." ".$_SESSION['cep'];

    function produtos($conexao, $categoria){
        $sql = $conexao->prepare("SELECT id, categoria, foto_1, produto_nome, valor_promocao, preco FROM produtos WHERE categoria = ?");
        $sql -> bind_param('s', $categoria);
        $sql->execute();
        $resultado = $sql->get_result();

        while($dados = $resultado->fetch_assoc()){
            echo "
                <div class='carousel-element' onclick='window.location.href=\"./venda?id_produto=".htmlspecialchars($dados["id"])."&categoria=".htmlspecialchars($dados['categoria'])."\"'>
                    <img src='".htmlspecialchars($dados['foto_1'])."' alt=''>
                    <div class='produtoInfos'>
                        <p>".htmlspecialchars($dados['produto_nome'])."</p>
            ";
                        verificarPromo($dados);
            echo "
                        <p>Frete grátis</p>
                    </div>
                </div>
            ";
        }
    } 

    function verificarPromo($dados){  
        if($dados['valor_promocao'] > 0){
            echo '<p class="valorOriginal">R$'.htmlspecialchars(number_format($dados['preco'], 2, ',','.')).'</p>';
            echo '<strong>R$'.htmlspecialchars(number_format($dados['valor_promocao'], 2, ',','.')).'</strong>';
        }else{
            echo '<strong>R$'.htmlspecialchars(number_format($dados['preco'], 2, ',','.')).'</strong>';
        }
    }
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
    <title>Marketplace</title>
</head>
<body>
    <header>
        <span>Marketplace</span>
        
        <?php 
            if(!isset($_SESSION['cep'])){
                echo '
                <button id="cepBtn"'.(isset($_SESSION['id']) ? 'onclick="window.location.href=\'./cep\'"' : 'onclick="window.location.    href=\'./login\'"').'>
                    <p>Entregar em</p>
                    <strong><i class="bi bi-geo-alt"></i>CEP</strong>
                </button>';
            }else{
                echo '
                <button id="cepBtn">
                    <p>Entregar em</p>
                    <strong><i class="bi bi-geo-alt"></i>'.$_SESSION['cep'].'</strong>
                </button>';
            }
        ?>

        <div id="searchBox">
            <input type="text" placeholder="Pesquise seu item" id="searchInput">
            <i class="bi bi-search" id="searchIcon"></i>
            <i class="bi bi-x-lg" id="clearSearch"></i>
        </div>
        
        <div id="userBox">
            <?php 
                if(!isset($_SESSION['id'])){
                    echo '
                        <button id="userLogin" onclick="window.location.href=\'./login\'">
                            <i class="bi bi-person-circle"></i>
                            <p>Entrar</p>
                        </button>      
                    ';
                }else{
                    echo '
                        <button class="logado" id="loginBtn" onclick="">
                            <img src="'.htmlspecialchars($_SESSION['foto']).'"/>
                        </button>      
                    ';
                }
            ?>

            <i class="bi bi-bag" id="carrinhoIcon" <?php echo isset($_SESSION['id']) ? '' :  'onclick="window.location.href=\'./login\'"' ?>></i>
        </div>
    </header>

    <div id="cartBox" class="hidden">
        <button class="closeBtn">
            <i class="bi bi-x-lg"></i>
        </button>
        <ul id="cartItensBox">
            <?php 
                if(isset($_SESSION['id'])){
                    echo '<input type="hidden" id="idUsuario" value="'.$_SESSION['id'].'">';
                    $sqlCart = 
                            "SELECT carrinhos.quantidade, carrinhos.id_produto, carrinhos.id_usuario, produtos.id, produtos.   foto_1, produtos.categoria, produtos.produto_nome, produtos.valor_promocao, produtos.preco 
                            FROM carrinhos 
                            INNER JOIN produtos ON produtos.id = carrinhos.id_produto
                            WHERE id_usuario = ".$_SESSION['id'];

                    $resultadoCart = $conexao->query($sqlCart);

                    $total = 0;

                    while($dadosCart = $resultadoCart->fetch_assoc()){
                        echo '
                                <li class="cartIten">
                                    <input type="hidden" class="idProduto" value="'.$dadosCart['id'].'">

                                    <img src="'.htmlspecialchars($dadosCart['foto_1']).'" alt="" onclick="window.location.href=\'./venda/index.php?id_produto='.htmlspecialchars($dadosCart['id']).'&categoria='.htmlspecialchars($dadosCart['categoria']).'\'">
                                    <div class="itenInfos">
                                        <p>'.htmlspecialchars($dadosCart['produto_nome']).'</p>
                                        <strong>
                        ';
                                        
                                        if($dadosCart['valor_promocao'] > 0){
                                            echo '
                                                    <span class="valorOriginal">R$'.htmlspecialchars(number_format($dadosCart['preco'], 2, ",",".")).'</span>
                                                    <span class="precoItemCart">R$'.htmlspecialchars(number_format($dadosCart['valor_promocao'], 2, ",",".")).'</span>  
                                                ';
                                        }else{
                                            echo '<span class="precoItemCart">R$'.htmlspecialchars(number_format($dadosCart['preco'], 2, ",",".")).'</span>';
                                        }

                        echo            '</strong>
                                    </div>
                                    <div class="contBox">
                                        <button class="moreBtn"><i class="bi bi-plus-lg"></i></button>
                                        <span class="qntDisplay">'.htmlspecialchars($dadosCart['quantidade']).'</span>
                                        <button class="lessBtn"><i class="bi bi-dash"></i></button>
                                    </div>
                                    <p class="itemRemoveBtn">
                                        <i class="bi bi-trash"></i>
                                    </p>
                                </li>
                        ';

                        if($dadosCart['valor_promocao'] > 0){
                            $total += $dadosCart['valor_promocao'] * $dadosCart['quantidade'];
                        }else{
                            $total += $dadosCart['preco'] * $dadosCart['quantidade'];
                        }
                    }

                    if($resultadoCart -> num_rows > 0){
                        echo '
                         <div id="buyBox">
                            <div id="buyInfos">
                                <p>Total</p>
                                <strong id="totalCart">R$'.htmlspecialchars(number_format($total, 2, ",",".")).'</strong>
                            </div>
                            <button id="buyBtn">
                                Comprar tudo
                            </button>
                        </div>
                    ';
                    }
                }
            ?>

            <div id="emptyCart">
                <i class="bi bi-bag-heart"></i>
                <div id="emptyText">
                    <h2>Seu carrinho esta vazil</h2>
                    <p>Aproveite nossas promoções e <br> ofertas para você</p>
                </div>
            </div>
        </ul>
    </div>

    <div id="accountBox" class="hidden">
        <button class="closeBtn">
            <i class="bi bi-x-lg"></i>
        </button>
        <div id="accountInfos">
            <h3>Olá <?=$_SESSION['nome']?></h3>

            <?php 
                if(isset($_SESSION['rua']) && isset($_SESSION['numero'])){
                    echo "
                        <p>".$_SESSION['rua'].", ".$_SESSION['numero']."</p>
                    ";
                }
            ?>

            <ul>
                <li>
                    <a href="">
                        <i class="bi bi-person-circle"></i>
                        <p>Minha conta</p>
                    </a>
                </li>

                
                <?php 
                    if($_SESSION['admin'] === 'sim'){
                        echo '
                            <li>
                                <a href="./vendedor/?nome='.$_SESSION['url'].'">
                                    <i class="bi bi-tablet-landscape"></i>
                                    <p>Painel administrativo</p>
                                </a>
                            </li>
                        ';
                    }
                ?>

                <li>
                    <a href="">
                        <i class="bi bi-cart"></i>
                        <p>Minhas compras</p>
                    </a>
                </li>

                <li>
                    <a href="">
                        <i class="bi bi-clock"></i>
                        <p>Histórico</p>
                    </a>
                </li>

                <li>
                    <a href="">
                        <i class="bi bi-headset"></i>
                        <p>Suporte</p>
                    </a>
                </li>
            </ul>
        </div>
    </div>

    <div class="carousel-container">
        <div class="carousel">
            <div class="slide"><img src="../e-commerce/img/6750864b3190e.jpg" alt="Oferta 1"></div>
            <div class="slide"><img src="../e-commerce/img/675787489dd7f.png" alt="Oferta 2"></div>
            <div class="slide"><img src="../e-commerce/img/67578772b94da.png" alt="Oferta 3"></div>
        </div>

        <!-- Botões de navegação -->
        <button class="carouselBtn prev">&#10094;</button>
        <button class="carouselBtn next">&#10095;</button>

        <!-- Indicadores -->
        <div class="indicators">
            <input type="radio" name="indicator" id="ind0" checked>
            <input type="radio" name="indicator" id="ind1">
            <input type="radio" name="indicator" id="ind2">
        </div>
    </div>

    <nav>
        <a href="#ofertas">Ofertas do dia</a>
        <a href="#masculino">Masculino</a>
        <a href="#feminino">Feminino</a>
        <a href="#infantil">Infantil</a>
        <a href="#acessorios">Acessorios</a>
        <a href="#calcados">Calçados</a>
    </nav>

    <div id="sectionContainers">
        <section class="produtos" id="ofertas">
            <strong>Esta procurando ofertas?</strong>
            <div class="containerOrganizador">
                <button class="nav-controls prev-btn"><i class="bi bi-arrow-left"></i></button>
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                        <?php 
                            // $data = new DateTime();

                            $sqlOferta = "SELECT id, categoria, foto_1, produto_nome, valor_promocao, preco, frete FROM produtos WHERE valor_promocao != 0";

                            $resultadoOferta = $conexao->query($sqlOferta);

                            while($dadosOferta = $resultadoOferta->fetch_assoc()){
                                echo "
                                    <div class='carousel-element' onclick='window.location.href=\"./venda?id_produto=".htmlspecialchars($dadosOferta["id"])."&categoria=".htmlspecialchars($dadosOferta['categoria'])."\"'>
                                        <img src='".htmlspecialchars($dadosOferta['foto_1'])."' alt=''>
                                        <div class='produtoInfos'>
                                            <p>".htmlspecialchars($dadosOferta['produto_nome'])."</p>
                                ";
                                    verificarPromo($dadosOferta);
                                echo "
                                            <p>Frete grátis</p>
                                        </div>
                                    </div>
                                ";
                            }
                        ?>
                    </div>
                </div>
                <button class="nav-controls next-btn"><i class="bi bi-arrow-right"></i></button>
            </div>
        </section>

        <section class="produtos" id="camisetas">
            <strong>Esta procurando camisetas?</strong>
            <div class="containerOrganizador">
                <button class="nav-controls prev-btn nove"><i class="bi bi-arrow-left"></i></button>
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                    <?php 
                        produtos($conexao, 'camisetas');
                    ?>
                    </div>
                </div>
                <button class="nav-controls next-btn nove"><i class="bi bi-arrow-right"></i></button>
            </div>
        </section>

        <section class="produtos" id="calcas">
            <strong>Esta procurando calças?</strong>
            <div class="containerOrganizador">
                <button class="nav-controls prev-btn nove"><i class="bi bi-arrow-left"></i></button>
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                    <?php 
                        produtos($conexao, 'calcas')
                    ?>
                    </div>
                </div>
                <button class="nav-controls next-btn nove"><i class="bi bi-arrow-right"></i></button>
            </div>
        </section>

        <section class="produtos" id="shorts">
            <strong>Esta procurando shorts?</strong>
            <div class="containerOrganizador">
                <button class="nav-controls prev-btn nove"><i class="bi bi-arrow-left"></i></button>
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                    <?php 
                        produtos($conexao, 'shorts')
                    ?>
                    </div>
                </div>
                <button class="nav-controls next-btn nove"><i class="bi bi-arrow-right"></i></button>
            </div>
        </section>

        <section class="produtos" id="calcados">
            <strong>Esta procurando calçados?</strong>
            <div class="containerOrganizador">
                <button class="nav-controls prev-btn nove"><i class="bi bi-arrow-left"></i></button>
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                    <?php 
                        produtos($conexao, 'calcados');
                    ?>
                    </div>
                </div>
                <button class="nav-controls next-btn nove"><i class="bi bi-arrow-right"></i></button>
            </div>
        </section>

        <!-- <section class="produtos" id="masculino">
            <strong>Conheça itens masculinos</strong>
            <button class="nav-controls prev-btn dois"><i class="bi bi-arrow-left"></i></button>
            <div class="carousel-wrapper">
                <div class="carousel-track">
                <?php 
                    $sqlMasculino = "SELECT * FROM produtos WHERE genero = 'masculino'";

                    $resultadoMasculino = $conexao->query($sqlMasculino);

                    while($dadosMasculino = $resultadoMasculino->fetch_assoc()){
                        echo "
                            <div class='carousel-element' onclick='window.location.href=\"./venda?id_produto=".htmlspecialchars($dadosMasculino["id"])."&categoria=".htmlspecialchars($dadosMasculino['categoria'])."\"'>
                                <img src='".htmlspecialchars($dadosMasculino['foto_1'])."' alt=''>
                                <div class='produtoInfos'>
                                    <p>".htmlspecialchars($dadosMasculino['produto_nome'])."</p>
                                    <strong>R$".htmlspecialchars($dadosMasculino['preco'])."</strong>
                                    <p>Frete grátis</p>
                                </div>
                            </div>
                        ";
                    }
                ?>
                </div>
            </div>
            <button class="nav-controls next-btn dois"><i class="bi bi-arrow-right"></i></button>
        </section>
        
        <section class="produtos" id="feminino">
            <strong>Conheça itens femininos</strong>
            <button class="nav-controls prev-btn tres"><i class="bi bi-arrow-left"></i></button>
            <div class="carousel-wrapper">
                <div class="carousel-track">
                <?php 
                    $sqlFeminino = "SELECT * FROM produtos WHERE categoria = 'Feminino'";

                    $resultadoFeminino = $conexao->query($sqlFeminino);

                    while($dadosFeminino = $resultadoFeminino->fetch_assoc()){
                        echo "
                            <div class='carousel-element' onclick='window.location.href=\"./venda?id_produto=".htmlspecialchars($dadosFeminino["id"])."&categoria=".htmlspecialchars($dadosFeminino['categoria'])."\"'>
                                <img src='".htmlspecialchars($dadosFeminino['foto_1'])."' alt=''>
                                <div class='produtoInfos'>
                                    <p>".htmlspecialchars($dadosFeminino['produto_nome'])."</p>
                                    <strong>R$".htmlspecialchars($dadosFeminino['preco'])."</strong>
                                    <p>Frete grátis</p>
                                </div>
                            </div>
                        ";
                    }
                ?>
                </div>
            </div>
            <button class="nav-controls next-btn tres"><i class="bi bi-arrow-right"></i></button>
        </section>

        <section class="produtos" id="infantil">
            <strong>Conheça itens infantis</strong>
            <button class="nav-controls prev-btn quarto sete"><i class="bi bi-arrow-left"></i></button>
            <div class="carousel-wrapper">
                <div class="carousel-track">
                <?php 
                    $sqlInfantil = "SELECT * FROM produtos WHERE categoria = 'Infantil'";

                    $resultadoInfantil = $conexao->query($sqlInfantil);

                    while($dadosInfantil = $resultadoInfantil->fetch_assoc()){
                        echo "
                            <div class='carousel-element' onclick='window.location.href=\"./venda?id_produto=".htmlspecialchars($dadosInfantil["id"])."&categoria=".htmlspecialchars($dadosInfantil['categoria'])."\"'>
                                <img src='".htmlspecialchars($dadosInfantil['foto_1'])."' alt=''>
                                <div class='produtoInfos'>
                                    <p>".htmlspecialchars($dadosInfantil['produto_nome'])."</p>
                                    <strong>R$".htmlspecialchars($dadosInfantil['preco'])."</strong>
                                    <p>Frete grátis</p>
                                </div>
                            </div>
                        ";
                    }
                ?>
                </div>
            </div>
            <button class="nav-controls next-btn quarto sete"><i class="bi bi-arrow-right"></i></button>
        </section> -->
        
        <section class="produtos" id="acessorios">
            <strong>Esta procurando acessórios?</strong>
            <div class="containerOrganizador">
                <button class="nav-controls prev-btn oito"><i class="bi bi-arrow-left"></i></button>
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                    <?php 
                     produtos($conexao, 'acessorios');
                    ?>
                    </div>
                </div>
                <button class="nav-controls next-btn oito"><i class="bi bi-arrow-right"></i></button>
            </div>
        </section>
    </div>

    <footer>
        <h2>SOBRE NOSSO SITE</h2>
        <p>  
            <span id="textoSite">
                Este marktplace é um TCC (Trabalho de conclusão de curso). iniciado por 4 alunos do curso técnico de Desenvolvimento de Sistemas na escola ETEC Joaquim Ferreira do Amaral na cidade de jaú, por enquanto a ideia permanece como um projeto escolar, mas aceitamos feedbacks que nos ajudem a ter ideia de como o público reagiu ao site, isso será usado caso o site venha a se tornar algo mais profissional. caso queira nos ajudar, seu feedback será bem-vindo, e com certeza serão de grande ajuda.
            </span>
        </p>

        <form action="" method="">
            <p>
                <label for="">Email</label>
                <input type="email" placeholder="Digite um e-mail" required>
            </p>

            <p>
                <label for="">Feedbacks</label>
                <textarea name="" id="" placeholder="Deixe seu feedback" required></textarea>
            </p>

            <input type="submit" value="Enviar feedback">

            <a href="#">Porque pedimos seu e-mail</a>
        </form>
    </footer>
</body>
</html>