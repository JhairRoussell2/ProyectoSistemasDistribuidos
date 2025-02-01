-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: sistemaflexdb
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `beneficiario`
--

DROP TABLE IF EXISTS `beneficiario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beneficiario` (
  `BeneficiarioID` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`BeneficiarioID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `IX_Beneficiario_Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beneficiario`
--

LOCK TABLES `beneficiario` WRITE;
/*!40000 ALTER TABLE `beneficiario` DISABLE KEYS */;
/*!40000 ALTER TABLE `beneficiario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `PagoID` int NOT NULL AUTO_INCREMENT,
  `PresupuestoID` int NOT NULL,
  `CantidadPagada` decimal(10,2) NOT NULL,
  `FechaPago` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PagoID`),
  KEY `PresupuestoID` (`PresupuestoID`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`PresupuestoID`) REFERENCES `presupuesto` (`PresupuestoID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poliza`
--

DROP TABLE IF EXISTS `poliza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poliza` (
  `PolizaID` int NOT NULL AUTO_INCREMENT,
  `BeneficiarioID` int NOT NULL,
  `TipoPoliza` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date DEFAULT NULL,
  `Estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Inactiva',
  PRIMARY KEY (`PolizaID`),
  KEY `BeneficiarioID` (`BeneficiarioID`),
  CONSTRAINT `poliza_ibfk_1` FOREIGN KEY (`BeneficiarioID`) REFERENCES `beneficiario` (`BeneficiarioID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poliza`
--

LOCK TABLES `poliza` WRITE;
/*!40000 ALTER TABLE `poliza` DISABLE KEYS */;
/*!40000 ALTER TABLE `poliza` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `presupuesto`
--

DROP TABLE IF EXISTS `presupuesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `presupuesto` (
  `PresupuestoID` int NOT NULL AUTO_INCREMENT,
  `SiniestroID` int NOT NULL,
  `MontoTotal` decimal(10,2) NOT NULL,
  `Estado` enum('Pendiente','Pagado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `FechaCreacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PresupuestoID`),
  KEY `SiniestroID` (`SiniestroID`),
  KEY `IX_Presupuesto_Estado` (`Estado`),
  CONSTRAINT `presupuesto_ibfk_1` FOREIGN KEY (`SiniestroID`) REFERENCES `siniestros` (`SiniestroID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `presupuesto`
--

LOCK TABLES `presupuesto` WRITE;
/*!40000 ALTER TABLE `presupuesto` DISABLE KEYS */;
/*!40000 ALTER TABLE `presupuesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `ID_Proveedor` int NOT NULL AUTO_INCREMENT,
  `Nombre_Proveedor` varchar(255) NOT NULL,
  `Dirección` varchar(255) DEFAULT NULL,
  `Teléfono_Proveedor` varchar(20) DEFAULT NULL,
  `Correo_Electrónico` varchar(100) DEFAULT NULL,
  `Tipo_Proveedor` varchar(100) DEFAULT NULL,
  `Estado_Proveedor` enum('Activo','Inactivo') DEFAULT 'Activo',
  `Fecha_Registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `Valoración` decimal(3,2) DEFAULT NULL,
  `Notas` text,
  PRIMARY KEY (`ID_Proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'RIMACSEGUROS','Av principal','981089166','wisnerva@gmail.com','Distribuidor','Inactivo','2025-01-30 16:01:51',8.00,'6');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siniestros`
--

DROP TABLE IF EXISTS `siniestros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `siniestros` (
  `SiniestroID` int NOT NULL AUTO_INCREMENT,
  `BeneficiarioID` int DEFAULT NULL,
  `VehiculoID` int DEFAULT NULL,
  `PolizaID` int DEFAULT NULL,
  `TallerID` int DEFAULT NULL,
  `tipo_siniestro` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_siniestro` date NOT NULL,
  `departamento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `distrito` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `provincia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ubicacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `documentos` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SiniestroID`),
  KEY `BeneficiarioID` (`BeneficiarioID`),
  KEY `VehiculoID` (`VehiculoID`),
  KEY `PolizaID` (`PolizaID`),
  KEY `TallerID` (`TallerID`),
  CONSTRAINT `siniestros_ibfk_1` FOREIGN KEY (`BeneficiarioID`) REFERENCES `beneficiario` (`BeneficiarioID`),
  CONSTRAINT `siniestros_ibfk_2` FOREIGN KEY (`VehiculoID`) REFERENCES `vehiculo` (`VehiculoID`),
  CONSTRAINT `siniestros_ibfk_3` FOREIGN KEY (`PolizaID`) REFERENCES `poliza` (`PolizaID`),
  CONSTRAINT `siniestros_ibfk_4` FOREIGN KEY (`TallerID`) REFERENCES `taller` (`TallerID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siniestros`
--

LOCK TABLES `siniestros` WRITE;
/*!40000 ALTER TABLE `siniestros` DISABLE KEYS */;
INSERT INTO `siniestros` VALUES (1,NULL,NULL,NULL,NULL,'choque','2011-02-11','Lima','Breña','Lima Metropolitana','Inicial Jardín Mis Primeros Pasos I, 1445, Jirón Napo, Esmeralda, Breña, Lima, Lima Metropolitana, Lima, 15081, Perú','acceidene','[]','2025-01-27 15:50:51'),(2,NULL,NULL,NULL,NULL,'Accidente','2024-11-21','Lima','San Martín de Porres','Lima Metropolitana','816, Avenida Panamericana Norte, Zarumilla, San Martín de Porres, Lima, Lima Metropolitana, Lima, 15102, Perú','hola','[\"https://res.cloudinary.com/duruqbipv/image/upload/v1738270833/Siniestros/m9skawisybl2exymqnuz.jpg\"]','2025-01-30 21:00:33'),(3,NULL,NULL,NULL,NULL,'Accidente','2024-11-21','Lima','Breña','Lima Metropolitana','Jirón Pomabamba, Las Magnolias, Breña, Lima, Lima Metropolitana, Lima, 15082, Perú','WWWW','[\"https://res.cloudinary.com/duruqbipv/image/upload/v1738274502/Siniestros/mnfkx3ogtxc2u3cg32n5.jpg\"]','2025-01-30 22:01:43');
/*!40000 ALTER TABLE `siniestros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taller`
--

DROP TABLE IF EXISTS `taller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taller` (
  `TallerID` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Direccion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Capacidad` int NOT NULL,
  `Estado` enum('Disponible','Ocupado') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Disponible',
  `Telefono` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`TallerID`),
  KEY `IX_Taller_Estado` (`Estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taller`
--

LOCK TABLES `taller` WRITE;
/*!40000 ALTER TABLE `taller` DISABLE KEYS */;
/*!40000 ALTER TABLE `taller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `UsuarioID` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Rol` enum('Personal','Administrador','Beneficiario') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`UsuarioID`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'John','Doe','johndoe@example.com','$2b$10$1r2ESmNw9qkH6B4yekmPHeMPeMJ7BYjXqWJoi9HJqHiZjuSY7e/nC','Administrador'),(2,'Guax','Double','gix@gmail.com','$2b$10$WmksUWCCeC9U.KwdCun/pOS0jwTKul2tIzPB9T2Z0mBtkt0.tou3i','Personal'),(7,'Manuek','Roblas','manuel@gmail.com','$2b$10$.p/QqFbOyenCf0OBX8TgMOcdtOUTIeLvQUtvJyW8lgHG.2WP/prGa','Beneficiario');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculo`
--

DROP TABLE IF EXISTS `vehiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculo` (
  `VehiculoID` int NOT NULL AUTO_INCREMENT,
  `Placa` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Marca` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Modelo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Tipo` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`VehiculoID`),
  UNIQUE KEY `Placa` (`Placa`),
  KEY `IX_Vehiculo_Placa` (`Placa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculo`
--

LOCK TABLES `vehiculo` WRITE;
/*!40000 ALTER TABLE `vehiculo` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehiculo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-30 19:55:43
