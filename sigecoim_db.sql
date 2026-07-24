-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-07-2026 a las 20:02:15
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sigecoim_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comodato`
--

CREATE TABLE `comodato` (
  `id` int(11) NOT NULL,
  `folio_contrato` varchar(50) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_devolucion_prevista` date NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `instrumento_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `estado` enum('ACTIVO','FINALIZADO','VENCIDO') NOT NULL DEFAULT 'ACTIVO',
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comodato`
--

INSERT INTO `comodato` (`id`, `folio_contrato`, `fecha_inicio`, `fecha_devolucion_prevista`, `estudiante_id`, `instrumento_id`, `usuario_id`, `estado`, `observaciones`) VALUES
(2, 'dfghjk', '2026-07-22', '2026-07-17', 1, 8, 1, 'FINALIZADO', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devolucion`
--

CREATE TABLE `devolucion` (
  `id` int(11) NOT NULL,
  `comodato_id` int(11) NOT NULL,
  `fecha_devolucion` date NOT NULL,
  `estado_instrumento_recibido` enum('NUEVO','BUENO','REGULAR','MALO') NOT NULL,
  `observaciones` text DEFAULT NULL,
  `usuario_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `devolucion`
--

INSERT INTO `devolucion` (`id`, `comodato_id`, `fecha_devolucion`, `estado_instrumento_recibido`, `observaciones`, `usuario_id`) VALUES
(2, 2, '2026-07-22', 'REGULAR', '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `id` int(11) NOT NULL,
  `cedula` varchar(20) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `representante_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`id`, `cedula`, `nombre`, `apellido`, `fecha_nacimiento`, `telefono`, `direccion`, `representante_id`) VALUES
(1, 'V-28111222', 'Carlos', 'Pérez', '2010-05-15', '0412-2223344', 'Av. Libertador, Edif. A, Apto 2', 1),
(2, NULL, 'Ana', 'Pérez', '2014-08-20', NULL, NULL, 1),
(3, 'V-29444555', 'Luis', 'Rodríguez', '2011-03-10', NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instrumento`
--

CREATE TABLE `instrumento` (
  `id` int(11) NOT NULL,
  `codigo_inventario` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `numero_serie` varchar(100) DEFAULT NULL,
  `estado_conservacion` enum('NUEVO','BUENO','REGULAR','MALO') NOT NULL DEFAULT 'BUENO',
  `estado_disponibilidad` enum('DISPONIBLE','PRESTADO','MANTENIMIENTO') NOT NULL DEFAULT 'DISPONIBLE',
  `medida` varchar(50) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `accesorios` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `instrumento`
--

INSERT INTO `instrumento` (`id`, `codigo_inventario`, `nombre`, `marca`, `modelo`, `numero_serie`, `estado_conservacion`, `estado_disponibilidad`, `medida`, `color`, `accesorios`) VALUES
(8, 'erthyjjtyh', 'rtgrg', 'th', 'thyj', 'tghh', 'REGULAR', 'DISPONIBLE', '', 'Madera Oscura|#3e2723', ''),
(9, 'ddd', ' Violín', 'Fengling ', 'MV-300', 'S/S', 'BUENO', 'DISPONIBLE', '4/4', 'Personalizado|#b0bc10', 'Estuche, arco');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `representante`
--

CREATE TABLE `representante` (
  `id` int(11) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `representante`
--

INSERT INTO `representante` (`id`, `cedula`, `nombre`, `apellido`, `telefono`, `email`, `direccion`) VALUES
(1, 'V-12345678', 'Juan', 'Pérez', '0412-1112233', 'juan.perez@email.com', 'Av. Libertador, Edif. A, Apto 2'),
(2, 'V-87654321', 'María', 'Rodríguez', '0414-9998877', 'maria.rod@email.com', 'Calle Bolívar, Casa Nro 45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMINISTRADOR','ANALISTA_BIENES','COORDINADOR') NOT NULL DEFAULT 'COORDINADOR',
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `email`, `password`, `rol`, `estado`) VALUES
(1, 'Administrador General', 'admin@sigecoim.com', '$2b$10$rH6ljnFdrm7h1t6h0GMeVuIhefgXwb8iEwFJshy4Swwi6B1.ZOVqm', 'ANALISTA_BIENES', 1),
(2, 'elpepe', 'ig@gmail.com', '$2b$10$oie7jBSpOdJurECJtfEzOuQHpOkPxwiDZ8wKqlh5ZpEUcjMJa/uGi', 'COORDINADOR', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comodato`
--
ALTER TABLE `comodato`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `folio_contrato` (`folio_contrato`),
  ADD UNIQUE KEY `folio_contrato_2` (`folio_contrato`),
  ADD UNIQUE KEY `folio_contrato_3` (`folio_contrato`),
  ADD UNIQUE KEY `folio_contrato_4` (`folio_contrato`),
  ADD UNIQUE KEY `folio_contrato_5` (`folio_contrato`),
  ADD UNIQUE KEY `folio_contrato_6` (`folio_contrato`),
  ADD UNIQUE KEY `folio_contrato_7` (`folio_contrato`),
  ADD UNIQUE KEY `folio_contrato_8` (`folio_contrato`),
  ADD UNIQUE KEY `folio_contrato_9` (`folio_contrato`),
  ADD KEY `estudiante_id` (`estudiante_id`),
  ADD KEY `instrumento_id` (`instrumento_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `comodato_id` (`comodato_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `cedula_2` (`cedula`),
  ADD UNIQUE KEY `cedula_3` (`cedula`),
  ADD UNIQUE KEY `cedula_4` (`cedula`),
  ADD UNIQUE KEY `cedula_5` (`cedula`),
  ADD UNIQUE KEY `cedula_6` (`cedula`),
  ADD UNIQUE KEY `cedula_7` (`cedula`),
  ADD UNIQUE KEY `cedula_8` (`cedula`),
  ADD UNIQUE KEY `cedula_9` (`cedula`),
  ADD UNIQUE KEY `cedula_10` (`cedula`),
  ADD KEY `representante_id` (`representante_id`);

--
-- Indices de la tabla `instrumento`
--
ALTER TABLE `instrumento`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_inventario` (`codigo_inventario`),
  ADD UNIQUE KEY `codigo_inventario_2` (`codigo_inventario`),
  ADD UNIQUE KEY `codigo_inventario_3` (`codigo_inventario`),
  ADD UNIQUE KEY `codigo_inventario_4` (`codigo_inventario`),
  ADD UNIQUE KEY `codigo_inventario_5` (`codigo_inventario`),
  ADD UNIQUE KEY `codigo_inventario_6` (`codigo_inventario`),
  ADD UNIQUE KEY `codigo_inventario_7` (`codigo_inventario`),
  ADD UNIQUE KEY `codigo_inventario_8` (`codigo_inventario`),
  ADD UNIQUE KEY `codigo_inventario_9` (`codigo_inventario`),
  ADD UNIQUE KEY `numero_serie` (`numero_serie`),
  ADD UNIQUE KEY `numero_serie_2` (`numero_serie`),
  ADD UNIQUE KEY `numero_serie_3` (`numero_serie`),
  ADD UNIQUE KEY `numero_serie_4` (`numero_serie`),
  ADD UNIQUE KEY `numero_serie_5` (`numero_serie`),
  ADD UNIQUE KEY `numero_serie_6` (`numero_serie`),
  ADD UNIQUE KEY `numero_serie_7` (`numero_serie`),
  ADD UNIQUE KEY `numero_serie_8` (`numero_serie`),
  ADD UNIQUE KEY `numero_serie_9` (`numero_serie`);

--
-- Indices de la tabla `representante`
--
ALTER TABLE `representante`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD UNIQUE KEY `cedula_2` (`cedula`),
  ADD UNIQUE KEY `cedula_3` (`cedula`),
  ADD UNIQUE KEY `cedula_4` (`cedula`),
  ADD UNIQUE KEY `cedula_5` (`cedula`),
  ADD UNIQUE KEY `cedula_6` (`cedula`),
  ADD UNIQUE KEY `cedula_7` (`cedula`),
  ADD UNIQUE KEY `cedula_8` (`cedula`),
  ADD UNIQUE KEY `cedula_9` (`cedula`),
  ADD UNIQUE KEY `cedula_10` (`cedula`),
  ADD UNIQUE KEY `cedula_11` (`cedula`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comodato`
--
ALTER TABLE `comodato`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `instrumento`
--
ALTER TABLE `instrumento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `representante`
--
ALTER TABLE `representante`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comodato`
--
ALTER TABLE `comodato`
  ADD CONSTRAINT `comodato_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_10` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_11` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_12` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_13` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_14` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_15` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_16` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_17` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_18` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_19` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_2` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_20` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_21` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_22` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_23` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_24` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_25` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_26` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_27` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_4` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_5` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_6` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_7` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_8` FOREIGN KEY (`instrumento_id`) REFERENCES `instrumento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comodato_ibfk_9` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_10` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_11` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_12` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_13` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_14` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_15` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_16` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_17` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_18` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_3` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_4` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_5` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_6` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_7` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_8` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_9` FOREIGN KEY (`comodato_id`) REFERENCES `comodato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_10` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_3` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_4` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_5` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_6` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_7` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_8` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_9` FOREIGN KEY (`representante_id`) REFERENCES `representante` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
