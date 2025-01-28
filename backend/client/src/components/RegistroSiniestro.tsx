import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Importar estilos de Mapbox
import Navbar from '../components/Navbar'; // Importar el componente Navba

mapboxgl.accessToken = "pk.eyJ1IjoiZGFuaWVscHJ1ZWJhMjMiLCJhIjoiY200YnlpbGV5MDVqeTJ3b3ZsOXp0bXpmbiJ9.bh_ogcw3BioUBy--uuJ0LQ";

const RegistroSiniestro = () => {
  const [form, setForm] = useState({
    tipoSiniestro: "",
    fechaSiniestro: "",
    departamento: "",
    distrito: "",
    provincia: "",
    ubicacion: "",
    descripcion: "",
    documentos: [],
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  useEffect(() => {
    if (mapRef.current) return; // Inicializar solo si el mapa no existe

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-77.0428, -12.0464], // Coordenadas iniciales (Lima, Perú)
      zoom: 12,
    });

    map.on("load", () => {
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(mapRef.current!);
        }

        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const address = data.address;
            setForm((prev) => ({
              ...prev,
              ubicacion: data.display_name,
              distrito: address.suburb || "",
              provincia: address.city || "",
              departamento: address.state || "",
            }));
          })
          .catch((error) => {
            console.error("Error al obtener la dirección:", error);
            setForm((prev) => ({
              ...prev,
              ubicacion: `${lat}, ${lng}`,
            }));
          });
      });
    });

    mapRef.current = map;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/siniestros", form);
      alert("Siniestro registrado con éxito: " + response.data.siniestroId);
    } catch (error) {
      console.error("Error al registrar el siniestro:", error);
      alert("Ocurrió un error al registrar el siniestro");
    }
  };

  return (
    <div>
      
      <Navbar /> {/* Agregar el Navbar aquí */}
      <div style={{ transform: 'scale(0.80)', transformOrigin: 'top' }}>
    <div className="max-w-7xl mx-auto mt-10 p-8 bg-gradient-to-br from-red-200 to-red-400 border-4 border-red-600 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-red-700 text-center mb-8 tracking-wide uppercase">
        Registrar Siniestro
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="tipoSiniestro"
              placeholder="Tipo de Siniestro"
              value={form.tipoSiniestro}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-red-400 rounded-lg text-black placeholder-gray-700 focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
              required
            />
            <input
              type="date"
              name="fechaSiniestro"
              value={form.fechaSiniestro}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-red-400 rounded-lg text-black placeholder-gray-700 focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
              required
            />
            <input
              type="text"
              name="departamento"
              placeholder="Departamento"
              value={form.departamento}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-red-400 rounded-lg text-black placeholder-gray-700 focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
            />
            <input
              type="text"
              name="distrito"
              placeholder="Distrito"
              value={form.distrito}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-red-400 rounded-lg text-black placeholder-gray-700 focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
            />
            <input
              type="text"
              name="provincia"
              placeholder="Provincia"
              value={form.provincia}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-red-400 rounded-lg text-black placeholder-gray-700 focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
            />
            <input
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              value={form.ubicacion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-red-400 rounded-lg text-black placeholder-gray-700 focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
            />
          </div>
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-red-400 rounded-lg text-black placeholder-gray-700 focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300 flex-grow"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-red-500 text-white font-bold px-6 py-3 mt-4 rounded-lg hover:bg-red-600 hover:text-white focus:ring focus:ring-red-300 shadow-md transition duration-300"
          >
            Registrar Siniestro
          </button>
        </form>

        {/* Mapa */}
        <div className="w-full h-[480px] border border-red-400 rounded-lg">
          <div ref={mapContainerRef} className="w-full h-full"></div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default RegistroSiniestro;
