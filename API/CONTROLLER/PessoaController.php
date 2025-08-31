<?php 
    namespace Controller;

    use Exception;
    use Model\Pessoa;

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    abstract class PessoaController{
        static function login(string $email, string $password){
            return ((new Pessoa())->login($email, $password));
        }

        static function insert(Pessoa $pessoa) : bool{
            return ((new Pessoa())->insert($pessoa));
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

    }
?>