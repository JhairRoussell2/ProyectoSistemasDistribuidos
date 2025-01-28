import React from "react";
import { UserPlusIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg border border-red-500">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-bold text-red-600 flex items-center">
            <UserPlusIcon className="w-6 h-6 mr-2" /> {title}
          </h2>
          <button onClick={onClose} className="text-gray-900 hover:text-gray-700">
            ✖
          </button>
        </div>

        {/* Renderiza los hijos correctamente */}
        <div className="mt-4">{children}</div>

      </div>
    </div>
  );
};

export default Modal;