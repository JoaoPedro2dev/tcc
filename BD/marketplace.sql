-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 02/06/2025 às 23:34
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
  `id_carrinho` int NOT NULL AUTO_INCREMENT,
  `id_produto` int NOT NULL,
  `id_usuario` int NOT NULL,
  `quantidade` int NOT NULL,
  PRIMARY KEY (`id_carrinho`)
) ENGINE=MyISAM AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `carrinhos`
--

INSERT INTO `carrinhos` (`id_carrinho`, `id_produto`, `id_usuario`, `quantidade`) VALUES
(3, 20, 0, 1),
(4, 36, 0, 3),
(66, 64, 1, 34),
(47, 58, 87, 1),
(48, 62, 87, 1);

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
-- Estrutura para tabela `produtos`
--

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_vendedor` int NOT NULL,
  `produto_nome` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `categoria` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `genero` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `condicao` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cores_disponiveis` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tamanhos_disponiveis` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `frete` double(10,2) NOT NULL,
  `quantidade_vendas` int NOT NULL,
  `data_inicio_promocao` date NOT NULL,
  `data_final_promocao` date NOT NULL,
  `valor_promocao` decimal(10,2) NOT NULL,
  `prazo_entrega` int NOT NULL,
  `foto_1` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `foto_2` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `foto_3` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produtos`
--

