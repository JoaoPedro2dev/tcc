-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 31/08/2025 às 15:36
-- Versão do servidor: 9.1.0
-- Versão do PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `marketplace`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `carrinhos`
--

DROP TABLE IF EXISTS `carrinhos`;
CREATE TABLE IF NOT EXISTS `carrinhos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `carrinhos`
--

INSERT INTO `carrinhos` (`id`, `userId`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `carrinho_itens`
--

DROP TABLE IF EXISTS `carrinho_itens`;
CREATE TABLE IF NOT EXISTS `carrinho_itens` (
  `itemId` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`itemId`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `carrinho_itens`
--

INSERT INTO `carrinho_itens` (`itemId`, `cartId`, `productId`, `quantity`) VALUES
(1, 2, 98, 1),
(2, 2, 36, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
CREATE TABLE IF NOT EXISTS `comentarios` (
  `id_comentario` int NOT NULL AUTO_INCREMENT,
  `id_produto` int NOT NULL,
  `id_usuario` int NOT NULL,
  `likes` int NOT NULL,
  `usuarios_likes` int NOT NULL,
  `texto_comentario` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `data_comentario` date NOT NULL,
  PRIMARY KEY (`id_comentario`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `comentarios`
--

INSERT INTO `comentarios` (`id_comentario`, `id_produto`, `id_usuario`, `likes`, `usuarios_likes`, `texto_comentario`, `data_comentario`) VALUES
(1, 36, 1, 3123, 0, 'muito legal', '2025-02-19'),
(2, 36, 82, 202, 0, 'Ótima qualidade! O produto chegou bem embalado e dentro do prazo. Atendeu todas as minhas expectativas e é exatamente como descrito. Recomendo!', '2025-02-21'),
(3, 29, 87, 23, 0, 'Produto excelente', '2025-02-28'),
(4, 34, 1, 1, 1, 'Testando comentarios', '2025-03-31');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `ids_produtos` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_usuario` int NOT NULL,
  `data_pedido` date NOT NULL,
  `horario_pedido` time NOT NULL,
  `data_entrega` date NOT NULL,
  `horario_entrega` time NOT NULL,
  `endereco_de_entrega` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Forma_de_envio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `forma_de_pagamento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `quantidades` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `condicao` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `total` double(10,2) NOT NULL,
  `pagamento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_pedido`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `ids_produtos`, `id_usuario`, `data_pedido`, `horario_pedido`, `data_entrega`, `horario_entrega`, `endereco_de_entrega`, `Forma_de_envio`, `forma_de_pagamento`, `quantidades`, `condicao`, `total`, `pagamento`) VALUES
(39, '22', 46, '2025-01-07', '14:01:03', '0000-00-00', '00:00:00', 'Avenida Alberto Masiero, 1292, Jardim Maria Luiza IV, Jaú - SP, 17213250', 'entrega', 'cartao', '1', 'cancelado_usuar', 1.00, 'pendente'),
(40, '23', 46, '2025-01-07', '14:02:53', '0000-00-00', '00:00:00', 'Avenida Alberto Masiero, 22, Jardim Maria Luiza IV, Jaú - SP, 17213250', 'entrega', 'cartao', '2', 'para_entrega', 4.00, 'pendente'),
(41, '32', 46, '2025-01-07', '14:27:18', '0000-00-00', '00:00:00', 'buscou no local', 'buscar', 'cartao', '1', 'para_entrega', 3.00, 'pendente');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pessoas`
--

DROP TABLE IF EXISTS `pessoas`;
CREATE TABLE IF NOT EXISTS `pessoas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nivel_acesso` enum('admin','usuario','vendedor') COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `profile_photo` varchar(300) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `store_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `url` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cpf` char(11) COLLATE utf8mb4_general_ci NOT NULL,
  `cnpj` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(180) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_birth` date NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `rua` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bairro` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cidade` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uf` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cep` char(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `num_residencia` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `unique_username` (`username`),
  UNIQUE KEY `unique_cpf` (`cpf`),
  UNIQUE KEY `unique_email` (`email`),
  UNIQUE KEY `unique_telefone` (`telefone`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pessoas`
--

