import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Navbar from '../components/Navbar';

mapboxgl.accessToken = "pk.eyJ1IjoiZGFuaWVscHJ1ZWJhMjMiLCJhIjoiY200YnlpbGV5MDVqeTJ3b3ZsOXp0bXpmbiJ9.bh_ogcw3BioUBy--uuJ0LQ";

// Definir el tipo explícito para el estado 'form'
type FormState = {
  tipoSiniestro: string;
  fechaSiniestro: string;
  departamento: string;
  distrito: string;
  provincia: string;
  ubicacion: string;
  descripcion: string;
  documentos: File[]; // Cambiar 'never[]' a 'File[]'
};

const RegistroSiniestro = () => {
  const navigate = useNavigate(); // Hook para la navegación
  const [form, setForm] = useState<FormState>({
    tipoSiniestro: "Accidente", // Valor predeterminado
    fechaSiniestro: "",
    departamento: "",
    distrito: "",
    provincia: "",
    ubicacion: "",
    descripcion: "",
    documentos: [], // Inicializa 'documentos' como un arreglo vacío de tipo File[]
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null); // Estado para la URL de la imagen
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Manejar los archivos seleccionados
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setForm((prevForm) => ({
        ...prevForm,
        documentos: Array.from(selectedFiles), // Convierte los archivos seleccionados en un arreglo
      }));
    }
  };

  // Configuración y mapa de ubicación
  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-77.0428, -12.0464], // Coordenadas iniciales
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

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tipoSiniestro = form.tipoSiniestro.trim() === "" ? "Accidente" : form.tipoSiniestro;
    const formData = new FormData();
    formData.append("tipoSiniestro", tipoSiniestro);
    formData.append("fechaSiniestro", form.fechaSiniestro);
    formData.append("departamento", form.departamento);
    formData.append("distrito", form.distrito);
    formData.append("provincia", form.provincia);
    formData.append("ubicacion", form.ubicacion);
    formData.append("descripcion", form.descripcion);

    // Adjuntar los documentos solo si existen
    form.documentos.forEach((doc) => {
      formData.append("image", doc); // Adjuntar los archivos al FormData
    });

    try {
      // Enviar la solicitud al servidor para subir el archivo
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Extraer la URL de la imagen de la respuesta
      const imageUrl = response.data.secure_url; // Obtener la URL del archivo subido
      setImageUrl(imageUrl); // Guardar la URL en el estado

      // Enviar la URL al backend junto con el resto del formulario
      const secondResponse = await axios.post("http://localhost:3000/api/siniestros", {
        ...form,
        documentos: [imageUrl], // Solo enviar la URL del archivo
      });

      alert("Siniestro registrado con éxito: " + secondResponse.data.siniestroId);
    } catch (error) {
      console.error("Error al registrar el siniestro:", error);
      alert("Ocurrió un error al registrar el siniestro");
    }
  };

  return (
    <div style={{ backgroundColor: "#1E3A5F", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ transform: "scale(0.80)", transformOrigin: "top" }}>
        <div className="max-w-7xl mx-auto mt-10 p-8 bg-gradient-to-br from-red-200 to-red-400 border-4 border-red-600 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-red-700 text-center mb-8 tracking-wide uppercase">
            Registrar Siniestro
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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

              {/* Subida de archivos */}
              <div>
                <input
                  type="file"
                  name="documentos"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-red-400 rounded-lg text-black focus:ring focus:ring-red-300 focus:outline-none shadow-sm transition duration-300"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 text-white font-bold px-6 py-3 mt-4 rounded-lg hover:bg-red-600 focus:ring focus:ring-red-300 shadow-md transition duration-300"
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

      {/* Botón de regreso al dashboard */}
      <div className="-mt-20 flex justify-center">
        <button
          onClick={() => navigate("/dashboard/general")}
          className="bg-gray-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 shadow-md transition duration-300"
        >
          Regresar al Dashboard
        </button>
      </div>

      {/* Mostrar URL de la imagen si está disponible */}
      {imageUrl && (
        <div className="text-center mt-4">
          <p>Imagen subida: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
          <img src={imageUrl} alt="Imagen subida" width="300" />
        </div>
      )}
    </div>
  );
};

export default RegistroSiniestro;