INSERT INTO `produtos` (`id`, `id_vendedor`, `produto_nome`, `categoria`, `genero`, `condicao`, `cores_disponiveis`, `tamanhos_disponiveis`, `descricao`, `preco`, `frete`, `quantidade_vendas`, `data_inicio_promocao`, `data_final_promocao`, `valor_promocao`, `prazo_entrega`, `foto_1`, `foto_2`, `foto_3`) VALUES
(99, 3, 'Calça 1', 'calcas', 'unissex', 'novo', 'Preto,Azul', '36,38,40,42,46', 'Calça 1', 12.00, 0.01, 0, '0000-00-00', '0000-00-00', 0.00, 12, 'http://localhost/marketplace/fotoProdutos/67e3395e4c0c5.png', 'http://localhost/marketplace/fotoProdutos/67e3395e4c0c7.png', 'http://localhost/marketplace/fotoProdutos/67e3395e4c0c8.png'),
(97, 3, 'Meu produto', 'camisetas', 'masculino', 'novo', 'Preto', 'PP', 'Meu produto 1', 2.50, 0.00, 0, '0000-00-00', '0000-00-00', 0.00, 1, 'http://localhost/marketplace/fotoProdutos/67e07d9410cdf.png', 'http://localhost/marketplace/fotoProdutos/67e07d9410ce1.png', 'http://localhost/marketplace/fotoProdutos/67e07d9410ce2.png'),
(28, 1, '1', 'camisetas', 'masculino', 'Novo', 'Preto,Vermelho', 'PP,P', '1', 1.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.00, 1, ' http://localhost/marketplace/fotoProdutos/67dcafa83422f.png', ' http://localhost/marketplace/fotoProdutos/67dcafa834523.png', ' http://localhost/marketplace/fotoProdutos/67dcafa8347e8.png'),
(18, 1, 'bolo de café 1', 'camisetas', 'masculino', 'novo', 'Preto', 'P', 'bolo de café recheado com chantily', 12.53, 22.00, 0, '2025-02-22', '0000-00-00', 0.00, 1, 'http://localhost/marketplace/fotoProdutos/67e34964a63e4.png', 'http://localhost/marketplace/fotoProdutos/67e34964a741b.png', 'http://localhost/marketplace/fotoProdutos/67e34964a7c9f.png'),
(19, 1, 'Pão', 'camisetas', 'masculino', 'Novo', 'Vermelho', 'M', 'pão de 500g', 5.44, 22.00, 0, '0000-00-00', '0000-00-00', 0.00, 3, ' http://localhost/marketplace/fotoProdutos/67d34ca43b864.png', ' http://localhost/marketplace/fotoProdutos/67d34ca43bc02.png', ' http://localhost/marketplace/fotoProdutos/67d34ca43c004.png'),
(21, 1, 'Coca-cola', 'camisetas', 'masculino', 'Novo', 'Preto', 'PP', 'coca-cola 300ml', 3.00, 22.00, 0, '2025-02-22', '0000-00-00', 0.00, 1, ' http://localhost/marketplace/fotoProdutos/67dca82e1cd08.png', ' http://localhost/marketplace/fotoProdutos/67dca82e1cfb4.png', ' http://localhost/marketplace/fotoProdutos/67dca82e1d26a.png'),
(22, 1, 'item 1', 'shorts', 'masculino', 'Novo', 'Preto,Vermelho', 'PP,G', '1', 1.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.99, 1, ' http://localhost/marketplace/fotoProdutos/67dca92bc381c.png', ' http://localhost/marketplace/fotoProdutos/67dca92bc3b2a.png', ' http://localhost/marketplace/fotoProdutos/67dca92bc3eda.png'),
(23, 1, 'item 2', 'camisetas', 'masculino', 'Novo', 'Preto,Esmeralda', 'P', 'Descrição', 2.00, 22.00, 0, '0000-00-00', '0000-00-00', 1.00, 1, ' http://localhost/marketplace/fotoProdutos/67dca9806af9c.png', ' http://localhost/marketplace/fotoProdutos/67dca955649fc.png', ' http://localhost/marketplace/fotoProdutos/67dca95564be7.png'),
(25, 1, '1', 'camisetas', 'masculino', 'Novo', 'Preto,Laranja', 'PP,M', '1', 1.00, 22.00, 0, '2025-02-22', '0000-00-00', 0.00, 1, ' http://localhost/marketplace/fotoProdutos/67dca8879ad6f.png', ' http://localhost/marketplace/fotoProdutos/67dca8879b030.png', ' http://localhost/marketplace/fotoProdutos/67dca8879b33e.png'),
(26, 1, '2', 'camisetas', 'masculino', 'Novo', 'Marrom', 'PP,G', '2', 2.00, 22.00, 0, '0000-00-00', '0000-00-00', 1.00, 1, ' http://localhost/marketplace/fotoProdutos/67dca99f93954.png', ' http://localhost/marketplace/fotoProdutos/67dca99f93d2b.png', ' http://localhost/marketplace/fotoProdutos/67dca99f94221.png'),
(29, 2, '2', 'Masculino', '', 'Novo', '', '', '2', 2.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.00, 0, 'fotoProdutos/676c5ff32bdb6.png', '', ''),
(30, 1, '1', 'Infantil', '', 'Novo', '', '', '1', 1.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.00, 0, 'fotoProdutos/676c600f8ad8c.png', '', ''),
(31, 2, '2', 'calcados', 'masculino', 'Novo', 'Preto', '33', '2', 2.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.50, 1, ' http://localhost/marketplace/fotoProdutos/67dda46fb4e43.png', ' http://localhost/marketplace/fotoProdutos/67dda46fb51d5.png', ' http://localhost/marketplace/fotoProdutos/67dda46fb55db.png'),
(32, 1, '3', 'Infantil', '', 'Novo', '', '', '3', 3.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.00, 0, 'fotoProdutos/676c603b58e3c.jpg', '', ''),
(33, 1, '1', 'acessorios', 'masculino', 'Novo', 'Vermelho', 'Pequeno', '1', 1.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.00, 1, ' http://localhost/marketplace/fotoProdutos/67dca8b8270c3.png', ' http://localhost/marketplace/fotoProdutos/67dca8b827422.png', ' http://localhost/marketplace/fotoProdutos/67dca8b82763b.png'),
(34, 1, '2', 'camisetas', 'masculino', 'novo', 'Preto', 'PP', '2', 2.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.00, 1, 'http://localhost/marketplace/fotoProdutos/67ead98612f56.png', 'http://localhost/marketplace/fotoProdutos/67ead98613324.png', 'http://localhost/marketplace/fotoProdutos/67ead986166a7.png'),
(35, 1, '3', 'acessorios', 'masculino', 'Novo', 'Azul', 'Pequeno', '3', 3.00, 22.00, 0, '0000-00-00', '0000-00-00', 0.00, 1, ' http://localhost/marketplace/fotoProdutos/67dca90668b0c.png', ' http://localhost/marketplace/fotoProdutos/67dca90668d82.png', ' http://localhost/marketplace/fotoProdutos/67dca9066cac7.png'),
(36, 1, 'Produto de teste', 'calcados', 'masculino', 'Novo', 'Preto,Azul,Vermelho,Branco,Verde,Amarelo', '33,35', 'produto de teste', 244.40, 0.00, 12, '0000-00-00', '0000-00-00', 0.00, 2, ' http://localhost/marketplace/fotoProdutos/67d34b6c83d13.png', ' http://localhost/marketplace/fotoProdutos/67d34b6c84069.png', ' http://localhost/marketplace/fotoProdutos/67d34b6c844b9.png'),
(101, 3, 'Calça 3', 'calcas', 'masculino', 'seminovo', 'Preto', '36,52,54', 'Calça 3', 1.00, 0.00, 0, '0000-00-00', '0000-00-00', 0.00, 1, 'http://localhost/marketplace/fotoProdutos/67e339d7cd2e3.png', 'http://localhost/marketplace/fotoProdutos/67e339d7cd2e7.png', 'http://localhost/marketplace/fotoProdutos/67e339d7cd2e8.png'),
(102, 3, 'Calça', 'calcas', 'masculino', 'novo', 'Preto,Azul', '36', 'Calça', 1.00, 0.00, 0, '0000-00-00', '2025-03-26', 0.99, 21, 'http://localhost/marketplace/fotoProdutos/67e33a03104ab.png', 'http://localhost/marketplace/fotoProdutos/67e33a03104ae.png', 'http://localhost/marketplace/fotoProdutos/67e33a03104af.png'),
(100, 3, 'Calça 2', 'calcas', 'feminino', 'novo', 'Preto', '36,44', 'Calça 2', 1.00, 0.00, 0, '0000-00-00', '2025-03-26', 0.99, 1, 'http://localhost/marketplace/fotoProdutos/67e339a7075c2.png', 'http://localhost/marketplace/fotoProdutos/67e339a7075cb.png', 'http://localhost/marketplace/fotoProdutos/67e339a7075cc.png');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_usuario` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cpf` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin` varchar(3) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `endereco` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `bairro` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cidade` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `UF` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `CEP` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `num_residencia` int NOT NULL,
  `senha` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefone` varchar(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `foto` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome_usuario`, `cpf`, `admin`, `email`, `endereco`, `bairro`, `cidade`, `UF`, `CEP`, `num_residencia`, `senha`, `telefone`, `foto`) VALUES
