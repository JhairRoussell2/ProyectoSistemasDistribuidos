-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-01-2025 a las 01:44:24
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
-- Base de datos: `sistemaflexdb`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateBeneficiario` (IN `p_Nombre` VARCHAR(100), IN `p_Apellido` VARCHAR(100), IN `p_DNI` VARCHAR(8), IN `p_Email` VARCHAR(100), IN `p_Telefono` VARCHAR(15))   BEGIN
    DECLARE existing INT;

    -- Verifica si ya existe un beneficiario con el mismo DNI o Email
    SELECT COUNT(*) INTO existing
    FROM beneficiario
    WHERE DNI = p_DNI OR Email = p_Email;

    IF existing > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El DNI o Email ya están registrados.';
    ELSE
        -- Inserta el nuevo beneficiario
        INSERT INTO beneficiario (Nombre, Apellido, DNI, Email, Telefono)
        VALUES (p_Nombre, p_Apellido, p_DNI, p_Email, p_Telefono);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateProveedor` (IN `p_Nombre_Proveedor` VARCHAR(255), IN `p_Dirección` VARCHAR(255), IN `p_Teléfono_Proveedor` VARCHAR(20), IN `p_Correo_Electrónico` VARCHAR(100), IN `p_Tipo_Proveedor` VARCHAR(100), IN `p_Estado_Proveedor` ENUM('Activo','Inactivo'), IN `p_Valoración` DECIMAL(3,2), IN `p_Notas` TEXT)   BEGIN
    INSERT INTO proveedores (Nombre_Proveedor, Dirección, Teléfono_Proveedor, Correo_Electrónico, Tipo_Proveedor, Estado_Proveedor, Valoración, Notas)
    VALUES (p_Nombre_Proveedor, p_Dirección, p_Teléfono_Proveedor, p_Correo_Electrónico, p_Tipo_Proveedor, p_Estado_Proveedor, p_Valoración, p_Notas);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteBeneficiario` (IN `p_BeneficiarioID` INT)   BEGIN
    DECLARE v_UsuarioID INT;

    -- Obtener el UsuarioID correspondiente al BeneficiarioID
    SELECT UsuarioID INTO v_UsuarioID
    FROM beneficiario
    WHERE BeneficiarioID = p_BeneficiarioID;

    -- Verificar si el BeneficiarioID existe
    IF v_UsuarioID IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Beneficiario no encontrado';
    ELSE
        -- Eliminar el beneficiario de la tabla beneficiario
        DELETE FROM beneficiario WHERE BeneficiarioID = p_BeneficiarioID;

        -- Eliminar el usuario de la tabla Usuario
        DELETE FROM Usuario WHERE UsuarioID = v_UsuarioID;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteProveedor` (IN `p_ID_Proveedor` INT)   BEGIN
    DELETE FROM proveedores WHERE ID_Proveedor = p_ID_Proveedor;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllProveedores` ()   BEGIN
    SELECT * FROM proveedores;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBeneficiarios` ()   BEGIN
    SELECT * FROM beneficiario;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetProveedorById` (IN `p_ID_Proveedor` INT)   BEGIN
    SELECT * FROM proveedores WHERE ID_Proveedor = p_ID_Proveedor;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ActualizarEstadoTaller` (IN `TallerID` INT, IN `Estado` VARCHAR(50))   BEGIN
    UPDATE Taller
    SET Estado = Estado
    WHERE TallerID = TallerID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CrearPoliza` (IN `BeneficiarioID` INT, IN `TipoPoliza` VARCHAR(50), IN `FechaInicio` DATE, IN `FechaFin` DATE, IN `Estado` VARCHAR(50), OUT `PolizaID` INT)   BEGIN
    -- Si el Estado no se proporciona, establecerlo como 'Inactiva'
    IF Estado IS NULL OR Estado = '' THEN
        SET Estado = 'Inactiva';
    END IF;

    -- Validar si el beneficiario existe
    IF NOT EXISTS (
        SELECT 1
        FROM Beneficiario
        WHERE BeneficiarioID = BeneficiarioID
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El beneficiario no existe.';
    END IF;

    -- Insertar la póliza asociada al beneficiario
    INSERT INTO Poliza (BeneficiarioID, TipoPoliza, FechaInicio, FechaFin, Estado)
    VALUES (BeneficiarioID, TipoPoliza, FechaInicio, FechaFin, Estado);

    -- Obtener el ID de la póliza creada
    SET PolizaID = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CreateUser` (IN `p_Nombre` VARCHAR(100), IN `p_Apellido` VARCHAR(100), IN `p_Email` VARCHAR(100), IN `p_Password` VARCHAR(255), IN `p_Rol` ENUM('Personal','Administrador','Beneficiario'))   BEGIN
    DECLARE email_count INT DEFAULT 0;

    -- Verificar si el correo electrónico ya existe
    SELECT COUNT(*) INTO email_count FROM Usuario WHERE Email = p_Email;

    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El correo electrónico ya está registrado';
    ELSE
        -- Insertar el nuevo usuario si no existe
        INSERT INTO Usuario (Nombre, Apellido, Email, Password, Rol)
        VALUES (p_Nombre, p_Apellido, p_Email, p_Password, p_Rol);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_FindUserByEmail` (IN `p_Email` VARCHAR(100))   BEGIN
    SELECT UsuarioID, Nombre, Apellido, Email, Password, Rol
    FROM Usuario
    WHERE Email = p_Email
    LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_RegisterBeneficiario` (IN `p_Nombre` VARCHAR(100), IN `p_Apellido` VARCHAR(100), IN `p_Email` VARCHAR(100), IN `p_Password` VARCHAR(255), IN `p_DNI` VARCHAR(8), IN `p_Telefono` VARCHAR(15))   BEGIN
    DECLARE email_count INT;

    -- Verificar si el correo electrónico ya está registrado
    SELECT COUNT(*) INTO email_count 
    FROM Usuario 
    WHERE Email = p_Email;

    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El correo electrónico ya está registrado';
    ELSE
        -- Crear usuario
        INSERT INTO Usuario (Nombre, Apellido, Email, Password, Rol) 
        VALUES (p_Nombre, p_Apellido, p_Email, p_Password, 'Beneficiario');

        -- Obtener el UsuarioID del usuario creado
        SET @UsuarioID = LAST_INSERT_ID();

        -- Crear beneficiario
        INSERT INTO beneficiario (Nombre, Apellido, DNI, Email, Telefono, UsuarioID) 
        VALUES (p_Nombre, p_Apellido, p_DNI, p_Email, p_Telefono, @UsuarioID);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_RegistrarPresupuesto` (IN `SiniestroID` INT, IN `MontoTotal` DECIMAL(10,2), OUT `PresupuestoID` INT)   BEGIN
    INSERT INTO Presupuesto (SiniestroID, MontoTotal)
    VALUES (SiniestroID, MontoTotal);

    SET PresupuestoID = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_RegistrarSiniestro` (IN `BeneficiarioID` INT, IN `VehiculoID` INT, IN `PolizaID` INT, IN `Fecha` DATE, IN `Ubicacion` VARCHAR(200), IN `Tipo` VARCHAR(50), IN `Descripcion` TEXT, OUT `SiniestroID` INT)   BEGIN
    INSERT INTO Siniestro (BeneficiarioID, VehiculoID, PolizaID, Fecha, Ubicacion, Tipo, Descripcion)
    VALUES (BeneficiarioID, VehiculoID, PolizaID, Fecha, Ubicacion, Tipo, Descripcion);

    SET SiniestroID = LAST_INSERT_ID();
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateBeneficiario` (IN `p_BeneficiarioID` INT, IN `p_Nombre` VARCHAR(100), IN `p_Apellido` VARCHAR(100), IN `p_DNI` VARCHAR(8), IN `p_Email` VARCHAR(100), IN `p_Telefono` VARCHAR(15), IN `p_Password` VARCHAR(255))   BEGIN
    DECLARE v_UsuarioID INT;

    -- Obtener el UsuarioID correspondiente al BeneficiarioID
    SELECT UsuarioID INTO v_UsuarioID
    FROM beneficiario
    WHERE BeneficiarioID = p_BeneficiarioID;

    -- Verificar si el UsuarioID existe
    IF v_UsuarioID IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Beneficiario no encontrado.';
    ELSE
        -- Actualizar la tabla beneficiario
        UPDATE beneficiario
        SET Nombre = p_Nombre,
            Apellido = p_Apellido,
            DNI = p_DNI,
            Email = p_Email,
            Telefono = p_Telefono
        WHERE BeneficiarioID = p_BeneficiarioID;

        -- Si se proporciona una nueva contraseña, actualizarla en la tabla Usuario
        IF p_Password IS NOT NULL THEN
            UPDATE Usuario
            SET Password = p_Password
            WHERE UsuarioID = v_UsuarioID;
        END IF;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateProveedor` (IN `p_ID_Proveedor` INT, IN `p_Nombre_Proveedor` VARCHAR(255), IN `p_Dirección` VARCHAR(255), IN `p_Teléfono_Proveedor` VARCHAR(20), IN `p_Correo_Electrónico` VARCHAR(100), IN `p_Tipo_Proveedor` VARCHAR(100), IN `p_Estado_Proveedor` ENUM('Activo','Inactivo'), IN `p_Valoración` DECIMAL(3,2), IN `p_Notas` TEXT)   BEGIN
    UPDATE proveedores 
    SET Nombre_Proveedor = p_Nombre_Proveedor,
        Dirección = p_Dirección,
        Teléfono_Proveedor = p_Teléfono_Proveedor,
        Correo_Electrónico = p_Correo_Electrónico,
        Tipo_Proveedor = p_Tipo_Proveedor,
        Estado_Proveedor = p_Estado_Proveedor,
        Valoración = p_Valoración,
        Notas = p_Notas
    WHERE ID_Proveedor = p_ID_Proveedor;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `beneficiario`
