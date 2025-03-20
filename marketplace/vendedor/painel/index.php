<?php 
    session_start();
    if(!isset($_SESSION['admin'])){
        $_SESSION['admin'] = 'nao';
    }

    include_once"../../conexao.php";

    $sql = $conexao->prepare("SELECT id_vendedor, nome_vendedor, banner, foto, apresentacao, telefone_contato, abertura, fechamento, vendas, itens_a_venda, final_semana  FROM vendedores WHERE id_vendedor = ?");

    $sql->bind_param('s', $_SESSION['id']);
    $sql->execute();
    $resultado = $sql->get_result();
    
    $dados = $resultado->fetch_assoc();

    if(empty($dados)){
        die("Vendedor não encontrado");
    }

    date_default_timezone_set('America/Sao_paulo');

    $abertura = !($dados['abertura'] == '00:00:00') ? $dados['abertura'] : '08:00:00';
    $fechamento = !($dados['fechamento']  == '00:00:00') ? $dados['fechamento'] : '16:00:00';
    
    $horarioAtual = date('H:i:s');

    if($horarioAtual > $abertura && $horarioAtual < $fechamento){
        $status = 'Aberto';
    }else{
        $status = 'Fechado';
    }

    $horarios = [
        "00:00", "00:30", "01:00", "01:30",
        "02:00", "02:30", "03:00", "03:30",
        "04:00", "04:30", "05:00", "05:30",
        "06:00", "06:30", "07:00", "07:30",
        "08:00", "08:30", "09:00", "09:30",
        "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30",
        "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30",
        "18:00", "18:30", "19:00", "19:30",
        "20:00", "20:30", "21:00", "21:30",
        "22:00", "22:30", "23:00", "23:30"
    ];
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
    <title>Document</title>
</head>
<body>
    <h1>Alterar perfil</h1>
    
    <div class="container">
        <input type="file" id="bannerInput" class="image-input" accept="image/*" onchange="alterarImg(event, 'banner img')">

        <div id="banner">
            <?php 
                if(!empty($dados['banner'])){
                    echo '<img src="'.$dados['banner'].'" alt="">';
                }else{
                    echo '<img src="http://localhost/marketplace/fotosUsuarios/bannerPadrao.png" alt="">';
                }
            ?>
        </div>
        
        <section>
            <div id="userInfos">
                <input type="file" name="userImgInput" id="userImgInput" class="image-input" accept="image/*" onchange="alterarImg(event, 'userImg')">

                <img id="userImg" src="<?=$dados['foto']?>" alt="">

                <div id="text">
                    <input type="text" id="userNameInput" value="<?=$dados['nome_vendedor']?>">

                    <p><?=$dados['vendas']?> Vendas | <?=$dados['itens_a_venda']?> itens à venda</p>
                </div>
            </div>
        </section>
    </div>

    <section>
        <div id="apresentacaoBox">
            <div id="apresentacao">
                <h3 id="nomeApresentacao"><?=$dados['nome_vendedor']?></h3>
                
                <textarea id="apresentacaoText" maxlength="300"><?=$dados['apresentacao']?></textarea>
            </div>

            <ul>
                <li>
                    <i class="bi bi-stopwatch"></i>
                    <p>Horários:</p>
                    <select id="horaAbertura">  
                        <option value="<?= date('H:i', strtotime($abertura))?>" selected><?= date('H:i', strtotime($abertura))?></option>
                        <?php 
                            foreach($horarios as $hora){
                                if(  date('H:i', strtotime($abertura)) == $hora){
                                    echo "<option value=".$hora." selected>".$hora."</option>";
                                }else{
                                    echo "<option value=".$hora.">".$hora."</option>";
                                }
                            }
                        ?>
                    </select>

                    ás

                    <select id="horaFechamento">
                        <?php 
                            foreach($horarios as $hora){
                                if(  date('H:i', strtotime($fechamento)) == $hora){
                                    echo "<option value=".$hora." selected>".$hora."</option>";
                                }else{
                                    echo "<option value=".$hora.">".$hora."</option>";
                                }
                            }
                        ?>
                    </select>
                </li>

                <li>
                    <i class="bi bi-telephone"></i>
                    <p>Contato:</p>
                    <input type="tel" id="telContato" value="<?=$dados['telefone_contato']?>">
                </li>

                <li>
                    <i class="bi bi-calendar"></i>
                    <p>Finais de semana:</p>

                    <select id="fimDeSemana">
                        <option value="sim" <?=$dados['final_semana'] == 'sim' ? 'selected' : ''?> >Trabalhamos</option>
                        <option value="nao"  <?=$dados['final_semana'] == 'nao' ? 'selected' : ''?>>Não trabalhamos</option>
                    </select>
                </li>
            </ul>
        </div>

        <div id="buttonsContainer">
            <button onclick="window.location.href='../index.php?nome=<?=$_SESSION['url']?>'">Cancelar</button>
            <button id="salvarBtn">Salvar alterações</button>
        </div>
    </section>
</body>
</html>