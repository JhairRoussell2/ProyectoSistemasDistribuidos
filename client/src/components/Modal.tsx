
import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div className="fixed top-16 right-4 z-50">
      <div 
        className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-80 relative border border-gray-700"
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
