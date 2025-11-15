<?php 
    namespace Controller;

    use Exception;
    use Model\Pessoa;

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    abstract class PessoaController{
        static function getAccountData(int $id) : ?Pessoa{
            return ((new Pessoa())->getAccountData($id));
        }

        static function login(string $email, string $password){
            return ((new Pessoa())->login($email, $password));
        }

        static function insert(Pessoa $pessoa) : bool{
            return ((new Pessoa())->insert($pessoa));
        }
        
        static function profileUpdate(Pessoa $pessoa) : bool{
            return ((new Pessoa())->profileUpdate($pessoa));
        }

        static function personalInfoUpdate(Pessoa $pessoa):bool{
            return ((new Pessoa())->personalInfoUpdate($pessoa));
        }

        static function updatePassword(string $password, int $id): bool{
            return ((new Pessoa())->updatePassword($password, $id));
        }

        static function updateCnpj(string $cnpj, int $id): bool{
            return ((new Pessoa())->updateCnpj($cnpj, $id));
        }

        static function checkAuth() : ?array{
            if (!isset($_COOKIE["auth"])) {
                return null; //'$_COOKIE NÃO EXISTE';
            }

            try {
                $decoded = JWT::decode($_COOKIE['auth'], new Key($_ENV['secretKey'], 'HS256'));

                // valida expiração manualmente também (extra segurança)
                if (isset($decoded->exp) && $decoded->exp < time()) {
                    return null; //"O COOKIE EXPIROU";
                }

                return (array) $decoded;
            } catch (Exception $e) {
                return null;
            }
        }

        static function preferenceProducts(int $user_id){
            return ((new Pessoa())->preferenceProducts($user_id));
        }

    }
?>