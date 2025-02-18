import React from 'react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
}

const Card: React.FC<CardProps> = ({ icon, title, description, buttonText, buttonColor }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className={`text-2xl font-bold ${buttonColor}`}>{title}</h2>
      <p className="text-gray-300 mt-2 text-center">{description}</p>
      <button className={`mt-4 ${buttonColor} hover:opacity-80 px-5 py-2 rounded-lg text-white transition-all`}>
        {buttonText}
      </button>
    </div>
  );
};

export default Card;



