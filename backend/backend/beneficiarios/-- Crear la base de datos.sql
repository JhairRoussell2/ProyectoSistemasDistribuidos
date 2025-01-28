-- Crear la base de datos
CREATE DATABASE SistemaFlexDB;
USE SistemaFlexDB;

-- Creación de Tablas

CREATE TABLE Beneficiario (
    BeneficiarioID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Telefono VARCHAR(15)
);

CREATE TABLE Vehiculo (
    VehiculoID INT AUTO_INCREMENT PRIMARY KEY,
    Placa VARCHAR(50) NOT NULL UNIQUE,
    Marca VARCHAR(50) NOT NULL,
    Modelo VARCHAR(50),
    Tipo VARCHAR(50)
);

CREATE TABLE Poliza (
    PolizaID INT AUTO_INCREMENT PRIMARY KEY,
    BeneficiarioID INT NOT NULL,
    TipoPoliza VARCHAR(50),
    FechaInicio DATE NOT NULL,
    FechaFin DATE,
    Estado VARCHAR(50) DEFAULT 'Inactiva',
    FOREIGN KEY (BeneficiarioID) REFERENCES Beneficiario(BeneficiarioID)
);

CREATE TABLE Taller (
    TallerID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Direccion VARCHAR(200) NOT NULL,
    Capacidad INT NOT NULL,
    Estado ENUM('Disponible', 'Ocupado') DEFAULT 'Disponible',
    Telefono VARCHAR(15)
);

CREATE TABLE Siniestro (
    SiniestroID INT AUTO_INCREMENT PRIMARY KEY,
    BeneficiarioID INT NOT NULL,
    VehiculoID INT NOT NULL,
    PolizaID INT NOT NULL,
    TallerID INT,
    Fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    Ubicacion VARCHAR(200),
    Tipo VARCHAR(50) NOT NULL,
    Estado ENUM('Pendiente', 'Cerrado', 'En Proceso') DEFAULT 'Pendiente',
    Descripcion TEXT,
    FOREIGN KEY (BeneficiarioID) REFERENCES Beneficiario(BeneficiarioID),
    FOREIGN KEY (VehiculoID) REFERENCES Vehiculo(VehiculoID),
    FOREIGN KEY (PolizaID) REFERENCES Poliza(PolizaID),
    FOREIGN KEY (TallerID) REFERENCES Taller(TallerID)
);

CREATE TABLE Usuario (
    UsuarioID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Telefono VARCHAR(15),
    Rol ENUM('Personal', 'Administrador') NOT NULL
);

CREATE TABLE Presupuesto (
    PresupuestoID INT AUTO_INCREMENT PRIMARY KEY,
    SiniestroID INT NOT NULL,
    MontoTotal DECIMAL(10, 2) NOT NULL,
    Estado ENUM('Pendiente', 'Pagado') DEFAULT 'Pendiente',
    FechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SiniestroID) REFERENCES Siniestro(SiniestroID)
);

CREATE TABLE Pago (
    PagoID INT AUTO_INCREMENT PRIMARY KEY,
    PresupuestoID INT NOT NULL,
    CantidadPagada DECIMAL(10, 2) NOT NULL,
    FechaPago DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PresupuestoID) REFERENCES Presupuesto(PresupuestoID)
);

-- Índices para Optimización
CREATE INDEX IX_Beneficiario_Email ON Beneficiario(Email);
CREATE INDEX IX_Vehiculo_Placa ON Vehiculo(Placa);
CREATE INDEX IX_Siniestro_Estado ON Siniestro(Estado);
CREATE INDEX IX_Presupuesto_Estado ON Presupuesto(Estado);
CREATE INDEX IX_Taller_Estado ON Taller(Estado);

-- Triggers para Automatización

-- Crear Pago Automáticamente al Registrar un Presupuesto
DELIMITER $$
CREATE TRIGGER trg_CrearPago
AFTER INSERT ON Presupuesto
FOR EACH ROW
BEGIN
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
END$$
DELIMITER ;

-- Actualizar Estado del Presupuesto a "Pagado" al Aprobar un Pago
DELIMITER $$
CREATE TRIGGER trg_ActualizarPresupuesto
AFTER INSERT ON Pago
FOR EACH ROW
BEGIN
    -- Actualizar el estado del presupuesto a "Pagado"
    UPDATE Presupuesto
    SET Estado = 'Pagado'
    WHERE PresupuestoID = NEW.PresupuestoID;
END$$
DELIMITER ;

-- Procedimientos Almacenados

-- Registrar Siniestro
DELIMITER $$
CREATE PROCEDURE sp_RegistrarSiniestro(
    IN BeneficiarioID INT,
    IN VehiculoID INT,
    IN PolizaID INT,
    IN Fecha DATE,
    IN Ubicacion VARCHAR(200),
    IN Tipo VARCHAR(50),
    IN Descripcion TEXT,
    OUT SiniestroID INT
)
BEGIN
    INSERT INTO Siniestro (BeneficiarioID, VehiculoID, PolizaID, Fecha, Ubicacion, Tipo, Descripcion)
    VALUES (BeneficiarioID, VehiculoID, PolizaID, Fecha, Ubicacion, Tipo, Descripcion);

    SET SiniestroID = LAST_INSERT_ID();
END$$
DELIMITER ;

-- Registrar Presupuesto
DELIMITER $$
CREATE PROCEDURE sp_RegistrarPresupuesto(
    IN SiniestroID INT,
    IN MontoTotal DECIMAL(10, 2),
    OUT PresupuestoID INT
)
BEGIN
    INSERT INTO Presupuesto (SiniestroID, MontoTotal)
    VALUES (SiniestroID, MontoTotal);

    SET PresupuestoID = LAST_INSERT_ID();
END$$
DELIMITER ;

-- Cambiar Estado de Taller
DELIMITER $$
CREATE PROCEDURE sp_ActualizarEstadoTaller(
    IN TallerID INT,
    IN Estado VARCHAR(50)
)
BEGIN
    UPDATE Taller
    SET Estado = Estado
    WHERE TallerID = TallerID;
END$$
DELIMITER ;

-- Crear Póliza
DELIMITER $$
CREATE PROCEDURE sp_CrearPoliza(
    IN BeneficiarioID INT,
    IN TipoPoliza VARCHAR(50),
    IN FechaInicio DATE,
    IN FechaFin DATE,
    IN Estado VARCHAR(50),
    OUT PolizaID INT
)
BEGIN
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
DELIMITER ;


CREATE USER 'microservice_security'@'localhost' IDENTIFIED BY 'secure_password';

GRANT ALL PRIVILEGES ON SistemaFlexDB.* TO 'microservice_user'@'localhost';

FLUSH PRIVILEGES;

SELECT user, host FROM mysql.user WHERE user = 'microservice_user';


