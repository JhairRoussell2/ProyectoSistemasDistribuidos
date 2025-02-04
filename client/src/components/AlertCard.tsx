// src/components/Alert.tsx
import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const AlertCard: React.FC<AlertProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-transform transform ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">
          &times;
        </button>
      </div>
    </div>
  );
};

export default AlertCard;