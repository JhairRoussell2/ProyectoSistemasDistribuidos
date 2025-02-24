import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Importa Framer Motion para animaciones
import { FiMessageSquare } from "react-icons/fi"; // Ícono para el mensaje
import asistenteImage from '../assets/I.png'; // Importa la imagen de manera correcta

// El componente ahora acepta tres mensajes y tres tiempos diferentes
const Assistant = ({ 
  messages, 
  delays, 
  finalDelay 
}: { 
  messages: string[], 
  delays: number[], 
  finalDelay: number 
}) => {
  const [currentMessage, setCurrentMessage] = useState(0); // Para gestionar el mensaje actual
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Mostrar el primer mensaje después del primer retraso
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, delays[0]);

    // Cambiar al segundo mensaje después de un segundo retraso
    const messageTimer1 = setTimeout(() => {
      setCurrentMessage(1);
    }, delays[0] + delays[1]);

    // Cambiar al tercer mensaje después de un tercer retraso
    const messageTimer2 = setTimeout(() => {
      setCurrentMessage(2);
    }, delays[0] + delays[1] + delays[2]);

    // Desaparecer el mensaje después del último tiempo
    const finalTimer = setTimeout(() => {
      setShowMessage(false);
    }, delays[0] + delays[1] + delays[2] + finalDelay);

    return () => {
      clearTimeout(timer);
      clearTimeout(messageTimer1);
      clearTimeout(messageTimer2);
      clearTimeout(finalTimer);
    };
  }, [delays, finalDelay]);

  return (
    <motion.div
      className="fixed bottom-4 left-4 flex items-center gap-4 p-4 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: showMessage ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={asistenteImage}
        alt="Asistente"
        className="w-16 h-16 rounded-full"
      />
      {showMessage && (
        <div className="bg-blue-500 text-white p-3 rounded-lg shadow-md max-w-xs">
          <FiMessageSquare size={20} className="mr-2" />
          <p>{messages[currentMessage]}</p> {/* Mostrar el mensaje actual */}
        </div>
      )}
    </motion.div>
  );
};

export default Assistant;