(1, 'joão pedro1', '', 'Não', 'joaopedrodesenvolvedordes@gmail.com', 'rua, 843 - bairro, jau - SP, 00000000', 'bairro', 'jau', 'SP', '00000000', 843, '123', 'não informad', 'http://localhost/marketplace/fotosUsuarios/imgPadrao.png'),
(82, 'joão pedro2', '12345678901', 'não', 'exemplo2@gmail.com', '', '', '', '', '', 0, 'Zxcvbnm1!', '11987654322', 'http://localhost/marketplace/fotosUsuarios/imgPadrao.png'),
(87, 'joão pedro5', '12345678905', 'nao', 'joaopedrodesenvolvedordes5@gmail.com', 'Rua Hugo Pascolat, 12312 - Jardim Santa Terezinha, Jaú - SP, 17205-310', 'Jardim Santa Terezinha', 'Jaú', 'SP', '17205-310', 12312, '$2y$10$/OuEoLl572hUVFJuziGxK.WWuz3zYBSujOmskEdefuicx243abKd.', '11987654325', 'http://localhost/marketplace/fotosUsuarios/imgPadrao.png');

-- --------------------------------------------------------

--
-- Estrutura para tabela `vendedores`
--

DROP TABLE IF EXISTS `vendedores`;
CREATE TABLE IF NOT EXISTS `vendedores` (
  `id_vendedor` int NOT NULL AUTO_INCREMENT,
  `nome_vendedor` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nome_url` varchar(185) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cpf` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `admin` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `senha` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefone_contato` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `endereco` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `bairro` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cidade` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `UF` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `CEP` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `num_residencia` int NOT NULL,
  `foto` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `banner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `itens_a_venda` int NOT NULL,
  `vendas` int NOT NULL,
  `apresentacao` varchar(220) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `abertura` time NOT NULL,
  `fechamento` time NOT NULL,
  `final_semana` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_vendedor`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vendedores`
--

INSERT INTO `vendedores` (`id_vendedor`, `nome_vendedor`, `nome_url`, `cpf`, `admin`, `email`, `senha`, `telefone`, `telefone_contato`, `endereco`, `bairro`, `cidade`, `UF`, `CEP`, `num_residencia`, `foto`, `banner`, `itens_a_venda`, `vendas`, `apresentacao`, `abertura`, `fechamento`, `final_semana`) VALUES
(1, 'João Pedro', 'joão_Pedro', '12345678909', 'sim', 'email@gmail.com', '$2y$10$YDmtOU9R0FGUfHTRlc/QmekgcaJdtCoYnLMwaIlaVTiS4azdvEyYS', '11987654321', '14991202191', '', '', '', '', '', 0, 'http://localhost/marketplace/fotosUsuarios/67dca80bf12a8.png', ' http://localhost/marketplace/fotosUsuarios/67dca80bf0ffa.png', 0, 0, 'Olá bem vindo a minha loja', '07:00:00', '22:30:00', 'nao'),
(2, 'roupas LTDA.', 'roupas_ltda', '12345678955', 'sim', 'roupasLTDA@gmail.com', '$2y$10$YDmtOU9R0FGUfHTRlc/QmekgcaJdtCoYnLMwaIlaVTiS4azdvEyYS', '11987654355', '', '', '', '', '', '', 0, 'http://localhost/marketplace/fotosUsuarios/imgPadrao.png', '', 0, 0, '', '00:00:00', '00:00:00', ''),
(3, 'Conta comercial', 'conta_comercial', '12345678900', 'sim', 'contaComercial@gmail.com', '$2y$10$YDmtOU9R0FGUfHTRlc/QmekgcaJdtCoYnLMwaIlaVTiS4azdvEyYS', '11987654323', '14991202191', 'Rua Hugo Pascolat, 123 - Jardim Santa Terezinha, Jaú - SP, 17205-310', 'Jardim Santa Terezinha', 'Jaú', 'SP', '17205-310', 123, ' http://localhost/marketplace/fotosUsuarios/67e01ca93e9ec.png', ' http://localhost/marketplace/fotosUsuarios/67dec798d14bc.png', 5, 5, 'Olá esta é minha loja de teste', '11:30:00', '22:30:00', 'domingo');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
