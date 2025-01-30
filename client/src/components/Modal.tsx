import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white text-gray-800 p-6 rounded-xl shadow-2xl w-[420px] relative border border-gray-300 modal-texture">
        {/* Botón de Cierre con Emoji */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-all text-lg"
        >
          ❌
        </button>

        {/* Contenido del Modal */}
        <div className="text-center">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
