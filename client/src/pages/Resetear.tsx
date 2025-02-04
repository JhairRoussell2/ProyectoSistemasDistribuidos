import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.jpg";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(`http://localhost:4000/auth/reset/${token}`, { newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirigir después de 2s
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al restablecer la contraseña.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
        <img src={logo} alt="SegurosFlex" className="w-24 mb-2" />
        <h1 className="text-2xl font-extrabold text-red-500">SegurosFlex</h1>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full p-2 border rounded-lg mb-4 bg-gray-700"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-red-500 p-2 rounded-lg hover:bg-red-600">
            Restablecer contraseña
          </button>
        </form>
        {message && <p className="text-green-400 mt-4">{message}</p>}
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;