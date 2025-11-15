<?php


namespace DAO;
use DAO\DAO;
use Model\Vendedor;

class VendedorDAO extends DAO{
    public function selectByUrl(string $url){
        $sql = "SELECT vendedores.*, p.profile_photo  
                FROM vendedores
                INNER JOIN pessoas p ON p.id = vendedores.id_pessoa
                WHERE vendedores.`url` = ?";

        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute([$url]);

        return $stmt->fetchObject('Model\Vendedor');
    }

    public function update(Vendedor $model) : bool{
        $sql = "UPDATE vendedores SET store_name = ?, telefone_contato = ?, `seller_description` = ?, open_hours = ?, close_hours = ?, weekend = ?, `url` = ?, store_address = ?, cep = ?, rua = ?, num_loja = ?, complemento = ?, bairro = ?, cidade = ?, uf = ? WHERE id_pessoa = ?";
        $stmt = parent::$conexao->prepare($sql);
        return $stmt->execute([
            $model->getStoreName(),
            $model->getTelefone(),
            $model->getSellerDescription(),
            $model->getOpenHours(),
            $model->getCloseHours(),
            $model->getWeekend(),
            $model->getUrl(),
            $model->getStoreAddress(),
            $model->getCep(),
            $model->getRua(),
            $model->getNumLoja(),
            $model->getComplemento(),
            $model->getBairro(),
            $model->getCidade(),
            $model->getUf(),
            $model->getId(),
        ]);
    }

    public function updateBanner($caminhoFinal, $id){
        // Atualiza no BD
        $sql = "UPDATE vendedores SET banner = ? WHERE id_pessoa = ?";
        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute([$caminhoFinal, $id]);
    }

    public function updateProfilePhoto($caminhoFinal, $id){
        // Atualiza no BD
        $sql = "UPDATE pessoas SET profile_photo = ? WHERE id = ?";
        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute([$caminhoFinal, $id]);
    }

     public function existsTelefone(string $telefone, int $id = 0) : bool{
        $sql = "SELECT COUNT(*) FROM vendedores WHERE telefone_contato = ? AND id != ?";
        $stmt = parent::$conexao->prepare($sql);
        $stmt->execute([$telefone, $id]);
        return $stmt->fetchColumn() > 0;
    }
}

?>