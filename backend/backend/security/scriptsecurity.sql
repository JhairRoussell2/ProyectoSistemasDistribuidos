-- Active: 1737845864525@@localhost@3306@sistemaflexdb
CREATE PROCEDURE sp_FindUserByEmail(IN p_Email VARCHAR(100))
BEGIN
    SELECT UsuarioID, Nombre, Apellido, Email, Password, Rol
    FROM Usuario
    WHERE Email = p_Email
    LIMIT 1;
END $$

DELIMITER $$

CREATE PROCEDURE sp_CreateUser(
    IN p_Nombre VARCHAR(100),
    IN p_Apellido VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_Password VARCHAR(255),
    IN p_Rol ENUM('Personal', 'Administrador')
)
BEGIN
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

DELIMITER ;


