import { useState } from 'react';

const LoginForm = ({ onSubmit }: { onSubmit: (email: string, password: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(email, password);
    } catch (error) {
      console.error('Error en el inicio de sesión', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* Formulario de inicio de sesión */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full space-y-6 animate-slideIn"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400">Iniciar Sesión</h2>

        <div>
          <label className="block text-gray-400 text-lg">Correo Electrónico</label>
          <input
            type="email"
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 text-lg">Contraseña</label>
          <input
            type="password"
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold shadow-md transition-all flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                ></path>
              </svg>
              Cargando...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        <p className="text-center text-gray-400">
          ¿No tienes una cuenta? <a href="#" className="text-blue-400 hover:text-blue-500">Regístrate aquí</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
