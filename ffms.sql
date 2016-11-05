-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 05-11-2016 a las 20:55:32
-- Versión del servidor: 5.6.16
-- Versión de PHP: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `ffms`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devices`
--

CREATE TABLE IF NOT EXISTS `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_code` varchar(50) NOT NULL,
  `sensor_type` varchar(50) NOT NULL,
  `group` varchar(50) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `device_code` (`device_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `example`
--

CREATE TABLE IF NOT EXISTS `example` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=41 ;

--
-- Volcado de datos para la tabla `example`
--

INSERT INTO `example` (`id`, `data`) VALUES
(1, '1'),
(2, '1'),
(3, '26'),
(4, '11'),
(5, '12'),
(6, '13'),
(7, '17'),
(8, '18'),
(9, '21'),
(10, '22'),
(11, '23'),
(12, '25'),
(13, '26'),
(14, '27'),
(15, '28'),
(16, '29'),
(17, '30'),
(18, '31'),
(19, '32'),
(20, '33'),
(21, '34'),
(22, '2'),
(23, '3'),
(24, '4'),
(25, '5'),
(26, '6'),
(27, '7'),
(28, '8'),
(29, '9'),
(30, '10'),
(31, '11'),
(32, '12'),
(33, '13'),
(34, '14'),
(35, '15'),
(36, '16'),
(37, '17'),
(38, '18'),
(39, '19'),
(40, '20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `readings`
--

CREATE TABLE IF NOT EXISTS `readings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `value` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
