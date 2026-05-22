CREATE DATABASE IF NOT EXISTS `id19066703_pfe_users`;
USE `id19066703_pfe_users`;

CREATE TABLE IF NOT EXISTS `Users` (
  `Id`            INT(11)      NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(100) NOT NULL,
  `email`         VARCHAR(100) NOT NULL UNIQUE,
  `pwd`           VARCHAR(255) NOT NULL,
  `token`         VARCHAR(255) DEFAULT NULL,
  `status`        VARCHAR(20)  NOT NULL DEFAULT 'inactif',
  `Authorization` TINYINT(1)   NOT NULL DEFAULT 0,
  `Telechargement` TINYINT(1)  NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `passwordreset` (
  `Id`     INT(11)      NOT NULL AUTO_INCREMENT,
  `email`  VARCHAR(100) NOT NULL,
  `token`  VARCHAR(255) NOT NULL,
  `status` TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