--

CREATE TABLE `beneficiario` (
  `BeneficiarioID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `DNI` varchar(8) NOT NULL,
  `UsuarioID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `beneficiario`
--

INSERT INTO `beneficiario` (`BeneficiarioID`, `Nombre`, `Apellido`, `Email`, `Telefono`, `DNI`, `UsuarioID`) VALUES
(1, 'wisner', 'valdiviezo', 'wisneria@gmail.com', '989923923', '72960902', NULL),
(2, 'jaland', 'perex', 'wisneria1@gmail.com', '867676767', '23242412', NULL),
(3, 'aland', 'nantes', 'jaand@gmail.com', '923456789', '65768712', NULL),
(4, 'Alan1', 'gomez', 'wisner@gmail.com', '981089166', '21213243', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docreclamacion`
--

CREATE TABLE `docreclamacion` (
  `DocumentoID` int(11) NOT NULL,
  `ReclamacionID` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Extension` varchar(10) DEFAULT NULL,
  `Url` text DEFAULT NULL,
  `fecha_subida` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docreclamacion`
--

INSERT INTO `docreclamacion` (`DocumentoID`, `ReclamacionID`, `Nombre`, `Extension`, `Url`, `fecha_subida`) VALUES
(1, 1, 'Foto del choque', 'jpg', 'https://ejemplo.com/foto_choque.jpg', '2025-01-28 07:03:43'),
(2, 1, 'Informe policial', 'pdf', 'https://ejemplo.com/informe_policial.pdf', '2025-01-28 07:03:43'),
(3, 2, 'Tasación del vehículo', 'pdf', 'https://ejemplo.com/tasacion.pdf', '2025-01-28 07:03:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `PagoID` int(11) NOT NULL,
  `PresupuestoID` int(11) NOT NULL,
  `CantidadPagada` decimal(10,2) NOT NULL,
  `FechaPago` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `poliza`
--

CREATE TABLE `poliza` (
  `PolizaID` int(11) NOT NULL,
  `BeneficiarioID` int(11) NOT NULL,
  `TipoPoliza` varchar(50) DEFAULT NULL,
  `FechaInicio` date NOT NULL,
  `FechaFin` date DEFAULT NULL,
  `Estado` varchar(50) DEFAULT 'Inactiva'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `poliza`
--

INSERT INTO `poliza` (`PolizaID`, `BeneficiarioID`, `TipoPoliza`, `FechaInicio`, `FechaFin`, `Estado`) VALUES
(1, 4, 'Premium', '2025-01-30', '2026-01-30', 'Activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presupuesto`
--

CREATE TABLE `presupuesto` (
  `PresupuestoID` int(11) NOT NULL,
  `SiniestroID` int(11) NOT NULL,
  `MontoTotal` decimal(10,2) NOT NULL,
  `Estado` enum('Pendiente','Pagado') DEFAULT 'Pendiente',
  `FechaCreacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `presupuesto`
--
DELIMITER $$
CREATE TRIGGER `trg_CrearPago` AFTER INSERT ON `presupuesto` FOR EACH ROW BEGIN
    -- Validar si el siniestro relacionado está en estado 'Pendiente'
    IF EXISTS (
        SELECT 1
        FROM Siniestro
        WHERE SiniestroID = NEW.SiniestroID
        AND Estado = 'Pendiente'
    ) THEN
        -- Insertar en la tabla de pagos
        INSERT INTO Pago (PresupuestoID, CantidadPagada)
        VALUES (NEW.PresupuestoID, NEW.MontoTotal);
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El siniestro no está pendiente de pago.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `ID_Proveedor` int(11) NOT NULL,
  `Nombre_Proveedor` varchar(255) NOT NULL,
  `Dirección` varchar(255) DEFAULT NULL,
  `Teléfono_Proveedor` varchar(20) DEFAULT NULL,
  `Correo_Electrónico` varchar(100) DEFAULT NULL,
  `Tipo_Proveedor` varchar(100) DEFAULT NULL,
  `Estado_Proveedor` enum('Activo','Inactivo') DEFAULT 'Activo',
  `Fecha_Registro` datetime DEFAULT current_timestamp(),
  `Valoración` decimal(3,2) DEFAULT NULL,
  `Notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reclamacion`
--

CREATE TABLE `reclamacion` (
  `ReclamacionID` int(11) NOT NULL,
  `SiniestroID` int(11) NOT NULL,
  `fecha_reclamacion` timestamp NULL DEFAULT current_timestamp(),
  `estado` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reclamacion`
--

INSERT INTO `reclamacion` (`ReclamacionID`, `SiniestroID`, `fecha_reclamacion`, `estado`, `descripcion`, `tipo`) VALUES
(1, 1, '2025-01-28 07:02:22', 'Pendiente', 'Reclamación por daños en la parte frontal del vehículo.', 'Daños Materiales'),
(2, 2, '2025-01-28 07:02:22', 'En proceso', 'Reclamación por pérdida total del vehículo.', 'Pérdida Total');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `siniestro`
--

CREATE TABLE `siniestro` (
  `SiniestroID` int(11) NOT NULL,
  `BeneficiarioID` int(11) NOT NULL,
  `PolizaID` int(11) NOT NULL,
  `TallerID` int(11) DEFAULT NULL,
  `ReclamacionID` int(11) DEFAULT NULL,
  `Fecha` date NOT NULL,
  `Ubicacion` varchar(200) DEFAULT NULL,
  `Tipo` varchar(50) NOT NULL,
  `Estado` enum('Pendiente','Cerrado','En Proceso') NOT NULL DEFAULT 'Pendiente',
  `Descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `siniestro`
--
DELIMITER $$
CREATE TRIGGER `before_insert_siniestro` BEFORE INSERT ON `siniestro` FOR EACH ROW BEGIN
  IF NEW.Fecha IS NULL THEN
    SET NEW.Fecha = CURDATE();
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `taller`
--

CREATE TABLE `taller` (
  `TallerID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Direccion` varchar(200) NOT NULL,
  `Capacidad` int(11) NOT NULL,
  `Estado` enum('Disponible','Ocupado') DEFAULT 'Disponible',
  `Telefono` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `taller_proveedor`
--

CREATE TABLE `taller_proveedor` (
  `TallerID` int(11) NOT NULL,
  `ID_Proveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `UsuarioID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Rol` enum('Personal','Administrador','Beneficiario') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`UsuarioID`, `Nombre`, `Apellido`, `Email`, `Password`, `Rol`) VALUES
(1, 'John', 'Doe', 'johndoe@example.com', '$2b$10$1r2ESmNw9qkH6B4yekmPHeMPeMJ7BYjXqWJoi9HJqHiZjuSY7e/nC', 'Administrador'),
(2, 'Guax', 'Double', 'gix@gmail.com', '$2b$10$WmksUWCCeC9U.KwdCun/pOS0jwTKul2tIzPB9T2Z0mBtkt0.tou3i', 'Personal'),
(7, 'Manuek', 'Roblas', 'manuel@gmail.com', '$2b$10$.p/QqFbOyenCf0OBX8TgMOcdtOUTIeLvQUtvJyW8lgHG.2WP/prGa', 'Beneficiario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculo`
--

CREATE TABLE `vehiculo` (
  `VehiculoID` int(11) NOT NULL,
  `Placa` varchar(50) NOT NULL,
  `Marca` varchar(50) NOT NULL,
  `Modelo` varchar(50) DEFAULT NULL,
  `Tipo` varchar(50) DEFAULT NULL,
  `BeneficiarioID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `beneficiario`
--
ALTER TABLE `beneficiario`
  ADD PRIMARY KEY (`BeneficiarioID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `DNI` (`DNI`),
  ADD KEY `IX_Beneficiario_Email` (`Email`),
  ADD KEY `fk_usuario` (`UsuarioID`);

--
-- Indices de la tabla `docreclamacion`
--
ALTER TABLE `docreclamacion`
  ADD PRIMARY KEY (`DocumentoID`),
  ADD KEY `idx_documentos_reclamacion` (`ReclamacionID`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`PagoID`),
  ADD KEY `PresupuestoID` (`PresupuestoID`);

--
-- Indices de la tabla `poliza`
--
ALTER TABLE `poliza`
  ADD PRIMARY KEY (`PolizaID`),
  ADD KEY `poliza_ibfk_1` (`BeneficiarioID`);

--
-- Indices de la tabla `presupuesto`
--
ALTER TABLE `presupuesto`
  ADD PRIMARY KEY (`PresupuestoID`),
  ADD KEY `SiniestroID` (`SiniestroID`),
  ADD KEY `IX_Presupuesto_Estado` (`Estado`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`ID_Proveedor`);

--
-- Indices de la tabla `reclamacion`
--
ALTER TABLE `reclamacion`
  ADD PRIMARY KEY (`ReclamacionID`),
  ADD KEY `idx_reclamacion_siniestro` (`SiniestroID`),
  ADD KEY `idx_reclamacion_fecha` (`fecha_reclamacion`);

--
-- Indices de la tabla `siniestro`
--
ALTER TABLE `siniestro`
  ADD PRIMARY KEY (`SiniestroID`),
  ADD KEY `BeneficiarioID` (`BeneficiarioID`),
  ADD KEY `PolizaID` (`PolizaID`),
  ADD KEY `TallerID` (`TallerID`),
  ADD KEY `IX_Siniestro_Estado` (`Estado`),
  ADD KEY `FK_Siniestro_Reclamacion` (`ReclamacionID`);

--
-- Indices de la tabla `taller`
--
ALTER TABLE `taller`
  ADD PRIMARY KEY (`TallerID`),
  ADD KEY `IX_Taller_Estado` (`Estado`);

--
-- Indices de la tabla `taller_proveedor`
--
ALTER TABLE `taller_proveedor`
  ADD PRIMARY KEY (`TallerID`,`ID_Proveedor`),
  ADD KEY `ID_Proveedor` (`ID_Proveedor`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`UsuarioID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indices de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD PRIMARY KEY (`VehiculoID`),
  ADD UNIQUE KEY `Placa` (`Placa`),
  ADD KEY `IX_Vehiculo_Placa` (`Placa`),
  ADD KEY `FK_Vehiculo_Beneficiario` (`BeneficiarioID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `beneficiario`
--
ALTER TABLE `beneficiario`
  MODIFY `BeneficiarioID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `docreclamacion`
--
ALTER TABLE `docreclamacion`
  MODIFY `DocumentoID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `PagoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `poliza`
--
ALTER TABLE `poliza`
  MODIFY `PolizaID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `presupuesto`
--
ALTER TABLE `presupuesto`
  MODIFY `PresupuestoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `ID_Proveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reclamacion`
--
ALTER TABLE `reclamacion`
  MODIFY `ReclamacionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `siniestro`
--
ALTER TABLE `siniestro`
  MODIFY `SiniestroID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `taller`
--
ALTER TABLE `taller`
  MODIFY `TallerID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `UsuarioID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  MODIFY `VehiculoID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `beneficiario`
--
ALTER TABLE `beneficiario`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`UsuarioID`) REFERENCES `usuario` (`UsuarioID`);

--
-- Filtros para la tabla `docreclamacion`
--
ALTER TABLE `docreclamacion`
  ADD CONSTRAINT `docreclamacion_ibfk_1` FOREIGN KEY (`ReclamacionID`) REFERENCES `reclamacion` (`ReclamacionID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`PresupuestoID`) REFERENCES `presupuesto` (`PresupuestoID`);

--
-- Filtros para la tabla `poliza`
--
ALTER TABLE `poliza`
  ADD CONSTRAINT `poliza_ibfk_1` FOREIGN KEY (`BeneficiarioID`) REFERENCES `beneficiario` (`BeneficiarioID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `presupuesto`
--
ALTER TABLE `presupuesto`
  ADD CONSTRAINT `presupuesto_ibfk_1` FOREIGN KEY (`SiniestroID`) REFERENCES `siniestro` (`SiniestroID`);

--
-- Filtros para la tabla `reclamacion`
--
ALTER TABLE `reclamacion`
  ADD CONSTRAINT `reclamacion_ibfk_1` FOREIGN KEY (`SiniestroID`) REFERENCES `siniestros` (`SiniestroID`) ON DELETE CASCADE;

--
-- Filtros para la tabla `siniestro`
--
ALTER TABLE `siniestro`
  ADD CONSTRAINT `FK_Siniestro_Reclamacion` FOREIGN KEY (`ReclamacionID`) REFERENCES `reclamacion` (`ReclamacionID`) ON DELETE SET NULL,
  ADD CONSTRAINT `siniestro_ibfk_1` FOREIGN KEY (`BeneficiarioID`) REFERENCES `beneficiario` (`BeneficiarioID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `siniestro_ibfk_3` FOREIGN KEY (`PolizaID`) REFERENCES `poliza` (`PolizaID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `siniestro_ibfk_4` FOREIGN KEY (`TallerID`) REFERENCES `taller` (`TallerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `taller_proveedor`
--
ALTER TABLE `taller_proveedor`
  ADD CONSTRAINT `taller_proveedor_ibfk_1` FOREIGN KEY (`TallerID`) REFERENCES `taller` (`TallerID`) ON DELETE CASCADE,
  ADD CONSTRAINT `taller_proveedor_ibfk_2` FOREIGN KEY (`ID_Proveedor`) REFERENCES `proveedores` (`ID_Proveedor`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vehiculo`
--
ALTER TABLE `vehiculo`
  ADD CONSTRAINT `FK_Vehiculo_Beneficiario` FOREIGN KEY (`BeneficiarioID`) REFERENCES `beneficiario` (`BeneficiarioID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
