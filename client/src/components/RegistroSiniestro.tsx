import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext"; // Importar el contexto de autenticación
import apiClient from "../services/apiClient";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFuaWVscHJ1ZWJhMjMiLCJhIjoiY200YnlpbGV5MDVqeTJ3b3ZsOXp0bXpmbiJ9.bh_ogcw3BioUBy--uuJ0LQ";

// Definir el tipo explícito para el estado 'form'
type FormState = {
  tipoSiniestro: string;
  fechaSiniestro: string;
  departamento: string;
  distrito: string;
  provincia: string;
  ubicacion: string;
  descripcion: string;
  documentos: File[];
};

const RegistroSiniestro = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>({
    tipoSiniestro: "Accidente", 
    fechaSiniestro: "",
    departamento: "",
    distrito: "",
    provincia: "",
    ubicacion: "",
    descripcion: "",
    documentos: [],
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [beneficiarioID, setBeneficiarioID] = useState<number | null>(null);
  const [polizaID, setPolizaID] = useState<number | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Obtener BeneficiarioID y PolizaID
  useEffect(() => {
    if (user?.UsuarioID) {
      apiClient
        .get(`/api/beneficiarios/user/${user.UsuarioID}/beneficiario`)
        .then((response) => {
          const beneficiarioID = response.data.BeneficiarioID; 
          setBeneficiarioID(beneficiarioID);

          apiClient
            .get(`/api/polizas/beneficiario/${beneficiarioID}`)
            .then((response) => {
              setPolizaID(response.data.PolizaID); 
            })
            .catch((error) => console.error("Error al obtener PolizaID:", error));
        })
        .catch((error) => console.error("Error al obtener BeneficiarioID:", error));
    }
  }, [user, setBeneficiarioID, setPolizaID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setForm((prevForm) => ({
        ...prevForm,
        documentos: Array.from(selectedFiles),
      }));
    }
  };

  // Configuración y mapa de ubicación
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
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
              departamento: address.state || "",  // departamento
              provincia: address.city || "",     // provincia
              distrito: address.suburb || "",    // distrito
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

    if (!beneficiarioID || !polizaID) {
      alert("BeneficiarioID o PolizaID no disponibles.");
      return;
    }

    const formData = new FormData();
    formData.append("tipoSiniestro", form.tipoSiniestro);
    formData.append("fechaSiniestro", form.fechaSiniestro);
    formData.append("departamento", form.departamento);
    formData.append("distrito", form.distrito);
    formData.append("provincia", form.provincia);
    formData.append("ubicacion", form.ubicacion);
    formData.append("descripcion", form.descripcion);

    form.documentos.forEach((doc) => {
      formData.append("image", doc);
    });

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedImageUrl = response.data.secure_url;
      setImageUrl(uploadedImageUrl);

      const secondResponse = await axios.post("http://localhost:3000/api/siniestros", {
        BeneficiarioID: beneficiarioID,
        PolizaID: polizaID,
        ...form,
        documentos: [uploadedImageUrl],
      });

      alert("Siniestro registrado con éxito: " + secondResponse.data.siniestroId);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrar el siniestro:", error);
      alert("Ocurrió un error al registrar el siniestro");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-red-200 to-red-300 p-6">
      <Navbar />
      <div className="flex justify-center items-center py-10">
        <div className="max-w-[90%] lg:max-w-[1200px] w-full bg-white border border-gray-200 rounded-lg shadow-2xl p-12">
          <h1 className="text-6xl lg:text-5xl font-extrabold text-center mb-10 tracking-wide uppercase bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
            Registrar Siniestro
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="tipoSiniestro"
              placeholder="Tipo de Siniestro"
              value={form.tipoSiniestro}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500"
              required
            />
            <input
              type="date"
              name="fechaSiniestro"
              value={form.fechaSiniestro}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500"
              required
            />
            <input
              type="text"
              name="departamento"
              placeholder="Departamento"
              value={form.departamento}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
            <input
              type="text"
              name="distrito"
              placeholder="Distrito"
              value={form.distrito}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
            <input
              type="text"
              name="provincia"
              placeholder="Provincia"
              value={form.provincia}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500"
            />
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500"
              required
            ></textarea>
            <input
              type="file"
              name="documentos"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold px-12 py-4 rounded-lg text-lg w-full mt-6"
            >
              Registrar Siniestro
            </button>
          </form>
          <div ref={mapContainerRef} className="w-full h-[480px] border border-gray-300 rounded-xl shadow-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default RegistroSiniestro;
