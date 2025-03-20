<?php 
    include_once"../../conexao.php";

    session_start();

    if(!isset($_SESSION['admin']) || $_SESSION['admin'] !== 'sim'){
        header("Location: ../../index.php");
    }

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        header('Content-Type: application/json');

        if(empty($_POST['nome']) || empty($_POST['apresentacao']) || empty($_POST['abertura']) || empty($_POST['fechamento']) || empty($_POST['fimDeSemana'])){
            die(json_encode(['status' => 'variavelVazia']));
        }

        // function verificarDados($conexao, $valor, $tabela, $condicao, $dadoUser){
        //     $sql = $conexao->prepare("SELECT $valor FROM $tabela WHERE $condicao = ?");
        //     $sql->bind_param('s', $dadoUser);
        //     $sql->execute();
        //     return $sql->get_result();
        //     $sql->close();
        // }
        $id = $_SESSION['id'];

        $slqImg = $conexao->prepare("SELECT foto, banner FROM vendedores WHERE id_vendedor = ?");
        $slqImg->bind_param('i', $id);
        $slqImg->execute();
        $resultadoImg = $slqImg->get_result();
        $dadosImg = $resultadoImg->fetch_assoc();

        $novoBanner = !empty($_FILES['banner']) ? $_FILES['banner'] : $dadosImg['banner'];
        $novaFotoPerfil = !empty($_FILES['fotoPerfil']) ? $_FILES['fotoPerfil'] : $dadosImg['foto'];

        $imagens = [$novoBanner, $novaFotoPerfil];
        $arquivoImg = [];
    
        foreach($imagens as $img){
            if(is_array($img)){
                if($img['error'] !== UPLOAD_ERR_OK){
                    die(json_encode(['status' => 'erroImagem', 'error' => $img['error']]));
                }
        
                if($img['size'] > 32997250){
                    die(json_encode(['status' => 'imgemGrande']));
                }
        
                $pasta = 'fotosUsuarios/';
                $nomeImagem = $img['name'];
                $novoNome = uniqid();
                $extencao = strtolower(pathinfo($nomeImagem, PATHINFO_EXTENSION));
        
        
                if($extencao != "jpg" && $extencao != "png" && $extencao != "jpeg"){
                    die(json_encode(['status' => 'erroExtencao']));
                }
                
                $funcionou = move_uploaded_file($img['tmp_name'], '../../'.$pasta.$novoNome.".".$extencao);
                $arquivoImg[] = ' http://localhost/marketplace/'.$pasta.$novoNome.".".$extencao;
    
                if(!$funcionou){
                    die(json_encode(['status' => 'erroMovimentacaoArquivo']));
                }
            }else{
                $arquivoImg[] = $img;
            }
        }

        $novoNome = ucfirst(trim($_POST['nome'] ?? 'Usuario'));
        $novoUrl = trim(lcfirst(preg_replace("/\s+/", "_", $novoNome)));

        $novaApresentacao = trim( $_POST['apresentacao'] ?? 'Olá');
        $novoAbertura = $_POST['abertura'] ?? '08:00';
        $novoFechamento = $_POST['fechamento'] ?? '16:00';
        $novoFimSemana = $_POST['fimDeSemana'] ?? 'nao';

        if(!empty($_POST['telContato']) && $_POST['telContato'] !== 'Não informado'){
            $telLimpo = preg_replace('/\D/', '', $_POST['telContato']);

            if(preg_match('/^\d{10,11}$/', $telLimpo)){
                $novoTelContato = $telLimpo; 
            }else{
                die(json_encode(['status' => 'erroTelefone']));
            }
        }else{
            $novoTelContato = 'Não informado';
        }

        $sql = $conexao->prepare("UPDATE
                                    vendedores
                                    set
                                    nome_vendedor =?,
                                    nome_url =?,
                                    telefone_contato = ?,
                                    foto = ?, banner = ?,
                                    apresentacao =?,
                                    abertura = ?,
                                    fechamento = ?,
                                    final_semana = ?
                                    WHERE
                                    id_vendedor = ?");

        $sql -> bind_param('sssssssssi',
                            $novoNome,
                            $novoUrl,
                            $novoTelContato,
                            $arquivoImg[1],
                            $arquivoImg[0],
                            $novaApresentacao,
                            $novoAbertura,
                            $novoFechamento,
                            $novoFimSemana,
                            $id);

        if($sql->execute()){
            echo json_encode(['status' => 'editado']);

            $_SESSION['nome'] = $novoNome;
            $_SESSION['url'] = $novoUrl;
            $_SESSION['foto'] = $arquivoImg[1];
        }else{
            die(json_encode(['status' => 'erroCadastrar']));
        }
    }
?>