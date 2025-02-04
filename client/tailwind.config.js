module.exports = {
    darkMode: 'class', // ✅ Habilita modo oscuro con clases
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // ✅ Asegura que Tailwind escanee los archivos
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  