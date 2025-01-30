import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"; // Íconos profesionales

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose: () => void;
  autoClose?: number;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose, autoClose = 3000 }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const iconMap = {
    success: <CheckCircle className="text-green-600 w-6 h-6" />,
    error: <XCircle className="text-red-600 w-6 h-6" />,
    warning: <AlertTriangle className="text-yellow-600 w-6 h-6" />,
    info: <Info className="text-blue-600 w-6 h-6" />,
  };

  const bgColor = {
    success: "bg-green-100 border-green-500 text-green-900",
    error: "bg-red-100 border-red-500 text-red-900",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-900",
    info: "bg-blue-100 border-blue-500 text-blue-900",
  };

  return (
    <div className={`fixed top-5 right-5 flex items-center gap-3 p-4 border rounded-lg shadow-lg ${bgColor[type]} transition-all transform scale-100`}>
      {iconMap[type]}
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
        ✖
      </button>
    </div>
  );
};

export default Alert;