INSERT INTO `pessoas` (`id`, `nivel_acesso`, `name`, `profile_photo`, `first_name`, `last_name`, `username`, `store_name`, `url`, `cpf`, `cnpj`, `email`, `telefone`, `date_birth`, `address`, `criado_em`, `password`, `rua`, `bairro`, `cidade`, `uf`, `cep`, `num_residencia`, `active`) VALUES
(1, 'usuario', 'João Pedro', 'http://localhost/tcc/API/UPLOADS/profilePhotos/imgPadrao.png', 'João', 'Pedro', 'joão_pedro', NULL, NULL, '11111111111', NULL, 'joao@gmail.com', '14991202192', '2000-12-20', NULL, '2025-08-31 15:33:35', '54b869057f5253a9c3b201428befe69d050e65cd', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'vendedor', 'Vendedor Tetse', 'http://localhost/tcc/API/UPLOADS/profilePhotos/imgPadrao.png', 'Vendedor', 'Tetse', 'vendedor_tetse', 'Teste de lova Nova', 'teste_de_lova_nova', '22222222222', '11111111111111', 'vendedor@gmail.com', NULL, '1999-11-11', NULL, '2025-08-31 15:34:32', '54b869057f5253a9c3b201428befe69d050e65cd', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Acionadores `pessoas`
--
DROP TRIGGER IF EXISTS `after_insert_pessoa`;
DELIMITER $$
CREATE TRIGGER `after_insert_pessoa` AFTER INSERT ON `pessoas` FOR EACH ROW BEGIN
    IF NEW.nivel_acesso = 'usuario' THEN
        INSERT INTO usuarios (id_pessoa) 
        VALUES (NEW.id);

        INSERT INTO carrinhos (userId) 
        VALUES (NEW.id);

    ELSEIF NEW.nivel_acesso = 'vendedor' THEN
        INSERT INTO vendedores (id_pessoa, store_name, url, cnpj) 
        VALUES (NEW.id, NEW.store_name, NEW.url, NEW.cnpj);

        INSERT INTO carrinhos (userId) 
        VALUES (NEW.id);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sellerId` int NOT NULL,
  `productName` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `subCategory` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `brand` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `condition` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `availableColors` json NOT NULL,
  `availableSizes` json NOT NULL,
  `description` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `paymentMethods` json NOT NULL,
  `installments` int NOT NULL,
  `fees` int NOT NULL,
  `shippingCost` double(10,2) NOT NULL,
  `salesQuantity` int NOT NULL,
  `stockTotal` int NOT NULL,
  `promotionStartDate` date NOT NULL,
  `promotionEndDate` date NOT NULL,
  `promotionPrice` decimal(10,2) NOT NULL,
  `deliveryTime` int NOT NULL,
  `images` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produtos`
--

INSERT INTO `produtos` (`id`, `sellerId`, `productName`, `category`, `subCategory`, `brand`, `gender`, `condition`, `availableColors`, `availableSizes`, `description`, `price`, `paymentMethods`, `installments`, `fees`, `shippingCost`, `salesQuantity`, `stockTotal`, `promotionStartDate`, `promotionEndDate`, `promotionPrice`, `deliveryTime`, `images`) VALUES
(99, 1, 'Calça 1', 'Calças', 'Esportivo', 'Adidas', 'unissex', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', 'Tênis confortável e estiloso, ideal para o dia a dia. Confeccionado com materiais de qualidade, proporciona leveza, durabilidade e ótimo ajuste aos pés. Combina com diversos looks, unindo praticidade e modernidade.', 12.00, 'null', 0, 0, 0.00, 0, 42, '0000-00-00', '0000-00-00', 0.22, 12, '[\"http://localhost/tcc/API/UPLOADS/images/676c600f8ad8c.png\", \"http://localhost/tcc/API/UPLOADS/images/676c5ff32bdb6.png\"]'),
(98, 1, 'Meu produto', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Amarelo\"]', '[\"PP\"]', 'Meu produto 1', 2.50, 'null', 0, 0, 0.00, 421, 10, '0000-00-00', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(28, 1, '1', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '1', 1.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(18, 1, 'bolo de café 1', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '<script>alert(\'XSS\');</script>', 12.53, 'null', 0, 0, 22.00, 0, 1, '2025-02-22', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(19, 1, 'Pão', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', 'pão de 500g', 5.44, 'null', 0, 0, 22.00, 0, 10, '0000-00-00', '0000-00-00', 0.00, 3, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(21, 1, 'Coca-cola', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', 'coca-cola 300ml', 3.00, 'null', 0, 0, 22.00, 0, 1, '2025-02-22', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(22, 1, 'item 1', 'Shorts', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '1', 1.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.99, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(23, 1, 'item 2', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', 'Descrição', 2.00, 'null', 0, 0, 22.00, 0, 52, '0000-00-00', '0000-00-00', 1.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(25, 1, '1', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '1', 1.00, 'null', 0, 0, 22.00, 0, 1, '2025-02-22', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(26, 1, '2', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '2', 2.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 1.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(29, 1, '2', 'Masculino', '', '', '', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '2', 2.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.00, 0, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(30, 1, '1', 'Infantil', '', '', '', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '1', 1.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.00, 0, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(31, 1, '2', 'Calçados', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '2', 2.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.50, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(32, 1, '3', 'Infantil', '', '', '', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '3', 3.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.00, 0, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(33, 1, '1', 'Acessórios', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '1', 1.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(34, 1, '2', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '2', 2.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(35, 1, '3', 'Acessórios', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', '3', 3.00, 'null', 0, 0, 22.00, 0, 1, '0000-00-00', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(36, 1, 'Produto de teste', 'Calçados', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', 'produto de teste', 244.40, 'null', 0, 0, 0.00, 12, 1, '0000-00-00', '0000-00-00', 0.00, 2, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(101, 1, 'Calça 3', 'Calças', '', '', 'masculino', 'Seminovo', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', 'Calça 3', 1.00, 'null', 0, 0, 0.00, 0, 1, '0000-00-00', '0000-00-00', 0.00, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(102, 1, 'Calça', 'Calças', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', 'Calça', 1.00, 'null', 0, 0, 0.00, 0, 1, '0000-00-00', '2025-03-26', 0.99, 21, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(100, 1, 'Calça 2', 'Calças', '', '', 'feminino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"GG\", \"PP\"]', 'Calça 2', 1.00, 'null', 0, 0, 0.00, 0, 1, '0000-00-00', '2025-03-26', 0.99, 1, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(103, 1, 'Camiseta Básica', 'Camisetas', '', '', 'masculino', 'Novos', '[\"Branco\", \"Preto\"]', '[\"P\", \"M\", \"G\"]', 'Camiseta básica masculina em algodão.', 39.90, '[\"cartao\", \"boleto\"]', 3, 10, 15.00, 50, 100, '2025-01-01', '2025-12-31', 29.90, 5, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(104, 1, 'Calça Jeans', 'Calças', '', '', 'feminino', 'Novos', '[\"Azul\"]', '[\"36\", \"38\", \"40\"]', 'Calça jeans feminina tradicional.', 99.90, '[\"cartao\", \"boleto\"]', 6, 15, 20.00, 30, 50, '2025-01-01', '2025-12-31', 79.90, 7, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(105, 1, 'Blusa de Frio', 'camisetas', '', '', 'unissex', 'Seminovo', '[\"Cinza\", \"Preto\"]', '[\"P\", \"M\", \"G\"]', 'Blusa confortável para dias frios.', 59.90, '[\"cartao\", \"boleto\"]', 5, 12, 10.00, 25, 50, '2025-02-01', '2025-06-30', 49.90, 6, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(106, 1, 'Shorts Casual', 'Shorts', '', '', 'masculino', 'Novos', '[\"Verde\", \"Azul\"]', '[\"M\", \"G\", \"GG\"]', 'Shorts casual para o dia a dia.', 45.00, '[\"cartao\", \"boleto\"]', 4, 8, 12.00, 40, 80, '2025-03-01', '2025-07-31', 39.90, 4, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(107, 1, 'Jaqueta Esportiva', 'Jaquetas', '', '', 'masculino', 'Novos', '[\"Preto\", \"Azul\"]', '[\"M\", \"G\"]', 'Jaqueta para atividades esportivas.', 120.00, '[\"cartao\", \"boleto\"]', 6, 15, 18.00, 10, 20, '2025-01-15', '2025-12-31', 110.00, 5, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(108, 1, 'Tênis Esportivo', 'Calçados', '', '', 'unissex', 'Seminovo', '[\"Branco\", \"Preto\"]', '[\"38\", \"40\", \"42\"]', 'Tênis esportivo confortável para corrida.', 149.90, '[\"cartao\", \"boleto\"]', 5, 12, 25.00, 20, 40, '2025-03-01', '2025-06-30', 129.90, 3, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(109, 1, 'Vestido Floral', 'Vestidos', '', '', 'feminino', 'Novos', '[\"Vermelho\", \"Branco\"]', '[\"P\", \"M\", \"G\"]', 'Vestido floral para ocasiões especiais.', 129.90, '[\"cartao\", \"boleto\"]', 8, 20, 20.00, 10, 20, '2025-03-10', '2025-10-31', 119.90, 7, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(110, 1, 'Camisa Social', 'Camisas', '', '', 'masculino', 'Novos', '[\"Branco\", \"Azul\"]', '[\"M\", \"G\", \"GG\"]', 'Camisa social masculina para trabalho.', 79.90, '[\"cartao\", \"boleto\"]', 5, 10, 15.00, 35, 70, '2025-02-15', '2025-12-31', 69.90, 5, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(111, 1, 'Bermuda Jeans', 'Shorts', '', '', 'masculino', 'Seminovo', '[\"Azul\"]', '[\"M\", \"G\"]', 'Bermuda jeans confortável.', 59.90, '[\"cartao\", \"boleto\"]', 4, 8, 10.00, 30, 50, '2025-01-01', '2025-07-31', 49.90, 4, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(112, 1, 'Moletom com Capuz', 'Moletom', '', '', 'unissex', 'Novos', '[\"Cinza\", \"Preto\"]', '[\"P\", \"M\", \"G\"]', 'Moletom confortável para inverno.', 99.90, '[\"cartao\", \"boleto\"]', 6, 18, 15.00, 20, 40, '2025-01-15', '2025-12-31', 89.90, 6, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(113, 1, 'Bolsa Feminina', 'Acessórios', '', '', 'feminino', 'Novos', '[\"Preto\", \"Marrom\"]', '[\"Único\"]', 'Bolsa feminina para ocasiões especiais.', 149.90, '[\"cartao\", \"boleto\"]', 8, 20, 10.00, 15, 30, '2025-02-01', '2025-12-31', 139.90, 5, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(114, 1, 'Relógio Esportivo', 'Acessórios', '', '', 'unissex', 'Novos', '[\"Preto\"]', '[\"Único\"]', 'Relógio esportivo resistente à água.', 199.90, '[\"cartao\", \"boleto\"]', 10, 25, 15.00, 10, 20, '2025-03-10', '2025-12-31', 189.90, 3, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(115, 1, 'Chapéu de Praia', 'Acessórios', '', '', 'unissex', 'Novos', '[\"Branco\", \"Bege\"]', '[\"Único\"]', 'Chapéu leve para proteção solar.', 49.90, '[\"cartao\", \"boleto\"]', 3, 10, 5.00, 25, 50, '2025-01-01', '2025-08-31', 39.90, 4, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(116, 1, 'Cachecol', 'Acessórios', '', '', 'unissex', 'Seminovo', '[\"Vermelho\", \"Cinza\"]', '[\"Único\"]', 'Cachecol quente para o inverno.', 59.90, '[\"cartao\", \"boleto\"]', 4, 12, 8.00, 30, 60, '2025-02-01', '2025-11-30', 49.90, 5, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(117, 1, 'Óculos de Sol', 'Acessórios', '', '', 'unissex', 'Novos', '[\"Preto\"]', '[\"Único\"]', 'Óculos de sol com proteção UV.', 129.90, '[\"cartao\", \"boleto\"]', 6, 15, 12.00, 20, 40, '2025-03-01', '2025-12-31', 119.90, 6, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(118, 1, 'Camisa Polo', 'Camisas', '', '', 'masculino', 'Novos', '[\"Branco\", \"Azul\"]', '[\"P\", \"M\", \"G\"]', 'Camisa polo confortável para o dia a dia.', 59.90, '[\"cartao\", \"boleto\"]', 4, 12, 14.00, 40, 80, '2025-04-01', '2025-12-31', 49.90, 5, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(119, 1, 'Calça Legging', 'Calças', '', '', 'feminino', 'Novos', '[\"Preto\", \"Cinza\"]', '[\"P\", \"M\", \"G\"]', 'Calça legging confortável para exercícios.', 79.90, '[\"cartao\", \"boleto\"]', 5, 15, 18.00, 35, 60, '2025-01-15', '2025-12-31', 69.90, 4, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]'),
(120, 1, 'Jaqueta Jeans', 'Jaquetas', '', '', 'unissex', 'Novos', '[\"Azul\"]', '[\"P\", \"M\", \"G\"]', 'Jaqueta jeans estilosa.', 119.90, '[\"cartao\", \"boleto\"]', 6, 20, 22.00, 20, 30, '2025-02-01', '2025-12-31', 109.90, 5, '[\"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\", \"http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png\"]');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pessoa` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pessoa` (`id_pessoa`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `id_pessoa`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `vendedores`
--

DROP TABLE IF EXISTS `vendedores`;
CREATE TABLE IF NOT EXISTS `vendedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_pessoa` int NOT NULL,
  `store_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cnpj` varchar(14) COLLATE utf8mb4_general_ci NOT NULL,
  `telefone` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `banner` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `items_for_sale` int NOT NULL,
  `items_sold` int NOT NULL,
  `seller_description` varchar(400) COLLATE utf8mb4_general_ci NOT NULL,
  `opening_hours` time NOT NULL,
  `closing_time` time NOT NULL,
  `weekend` tinyint(1) NOT NULL,
  `url` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_pessoa` (`id_pessoa`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vendedores`
--

INSERT INTO `vendedores` (`id`, `id_pessoa`, `store_name`, `cnpj`, `telefone`, `banner`, `items_for_sale`, `items_sold`, `seller_description`, `opening_hours`, `closing_time`, `weekend`, `url`) VALUES
(1, 2, 'Teste de lova Nova', '11111111111111', '', '', 0, 0, '', '00:00:00', '00:00:00', 0, 'teste_de_lova_nova');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `produtos`
--
ALTER TABLE `produtos` ADD FULLTEXT KEY `productName` (`productName`,`description`,`category`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
