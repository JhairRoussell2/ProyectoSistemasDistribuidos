import { useState } from "react";
import axios from "axios";
import logo from "../assets/logo.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/auth/recuperar", { Email: email });
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al enviar el correo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
        <img src={logo} alt="SegurosFlex" className="w-24 mb-2" />
        <h1 className="text-2xl font-extrabold text-red-500">SegurosFlex</h1>
        </div>
        <h2 className="text-2xl font-bold mb-4">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full p-2 border rounded-lg mb-4 bg-gray-700"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-red-500 p-2 rounded-lg hover:bg-red-600">
            Enviar enlace de recuperación
          </button>
        </form>
        {message && <p className="text-green-400 mt-4">{message}</p>}
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;