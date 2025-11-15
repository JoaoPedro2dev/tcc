-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 15/11/2025 às 01:00
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
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `carrinhos`
--

INSERT INTO `carrinhos` (`id`, `userId`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- --------------------------------------------------------

--
-- Estrutura para tabela `carrinho_itens`
--

DROP TABLE IF EXISTS `carrinho_itens`;
CREATE TABLE IF NOT EXISTS `carrinho_itens` (
  `itemId` int NOT NULL AUTO_INCREMENT,
  `cartId` int NOT NULL,
  `productId` int NOT NULL,
  `cor` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `tamanho` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`itemId`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `compras`
--

DROP TABLE IF EXISTS `compras`;
CREATE TABLE IF NOT EXISTS `compras` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int NOT NULL,
  `cpf_cliente` varchar(14) COLLATE utf8mb4_general_ci NOT NULL,
  `id_loja` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `endereco_entrega` text COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_endereco` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `forma_pagamento` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `preco_total` decimal(10,2) NOT NULL,
  `id_cartao` int DEFAULT NULL,
  `parcelas` int DEFAULT NULL,
  `valor_parcelas` decimal(10,2) DEFAULT NULL,
  `frete_total` decimal(10,2) NOT NULL,
  `link_nfe` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `data_compra` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_compra`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_loja` (`id_loja`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `compras`
--

INSERT INTO `compras` (`id_compra`, `id_cliente`, `cpf_cliente`, `id_loja`, `endereco_entrega`, `tipo_endereco`, `forma_pagamento`, `preco_total`, `id_cartao`, `parcelas`, `valor_parcelas`, `frete_total`, `link_nfe`, `data_compra`) VALUES
(1, 5, '11111111115', '[1]', 'Rua Hugo Pascolat, 23 - Jardim Santa Terezinha, Jaú - SP, 17205310', NULL, 'pix', 161.79, 0, 0, 0.00, 12.00, NULL, '2025-11-13 21:04:27'),
(2, 5, '11111111115', '[1]', 'Rua Hugo Pascolat, 23 - Jardim Santa Terezinha, Jaú - SP, 17205310', NULL, 'cartao', 80.85, 1, 6, 13.48, 8.00, NULL, '2025-11-14 13:35:05');

-- --------------------------------------------------------

--
-- Estrutura para tabela `historico`
--

DROP TABLE IF EXISTS `historico`;
CREATE TABLE IF NOT EXISTS `historico` (
  `id_historico` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `produto_id` int NOT NULL,
  `data_visita` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_historico`),
  KEY `user_id` (`user_id`),
  KEY `produto_id` (`produto_id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `historico`
--

INSERT INTO `historico` (`id_historico`, `user_id`, `produto_id`, `data_visita`) VALUES
(1, 1, 1, '2025-11-11 20:14:28'),
(3, 1, 2, '2025-11-12 14:13:16'),
(4, 1, 3, '2025-11-12 14:56:07'),
(5, 1, 4, '2025-11-12 21:47:49'),
(6, 1, 6, '2025-11-12 21:58:07'),
(7, 1, 7, '2025-11-12 22:02:25'),
(8, 1, 8, '2025-11-13 14:04:02'),
(9, 1, 8, '2025-11-13 14:04:02'),
(10, 1, 9, '2025-11-13 14:10:30'),
(11, 1, 10, '2025-11-13 14:18:53'),
(12, 1, 11, '2025-11-13 18:23:16'),
(13, 3, 9, '2025-11-13 19:20:02'),
(19, 5, 1, '2025-11-14 20:23:40'),
(18, 5, 2, '2025-11-14 19:16:39'),
(17, 5, 9, '2025-11-14 19:16:33');

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens_compra`
--

DROP TABLE IF EXISTS `itens_compra`;
CREATE TABLE IF NOT EXISTS `itens_compra` (
  `id_item` int NOT NULL AUTO_INCREMENT,
  `id_compra` int NOT NULL,
  `id_produto` int NOT NULL,
  `seller_id` int NOT NULL,
  `product_name` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `product_image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `quantidade` int NOT NULL,
  `cor` varchar(185) COLLATE utf8mb4_general_ci NOT NULL,
  `tamanho` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `preco_promocao` decimal(10,2) DEFAULT NULL,
  `frete` decimal(10,2) NOT NULL,
  `fatia_dnvwear` decimal(10,2) NOT NULL,
  `total_produto` decimal(10,2) NOT NULL,
  `data_previsao` date NOT NULL,
  `data_entregue` date DEFAULT NULL,
  `status` enum('pendente','confirmado','em transporte','entregue','cancelado','chegara hoje','chegou','não recebido') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `motivo_cancelamento` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quem_cancelou` enum('DNV WEAR','VENDEDOR','CLIENTE','ERRO PAGAMENTO') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quem_entrega` varchar(185) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `recebido_por` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_item`),
  KEY `id_compra` (`id_compra`),
  KEY `id_produto` (`id_produto`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `itens_compra`
--

INSERT INTO `itens_compra` (`id_item`, `id_compra`, `id_produto`, `seller_id`, `product_name`, `product_image`, `quantidade`, `cor`, `tamanho`, `preco_unitario`, `preco_promocao`, `frete`, `fatia_dnvwear`, `total_produto`, `data_previsao`, `data_entregue`, `status`, `motivo_cancelamento`, `quem_cancelou`, `quem_entrega`, `recebido_por`) VALUES
(1, 1, 2, 1, 'Calça Jeans Boca Balão', 'http://localhost/tcc/API/UPLOADS/images/img_69139a6d299914.62452522.png', 1, 'Preto', '52', 110.00, 89.99, 12.00, 0.00, 101.99, '2025-11-20', NULL, 'cancelado', 'Erro no pedido', 'CLIENTE', NULL, NULL),
(2, 1, 9, 1, 'Camiseta Basic Masculina Slim-shap', 'http://localhost/tcc/API/UPLOADS/images/img_6915e6b34f7fd1.59886088.jpg', 1, 'Marrom', 'M', 59.80, NULL, 0.00, 0.00, 59.80, '2025-11-16', NULL, 'confirmado', 'Não quero mais a compra', 'CLIENTE', 'Correios', NULL),
(3, 2, 3, 1, 'Tênis Hokes', 'http://localhost/tcc/API/UPLOADS/images/img_69149f95713323.37622474.jpg', 1, 'Preto', '40', 72.85, NULL, 8.00, 0.00, 80.85, '2025-11-17', NULL, 'entregue', NULL, NULL, 'seller', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `payment_cards`
--

DROP TABLE IF EXISTS `payment_cards`;
CREATE TABLE IF NOT EXISTS `payment_cards` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `encrypted_pan` text COLLATE utf8mb4_general_ci NOT NULL,
  `encrypted_cvv` text COLLATE utf8mb4_general_ci,
  `brand` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `last4` char(4) COLLATE utf8mb4_general_ci NOT NULL,
  `exp_month` tinyint UNSIGNED DEFAULT NULL,
  `exp_year` smallint UNSIGNED DEFAULT NULL,
  `cardholder_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `payment_cards`
--

INSERT INTO `payment_cards` (`id`, `user_id`, `encrypted_pan`, `encrypted_cvv`, `brand`, `last4`, `exp_month`, `exp_year`, `cardholder_name`, `created_at`) VALUES
(1, 5, '73d64e377c1b7c21c516775895457c475a6adc5c', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', 'visa', '4343', 11, 99, 'PRIMEIRO USUARIO', '2025-11-14 16:34:42');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pessoas`
--

DROP TABLE IF EXISTS `pessoas`;
CREATE TABLE IF NOT EXISTS `pessoas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nivel_acesso` enum('admin','usuario','vendedor') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `profile_photo` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cpf` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_birth` date NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rua` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bairro` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cidade` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uf` char(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cep` char(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `num_residencia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `complemento` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `agreement` enum('concordou') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'concordou',
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `unique_username` (`username`),
  UNIQUE KEY `unique_cpf` (`cpf`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pessoas`
--

INSERT INTO `pessoas` (`id`, `nivel_acesso`, `name`, `profile_photo`, `first_name`, `last_name`, `username`, `cpf`, `email`, `telefone`, `date_birth`, `address`, `password`, `rua`, `bairro`, `cidade`, `uf`, `cep`, `num_residencia`, `complemento`, `criado_em`, `agreement`, `active`) VALUES
(1, 'vendedor', 'Vendedor Teste', 'http://localhost/tcc/API/UPLOADS/profilePhotos/img_69174983301a61.55322893.png', 'Vendedor', 'Teste', 'vendedor_teste', '11111111111', 'vendedor@gmail.com', '11111111111', '1999-12-10', 'Avenida Ayrton Senna, 12312 - Centro, Jaú - SP, 17201045', '54b869057f5253a9c3b201428befe69d050e65cd', 'Avenida Ayrton Senna', 'Centro', 'Jaú', 'SP', '17201045', '12312', NULL, '2025-11-11 19:59:30', 'concordou', NULL),
(2, 'vendedor', 'João Miguel', 'http://localhost/tcc/API/UPLOADS/profilePhotos/imgPadrao.png', 'João', 'Miguel', 'joao_miguel', '22222222222', 'joaomiguel@gmail.com', '22222222222', '1999-09-12', NULL, 'c9bd2d9a328ea9af3891aa0b2befa3eb1277dc6e', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-11 20:01:12', 'concordou', NULL),
(3, 'vendedor', 'Carlos Eduardo', 'http://localhost/tcc/API/UPLOADS/profilePhotos/imgPadrao.png', 'Carlos', 'Eduardo', 'carlos_eduardo', '33333333333', 'carlos@gmail.com', '33333333333', '1999-07-02', NULL, '71b8678db9700b5aab5aaa28da77190ba5ce8f50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-11 20:02:24', 'concordou', NULL),
(4, 'vendedor', 'Pedro Vidotti', 'http://localhost/tcc/API/UPLOADS/profilePhotos/imgPadrao.png', 'Pedro', 'Vidotti', 'pedro_vidotti', '44444444444', 'pedro@gmail.com', '44444444444', '1999-04-22', NULL, '985875236522bc2da97e551b6f9ed44438608e90', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-11 20:05:04', 'concordou', NULL),
(5, 'usuario', 'Primeiro Cliente', 'http://localhost/tcc/API/UPLOADS/profilePhotos/imgPadrao.png', 'Primeiro', 'Cliente', 'primeiro_cliente', '11111111115', 'primeirocliente@gmail.com', NULL, '1111-11-11', 'Rua Hugo Pascolat, 23 - Jardim Santa Terezinha, Jaú - SP, 17205310', '54b869057f5253a9c3b201428befe69d050e65cd', 'Rua Hugo Pascolat', 'Jardim Santa Terezinha', 'Jaú', 'SP', '17205310', '23', NULL, '2025-11-13 23:55:58', 'concordou', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `public_id` mediumtext COLLATE utf8mb4_general_ci NOT NULL,
  `sellerId` int NOT NULL,
  `productName` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `subCategory` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `style` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `brand` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('Masculino','Feminino','Unissex') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `condition` enum('Novos','Usados','Seminovos') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `shippingCost` double(10,2) NOT NULL,
  `salesQuantity` int NOT NULL,
  `stockTotal` int NOT NULL,
  `promotionStartDate` date DEFAULT NULL,
  `promotionEndDate` date DEFAULT NULL,
  `promotionPrice` decimal(10,2) DEFAULT NULL,
  `deliveryTime` int NOT NULL,
  `images` json NOT NULL,
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produtos`
--

INSERT INTO `produtos` (`id`, `public_id`, `sellerId`, `productName`, `category`, `subCategory`, `style`, `brand`, `gender`, `condition`, `description`, `price`, `shippingCost`, `salesQuantity`, `stockTotal`, `promotionStartDate`, `promotionEndDate`, `promotionPrice`, `deliveryTime`, `images`, `data_criacao`) VALUES
(1, 'VDNVW-0000001', 1, 'Camiseta Do Cristiano Ronaldo Preto E Branco', 'Camisas', 'Camiseta', 'Esportivo', 'Nike', 'Unissex', 'Novos', 'Camiseta do Cristiano Ronaldo preto e branco 100% Poliéster 1% Algodão.\r\n\r\nÓtima para praticar esportes como jogar bola e basquete.', 32.77, 5.11, 0, 0, NULL, NULL, NULL, 7, '[\"http://localhost/tcc/API/UPLOADS/images/img_69139918784d63.29717804.png\"]', '2025-11-11 17:14:16'),
(2, 'VDNVW-0000002', 1, 'Calça Jeans Boca Balão', 'Calças', 'Calça', 'Casual', 'Dafiti', 'Feminino', 'Novos', 'Calça Jeans disponível em duas cores, cinza e preto. \r\n\r\nCós elástico, zíper de carbono.', 110.00, 12.00, 0, 0, '2025-11-12', '2025-11-13', 89.99, 7, '[\"http://localhost/tcc/API/UPLOADS/images/img_69139a6d299914.62452522.png\", \"http://localhost/tcc/API/UPLOADS/images/img_69139a6d2a8703.84386859.png\"]', '2025-11-11 17:19:57'),
(3, 'VDNVW-0000003', 1, 'Tênis Hokes', 'Calçados', 'Tênis', 'De Luxo', 'Hokes', 'Unissex', 'Seminovos', 'O Tênis Hokes Preto une sofisticação e conforto em um design luxuoso e atemporal. Desenvolvido com materiais de alta qualidade, apresenta acabamento refinado, solado leve e ótima durabilidade. Seu estilo unissex o torna ideal para compor diferentes tipos de looks — do casual ao elegante. Um modelo que traduz exclusividade e bom gosto.', 72.85, 8.00, 0, 0, NULL, NULL, NULL, 3, '[\"http://localhost/tcc/API/UPLOADS/images/img_69149f95713323.37622474.jpg\", \"http://localhost/tcc/API/UPLOADS/images/img_69149f95724115.70287652.webp\"]', '2025-11-12 11:54:13'),
(4, 'VDNVW-0000004', 1, 'Tênis New Balance 512', 'Calçados', 'Tênis', 'Esportivo', 'New Balance', 'Unissex', 'Novos', '🏃‍♂️ Tênis New Balance 512\r\n\r\nO Tênis New Balance 512 combina conforto, estilo e desempenho para o seu dia a dia. Desenvolvido com materiais de alta qualidade, ele oferece leveza, respirabilidade e amortecimento ideal para acompanhar seu ritmo — seja nas atividades esportivas ou no uso casual.\r\n\r\nSeu design moderno e versátil traz o clássico visual da New Balance, com acabamento premium e solado antiderrapante, garantindo segurança e estabilidade a cada passo.\r\n\r\n✅ Características:\r\n\r\nCabedal em tecido respirável e material sintético de alta durabilidade\r\n\r\nPalmilha macia com excelente absorção de impacto\r\n\r\nSolado de borracha que proporciona aderência e tração\r\n\r\nDesign versátil, ideal para esporte e casual\r\n\r\nLogo New Balance em destaque\r\n\r\n👟 Indicado para: caminhadas, treinos leves e uso diário.', 122.82, 24.00, 0, 0, NULL, NULL, NULL, 7, '[\"http://localhost/tcc/API/UPLOADS/images/img_6915007c1fdbd6.63545523.webp\", \"http://localhost/tcc/API/UPLOADS/images/img_6915007c209792.21046606.jpg\"]', '2025-11-12 18:47:40'),
(5, 'VDNVW-0000005', 1, 'Tênis All Star - Preto - Usado', 'Calçados', 'Tênis', 'Casual', 'All Star', 'Feminino', 'Usados', '🖤 Tênis All Star - Preto\r\n\r\nClássico, versátil e cheio de atitude. O Tênis All Star Preto é aquele modelo indispensável que combina com qualquer estilo. Produzido com materiais resistentes e acabamento de qualidade, oferece conforto e durabilidade para o dia a dia.\r\n\r\nSeu design atemporal traz o icônico visual da Converse, com solado de borracha vulcanizada e cabedal em lona, garantindo leveza e respirabilidade. Perfeito para quem busca um visual casual e autêntico.\r\n\r\n✅ Características:\r\n\r\nCabedal em lona resistente e respirável\r\n\r\nSolado de borracha para melhor aderência\r\n\r\nPalmilha macia e confortável\r\n\r\nDesign unissex e fácil de combinar\r\n\r\nClássico logo All Star no calcanhar\r\n\r\n👟 Indicado para: uso casual, passeios e momentos do dia a dia.', 72.00, 10.00, 0, 0, NULL, NULL, NULL, 4, '[\"http://localhost/tcc/API/UPLOADS/images/img_69150144d0cc37.06868580.webp\", \"http://localhost/tcc/API/UPLOADS/images/img_69150144d147a3.19293354.webp\"]', '2025-11-12 18:51:00'),
(6, 'VDNVW-0000006', 1, 'Tênis Adidas Grandcourt - Perfeito Para Eventos Casuais', 'Calçados', 'Tênis', 'Casual', 'Adidas', 'Unissex', 'Novos', '⚪ Tênis Adidas Grandcourt – Perfeito para Eventos Casuais\r\n\r\nO Tênis Adidas Grandcourt une o estilo clássico da marca com o conforto ideal para o seu dia a dia. Inspirado nos modelos retrô das quadras, ele traz um design limpo e elegante que combina perfeitamente com looks casuais e ocasiões sociais leves.\r\n\r\nCom cabedal em material sintético de alta qualidade e solado de borracha durável, oferece estabilidade e conforto a cada passo. Seu visual minimalista com as tradicionais três listras da Adidas garante um toque de sofisticação sem abrir mão do conforto.\r\n\r\n✅ Características:\r\n\r\nCabedal sintético resistente e fácil de limpar\r\n\r\nPalmilha macia com tecnologia de amortecimento\r\n\r\nSolado de borracha antiderrapante\r\n\r\nDesign moderno e versátil\r\n\r\nIdeal para compor looks casuais e elegantes\r\n\r\n👟 Indicado para: eventos casuais, passeios e uso diário com estilo.', 173.00, 7.00, 0, 0, NULL, NULL, NULL, 2, '[\"http://localhost/tcc/API/UPLOADS/images/img_691502e98d5281.39580329.jpg\", \"http://localhost/tcc/API/UPLOADS/images/img_691502e98db981.93498551.jpg\"]', '2025-11-12 18:58:01'),
(7, 'VDNVW-0000007', 1, 'Nilke Court Vision Preto Usado, Perfeito Para Esportes', 'Calçados', 'Tênis', 'Esportivo', 'Nike', 'Unissex', 'Seminovos', '⚫ Tênis Nike Court Vision Preto – Para Esportes\r\n\r\nO Tênis Nike Court Vision Preto é a escolha certa para quem busca performance, conforto e estilo esportivo em um só modelo. Inspirado no design clássico do basquete, ele combina materiais resistentes e tecnologia moderna para garantir suporte e durabilidade durante o uso.\r\n\r\nCom cabedal em couro sintético e tecido respirável, o Court Vision oferece ajuste firme e confortável, enquanto o solado de borracha com tração aprimorada assegura estabilidade em diferentes superfícies. Seu visual totalmente preto traz versatilidade e um toque de elegância esportiva.\r\n\r\n✅ Características:\r\n\r\nCabedal em couro sintético e tecido respirável\r\n\r\nSolado de borracha com excelente aderência\r\n\r\nPalmilha macia para conforto prolongado\r\n\r\nDesign clássico com toque moderno\r\n\r\nIdeal para práticas esportivas e uso casual\r\n\r\n👟 Indicado para: treinos, caminhadas e uso esportivo no dia a dia.', 89.99, 10.00, 0, 0, NULL, NULL, NULL, 6, '[\"http://localhost/tcc/API/UPLOADS/images/img_691503c6ca63b2.12345140.webp\", \"http://localhost/tcc/API/UPLOADS/images/img_691503c6ca9930.16138144.webp\"]', '2025-11-12 19:01:42'),
(8, 'VDNVW-0000008', 1, 'Kit 3 Camisas T-Shirt Básicas Masculinas', 'Camisas', 'Camiseta', 'Esportivo', 'Basic PRO', 'Masculino', 'Novos', '👕 Kit 3 Camisas T-Shirt Básicas\r\n\r\nPraticidade, conforto e estilo em um só kit! O Kit com 3 Camisas T-Shirt Básicas é perfeito para quem valoriza peças versáteis e de alta qualidade. Produzidas em malha macia e respirável, essas camisetas garantem conforto o dia todo, seja para o trabalho, lazer ou treino.\r\n\r\nCom modelagem clássica e caimento leve, elas combinam facilmente com qualquer look — do casual ao esportivo. Um item essencial no guarda-roupa de quem busca simplicidade com estilo.\r\n\r\n✅ Características:\r\n\r\nKit com 3 camisetas básicas (cores variadas ou únicas)\r\n\r\nTecido leve, macio e de alta durabilidade\r\n\r\nModelagem confortável e versátil\r\n\r\nIdeal para o dia a dia e momentos casuais\r\n\r\nAcabamento reforçado nas costuras\r\n\r\n👕 Indicado para: uso diário, combinações casuais e treinos leves.', 99.90, 0.00, 0, 0, NULL, NULL, NULL, 3, '[\"http://localhost/tcc/API/UPLOADS/images/img_6915e54d117556.23062958.png\"]', '2025-11-13 11:03:57'),
(9, 'VDNVW-0000009', 1, 'Camiseta Basic Masculina Slim-shap', 'Camisas', 'Camiseta', 'Casual', 'Basic PRO', 'Masculino', 'Novos', '👕 Camiseta Basic Masculina Slim Shape\r\n\r\nA Camiseta Basic Masculina Slim Shape combina conforto, estilo e um caimento que valoriza o corpo. Produzida com tecido leve, macio e elástico, oferece liberdade de movimento e um visual moderno para qualquer ocasião.\r\n\r\nCom modelagem slim, ela se ajusta ao corpo de forma natural, realçando a silhueta sem perder o conforto. Ideal para compor looks casuais, esportivos ou até sociais com uma pegada minimalista.\r\n\r\n✅ Características:\r\n\r\nTecido de alta qualidade, macio e respirável\r\n\r\nModelagem slim que valoriza o corpo\r\n\r\nAcabamento reforçado e durável\r\n\r\nDesign básico e versátil\r\n\r\nIdeal para qualquer estação\r\n\r\n👕 Indicado para: uso casual, treinos ou composições modernas no dia a dia.', 59.80, 0.00, 0, 0, NULL, NULL, NULL, 3, '[\"http://localhost/tcc/API/UPLOADS/images/img_6915e6b34f7fd1.59886088.jpg\"]', '2025-11-13 11:09:55'),
(10, 'VDNVW-0000010', 1, 'Camisa Básica Unissex', 'Camisas', 'Camiseta', 'Casual', 'Article Shirt', 'Unissex', 'Novos', 'Camisa Básica Unissex\r\n\r\nA Camisa Básica Unissex é a escolha perfeita para quem busca conforto, praticidade e estilo versátil. Feita com tecido macio e respirável, oferece sensação agradável ao vestir e combina facilmente com qualquer look.\r\n\r\nCom modelagem tradicional e acabamento de qualidade, é ideal para o dia a dia, trabalho ou momentos de lazer. Um item essencial que nunca sai de moda!\r\n\r\n✅ Características:\r\n\r\nTecido leve, macio e de alta durabilidade\r\n\r\nModelagem unissex, ideal para todos os estilos\r\n\r\nAcabamento reforçado nas costuras\r\n\r\nDesign básico e fácil de combinar\r\n\r\nDisponível em diversas cores\r\n\r\n👕 Indicado para: uso diário, casual e combinações simples e estilosas.', 50.00, 0.00, 0, 0, '2025-11-13', '2025-11-22', 29.87, 7, '[\"http://localhost/tcc/API/UPLOADS/images/img_6915e8aa865a15.01189284.jpg\", \"http://localhost/tcc/API/UPLOADS/images/img_6915e8aa86c747.14180084.webp\"]', '2025-11-13 11:18:18'),
(11, 'VDNVW-0000011', 1, 'Camiseta Oversized Básica', 'Camisas', 'Camiseta', 'De Luxo', 'Oversized Shirts', 'Unissex', 'Novos', '👕 Camiseta Oversized Básica de Luxo\r\n\r\nA Camiseta Oversized Básica de Luxo une conforto, sofisticação e estilo urbano em uma peça essencial. Confeccionada com tecido premium de alta gramatura, oferece toque suave, excelente caimento e durabilidade superior.\r\n\r\nSeu design oversized garante um visual moderno e despojado, enquanto o acabamento refinado eleva o padrão da camiseta básica tradicional. Ideal para quem busca minimalismo com elegância.\r\n\r\n✅ Características:\r\n\r\nTecido premium, macio e resistente\r\n\r\nModelagem oversized com caimento solto e confortável\r\n\r\nGola reforçada e costuras de alta qualidade\r\n\r\nDesign minimalista e sofisticado\r\n\r\nToque suave e aparência de luxo\r\n\r\n👕 Indicado para: uso casual, streetwear e combinações modernas com estilo.', 129.99, 6.50, 0, 0, NULL, NULL, NULL, 5, '[\"http://localhost/tcc/API/UPLOADS/images/img_6915ea056b4704.05428478.webp\", \"http://localhost/tcc/API/UPLOADS/images/img_6915ea056ba011.48526336.jpg\"]', '2025-11-13 11:24:05');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos_itens`
--

DROP TABLE IF EXISTS `produtos_itens`;
CREATE TABLE IF NOT EXISTS `produtos_itens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_produto` int NOT NULL,
  `cor` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `stock_cor` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produtos_itens`
--

INSERT INTO `produtos_itens` (`id`, `id_produto`, `cor`, `stock_cor`) VALUES
(1, 1, 'Preto', 56),
(2, 2, 'Cinza', 67),
(3, 2, 'Preto', 82),
(4, 3, 'Preto', 66),
(5, 4, 'Branco', 40),
(6, 4, 'Marrom', 37),
(7, 5, 'Preto', 132),
(8, 6, 'Branco', 133),
(9, 6, 'Azul Celeste', 74),
(10, 7, 'Preto', 84),
(11, 8, 'Azul', 250),
(12, 8, 'Preto', 250),
(13, 8, 'Branco', 250),
(14, 9, 'Marrom', 119),
(15, 10, 'Preto', 170),
(16, 10, 'Branco', 109),
(17, 11, 'Verde', 90),
(18, 11, 'Marrom', 128);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos_variacoes`
--

DROP TABLE IF EXISTS `produtos_variacoes`;
CREATE TABLE IF NOT EXISTS `produtos_variacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_item` int NOT NULL,
  `tamanho` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produtos_variacoes`
--

INSERT INTO `produtos_variacoes` (`id`, `id_item`, `tamanho`, `quantity`) VALUES
(1, 1, 'M', 16),
(2, 1, 'G', 19),
(3, 1, 'GG', 21),
(4, 2, '42', 15),
(5, 2, '34', 33),
(6, 2, '46', 5),
(7, 2, '52', 14),
(8, 3, '42', 20),
(9, 3, '34', 22),
(10, 3, '46', 20),
(11, 3, '52', 20),
(12, 4, '35', 11),
(13, 4, '39', 5),
(14, 4, '41', 8),
(15, 4, '42', 20),
(16, 4, '40', 22),
(17, 5, '35', 10),
(18, 5, '37', 10),
(19, 5, '40', 20),
(20, 6, '35', 22),
(21, 6, '37', 10),
(22, 6, '40', 5),
(23, 7, '33', 25),
(24, 7, '35', 10),
(25, 7, '37', 11),
(26, 7, '40', 21),
(27, 7, '38', 65),
(28, 8, '33', 22),
(29, 8, '35', 45),
(30, 8, '37', 20),
(31, 8, '40', 30),
(32, 8, '38', 11),
(33, 8, '42', 5),
(34, 9, '35', 10),
(35, 9, '37', 23),
(36, 9, '38', 40),
(37, 9, '42', 1),
(38, 10, '41', 20),
(39, 10, '40', 10),
(40, 10, '38', 11),
(41, 10, '35', 43),
(42, 11, 'PP', 50),
(43, 11, 'M', 50),
(44, 11, 'GG', 50),
(45, 11, 'G', 50),
(46, 11, 'P', 50),
(47, 12, 'PP', 50),
(48, 12, 'M', 50),
(49, 12, 'GG', 50),
(50, 12, 'G', 50),
(51, 12, 'P', 50),
(52, 13, 'PP', 50),
(53, 13, 'M', 50),
(54, 13, 'GG', 50),
(55, 13, 'G', 50),
(56, 13, 'P', 50),
(57, 14, 'PP', 25),
(58, 14, 'M', 44),
(59, 14, 'G', 50),
(60, 15, 'P', 10),
(61, 15, 'M', 55),
(62, 15, 'G', 55),
(63, 15, 'GG', 50),
(64, 16, 'P', 22),
(65, 16, 'M', 30),
(66, 16, 'G', 35),
(67, 16, 'GG', 22),
(68, 17, 'M', 22),
(69, 17, 'GG', 10),
(70, 17, 'XGG', 10),
(71, 17, 'G', 5),
(72, 17, 'XG', 33),
(73, 17, 'Plus Size', 10),
(74, 18, 'M', 40),
(75, 18, 'GG', 23),
(76, 18, 'XGG', 20),
(77, 18, 'G', 20),
(78, 18, 'XG', 20),
(79, 18, 'Plus Size', 5);

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
(1, 5);

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
  `telefone_contato` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `banner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `itens_sold` int NOT NULL,
  `seller_description` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `open_hours` time DEFAULT NULL,
  `close_hours` time DEFAULT NULL,
  `weekend` enum('nao','sim') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'nao',
  `url` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `store_address` varchar(355) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rua` varchar(180) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bairro` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cidade` varchar(180) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `uf` varchar(3) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cep` varchar(9) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `num_loja` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `complemento` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_pessoa` (`id_pessoa`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vendedores`
--

INSERT INTO `vendedores` (`id`, `id_pessoa`, `store_name`, `cnpj`, `telefone_contato`, `banner`, `itens_sold`, `seller_description`, `open_hours`, `close_hours`, `weekend`, `url`, `store_address`, `rua`, `bairro`, `cidade`, `uf`, `cep`, `num_loja`, `complemento`, `criado_em`) VALUES
(1, 1, 'ATELIER STORE', '11111111111111', '14111111111', 'http://localhost/tcc/API/UPLOADS/profilePhotos/img_691749832dc336.21535634.png', 0, 'Curadoria de luxo minimalista. Encontre peças de moda e acessórios com design atemporal, qualidade excepcional e a sofisticação que define o seu estilo. Descubra a elegância redefinida.', '10:23:00', '16:00:00', 'nao', 'atelier_store', 'Rua Conde do Pinhal, 44 - Centro, Jaú - SP, 17201040', 'Rua Conde do Pinhal', 'Centro', 'Jaú', 'SP', '17201040', '44', '', '2025-11-11 16:59:30'),
(2, 2, 'João Miguel STORE', '22222222222222', '14991202191', NULL, 0, NULL, '02:00:00', '13:30:00', 'nao', 'joão_miguel_store', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-11 17:01:12'),
(3, 3, 'Carlos STORE', '33333333333333', NULL, NULL, 0, NULL, '08:00:00', '16:00:00', 'nao', 'carlos_store', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-11 17:02:24'),
(4, 4, 'Pedro STORE', '44444444444444', NULL, NULL, 0, NULL, '07:00:00', '19:00:00', 'nao', 'pedro_store', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-11 17:05:04');

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
