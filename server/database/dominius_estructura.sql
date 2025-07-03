CREATE DATABASE IF NOT EXISTS dominius;
USE dominius;

CREATE TABLE `usuario` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `fecha_registro` timestamp DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE `uea` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE `usuario_uea` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `uea_id` int NOT NULL,
  `fecha_inscripcion` timestamp DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `usuario_uea_unique` (`usuario_id`, `uea_id`)
) ENGINE=InnoDB;

CREATE TABLE `nota_cornell` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_uea_id` int NOT NULL,
  `fecha` timestamp DEFAULT CURRENT_TIMESTAMP,
  `ideas_clave` text,
  `notas_principales` text,
  `resumen` text
) ENGINE=InnoDB;

CREATE TABLE `avance_uea` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `usuario_uea_id` int NOT NULL,
  `fecha` date,
  `porcentaje` decimal(5,2)
) ENGINE=InnoDB;

ALTER TABLE `usuario_uea` 
  ADD FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD FOREIGN KEY (`uea_id`) REFERENCES `uea` (`id`);

ALTER TABLE `nota_cornell` 
  ADD FOREIGN KEY (`usuario_uea_id`) REFERENCES `usuario_uea` (`id`);

ALTER TABLE `avance_uea` 
  ADD FOREIGN KEY (`usuario_uea_id`) REFERENCES `usuario_uea` (`id`);
