import React from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg relative w-96 max-w-full border border-gray-300">
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-700 transition"
        >
          ✖
        </button>

        {/* Contenido del Modal */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
