<?php 
    namespace DAO;
    use DAO\DAO;
    use Model\Endereco;
    
    class EnderecoDAO extends DAO{
        public function insert(Endereco $model) : bool{
            $sql = "UPDATE pessoas 
                    SET `address` = ?, rua = ?, bairro = ?, cidade = ?, uf = ?, cep = ?, num_residencia = ?, complemento = ? 
                    WHERE id = ?";

            $stmt = parent::$conexao->prepare($sql);
            return $stmt->execute(
                [
                    $model->getAddrees(),
                    $model->getRua(),
                    $model->getBairro(),
                    $model->getCidade(),
                    $model->getUf(),
                    $model->getCep(),
                    $model->getNumResidencia(),
                    $model->getComplemento(),
                    $model->getId()
                ]
            );
        }
    }
?>