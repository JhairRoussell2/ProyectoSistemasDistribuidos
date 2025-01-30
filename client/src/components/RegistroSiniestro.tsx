import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Navbar from "../components/Navbar";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFuaWVscHJ1ZWJhMjMiLCJhIjoiY200YnlpbGV5MDVqeTJ3b3ZsOXp0bXpmbiJ9.bh_ogcw3BioUBy--uuJ0LQ";

const RegistroSiniestro = () => {
  const navigate = useNavigate();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-77.0428, -12.0464],
      zoom: 12,
    });

    map.on("load", () => {
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;

        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current!);
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
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar Fijo */}
      <Navbar />

      <div className="max-w-6xl mx-auto mt-24 p-8 bg-white border border-gray-300 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-red-600 text-center mb-8 tracking-wide uppercase">
          Registrar Siniestro
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="tipoSiniestro"
                placeholder="Tipo de Siniestro"
                value={form.tipoSiniestro}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg text-black focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
                required
              />
              <input
                type="date"
                name="fechaSiniestro"
                value={form.fechaSiniestro}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg text-black focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
                required
              />
              <input
                type="text"
                name="departamento"
                placeholder="Departamento"
                value={form.departamento}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg text-black focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
              />
              <input
                type="text"
                name="distrito"
                placeholder="Distrito"
                value={form.distrito}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg text-black focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
              />
              <input
                type="text"
                name="provincia"
                placeholder="Provincia"
                value={form.provincia}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg text-black focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
              />
              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={form.ubicacion}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-lg text-black focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
              />
            </div>

            <textarea
              name="descripcion"
              placeholder="Descripción del siniestro"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-400 rounded-lg text-black focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 focus:ring focus:ring-red-300 shadow-md transition duration-300"
            >
              Registrar Siniestro
            </button>
          </form>

          {/* Mapa */}
          <div className="w-full h-[450px] border border-gray-400 rounded-lg shadow-lg">
            <div ref={mapContainerRef} className="w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroSiniestro;
