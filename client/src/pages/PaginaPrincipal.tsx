import { Link } from "react-router-dom";
import { Car, ShieldCheck, Users, Phone, Smile, CheckCircle, Search } from "lucide-react";
import heroImage from "../assets/hero-seguro.jpg";
import heroImage2 from "../assets/hero-seguro2.jpg";
import testimonial1 from "../assets/testimonial1.jpg";
import testimonial2 from "../assets/testimonial2.jpg";
import testimonial3 from "../assets/testimonial3.jpg";
import faqImage from "../assets/faqImage.png";

const PaginaPrincipal = () => {
  return (
    <div className="bg-gray-100">
      {/* Navbar Mejorada */}
      <nav className="fixed w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
        {/* Logo */}
        <Link to="/" className="flex items-center text-3xl font-bold text-red-600">
          🚗 SegurosFlex
        </Link>

        {/* Menú de Navegación */}
        <ul className="hidden md:flex space-x-6 text-gray-800 font-medium">
          <li className="cursor-pointer hover:text-red-500">Seguros</li>
          <li className="cursor-pointer hover:text-red-500">Promociones</li>
          <li className="cursor-pointer hover:text-red-500">Atención al Cliente</li>
          <li className="cursor-pointer hover:text-red-500">Sobre Nosotros</li>
        </ul>

        {/* Iconos y Botón de Login */}
        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" />
          <Phone className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" />
          <Link to="/login">
            <button className="border border-black px-4 py-2 rounded-full text-black hover:bg-gray-100 transition">
              Ingresa a tu cuenta
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section con efecto Parallax */}
      <header
        className="relative w-full h-[85vh] bg-cover bg-center flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: "center bottom -550px", // Baja un poco la imagen
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-black bg-opacity-60 p-10 rounded-xl shadow-lg animate-fade-in mt-20">
          <h2 className="text-6xl font-extrabold flex items-center justify-center gap-3">
            🚗 <span>Protege tu vehículo con</span> <span className="text-red-500">SegurosFlex</span>
          </h2>
          <p className="mt-4 text-lg text-gray-300 flex items-center justify-center gap-2">
            ✅ Cobertura completa, atención rápida y las mejores tarifas.
          </p>
        </div>
      </header>

      {/* Beneficios con animaciones */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12 px-6">
        {[
          { icon: <ShieldCheck />, title: "Cobertura Total", text: "🛡️ Protección ante cualquier siniestro." },
          { icon: <Users />, title: "Atención 24/7", text: "📞 Siempre disponibles para ayudarte." },
          { icon: <Car />, title: "Auto de Reemplazo", text: "🚘 No te quedes sin movilidad." },
          { icon: <Phone />, title: "Asesoría Personalizada", text: "🤝 Un agente especializado para ti." },
        ].map((beneficio, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center transform transition-all hover:scale-105 hover:bg-red-50"
          >
            <div className="text-red-600 w-12 h-12 mb-3">{beneficio.icon}</div>
            <h3 className="text-xl font-bold text-gray-800">{beneficio.title}</h3>
            <p className="text-gray-600 mt-2">{beneficio.text}</p>
          </div>
        ))}
      </section>

      {/* Testimonios con efecto deslizante */}
      <section className="py-16 bg-gradient-to-r from-gray-200 to-gray-300">
        <h3 className="text-center text-4xl font-bold text-gray-800 mb-8">💬 Lo que dicen nuestros clientes</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[testimonial1, testimonial2, testimonial3].map((img, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-all hover:scale-105"
            >
              <img src={img} alt={`Testimonio ${index + 1}`} className="rounded-full mx-auto w-20 h-20 mb-4 border-4 border-red-500" loading="lazy" />
              <p className="text-gray-700">
                {index === 0
                  ? "Gracias a SegurosFlex recibí un auto de reemplazo en menos de 24 horas. 🚘"
                  : index === 1
                  ? "Mi reclamo fue procesado sin problemas y obtuve mi indemnización muy rápido. ⏳"
                  : "Me asistieron cuando más lo necesitaba, excelente servicio! ⭐"}
              </p>
              <p className="text-gray-800 font-semibold mt-2 flex items-center justify-center">
                {index === 0 ? "Carlos M." : index === 1 ? "Ana R." : "Luis P."} <Smile className="ml-2 text-yellow-500" />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Preguntas Frecuentes con botón flotante de WhatsApp */}
      <section className="max-w-5xl mx-auto py-12 text-center bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-xl shadow-2xl p-10 relative">
        <h3 className="text-5xl font-extrabold text-red-600 mb-6">
          ❓ Preguntas Frecuentes
        </h3>
        <p className="text-lg text-gray-700 mb-6">
          Resolvemos tus dudas más comunes para que estés 100% seguro. 🚗
        </p>

        {/* Contenedor de imágenes con grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <img
            src={faqImage}
            alt="FAQ"
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <img
            src={heroImage2}
            alt="Seguro de Auto"
            className="w-full h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Contenedor de preguntas */}
        <div className="space-y-6">
          {[
            {
              pregunta: "¿Qué cubre el seguro de auto?",
              respuesta: "Nuestro seguro ofrece una cobertura integral que protege tanto a conductores como a terceros ante cualquier imprevisto. Incluye responsabilidad civil, protección en caso de robo, y asistencia vial las 24 horas.",
            },
            {
              pregunta: "¿Cómo hacer un reclamo?",
              respuesta: "Solo contacta nuestra central de atención 24/7. Nos encargamos de gestionar el reclamo de manera rápida y eficiente.",
            },
            {
              pregunta: "¿Cuáles son los métodos de pago?",
              respuesta: "Aceptamos pagos por tarjeta de crédito/débito, transferencias, pagos en efectivo, y débito automático.",
            },
          ].map((faq, index) => (
            <details key={index} className="group bg-white p-5 rounded-xl shadow-md transition-all transform hover:shadow-lg animate-slide-in">
              <summary className="font-medium cursor-pointer flex justify-between text-gray-900">
                <span>{faq.pregunta}</span>
                <span className="text-gray-500 group-hover:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-2 text-gray-700">{faq.respuesta}</div>
            </details>
          ))}
        </div>

        {/* Botón flotante de WhatsApp mejorado */}
        <a
          href="https://wa.me/51981089166"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-full shadow-lg flex items-center gap-3 animate-bounce"
        >
          <span className="text-2xl">📱</span> 
          <span className="text-lg">WhatsApp</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="text-sm flex items-center justify-center">
          <CheckCircle className="text-green-400 mr-2" /> © {new Date().getFullYear()} SegurosFlex - Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default PaginaPrincipal;
