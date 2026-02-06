"use client";
import { useState } from "react";
import { UI_TEXTS } from "./constants";
import FormInput from "./components/FormInput";
import RestaurantCard from "./components/RestaurantCard";

export default function Home() {
  const t = UI_TEXTS.es;

  const [formData, setFormData] = useState({
    location: "",
    cuisine: "",
    budget: "medium"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [loading, setLoading] = useState(false);
  const [results, setResult] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {

    setError(null);

    if (!formData.location.trim()) {
      setError("Por favor, introduce una localización.");
      return;
    }
    setLoading(true);
    setResult([]);
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.restaurants && data.restaurants.length > 0) {
        setResult(data.restaurants);
      } else {
        if (data.reason === "CUISINE_NOT_FOUND") {
          setError(`No parece haber restaurantes de tipo "${formData.cuisine}" en esta zona. ¡Prueba con otro antojo!`);
        } else if (data.reason === "LOCATION_NOT_FOUND") {
          setError("No hemos reconocido esa ubicación. Prueba a ser más específico (ej. nombre de la ciudad).");
        } else {
          setError("No hemos encontrado resultados que coincidan. Prueba a cambiar los filtros.");
        }
      }
    } catch (err) {
      setError("Vaya, algo ha salido mal con la conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[url('/restaurante.jpg')] bg-cover bg-center flex items-center justify-center p-6 font-sans flex-col overflow-y-auto">

      {/* Capa de superposición para que el fondo no moleste a la lectura */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xs fixed" />

      {/* Tarjeta del formulario (Glassmorphism) */}
      <div className="relative  bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-xl w-full border border-white">

        {/* Encabezado */}
        <h1 className="text-gray-900 text-3xl tracking-tight text-center mb-2">
          {t.title1} <span className="font-bold  text-4xl text-emerald-600">{t.title2}</span>
        </h1>
        <p className="text-gray-500 text-center mb-10 text-sm">{t.subtitle}</p>

        {/* Espaciado vertical entre elementos del formulario */}
        <div className="space-y-6">

          {/* Localización */}
          <FormInput
            label={t.labels.location}
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={t.placeholders.location}
          />

          {/* Fila con dos columnas para Cocina y Presupuesto */}
          <div className="grid grid-cols-2 gap-8">

            {/*Comida */}
            <FormInput
              label={t.labels.cuisine}
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder={t.placeholders.cuisine}
            />

            {/* Selector de Presupuesto */}
            <div className="border-b border-gray-100 pb-2">
              <label className="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold">
                {t.labels.budget}
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full bg-transparent text-gray-800 text-lg outline-none cursor-pointer appearance-none py-1 
                transition-all duration-500 hover:bg-white/70 hover:px-2 hover:rounded-lg "
              >
                {/* Mapeo dinámico de las opciones desde el archivo de constantes */}
                {t.budgetOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón de envío */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded-r-xl transition-all">
              <div className="flex items-center">
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
          <button disabled={loading}
            onClick={handleSearch}
            className={`w-full py-4 rounded-full font-semibold transition-all shadow-lg mt-4 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'}`}
          >
            {loading ? t.searching_button : t.search_button}
          </button>
        </div>
      </div>
      {/* SECCIÓN DE RESULTADOS */}
      {results.length > 0 && (
        <div className="relative z-10 mt-12 w-full max-w-5xl">
          <h2 className="text-white text-2xl font-bold mb-6 text-center drop-shadow-md">{t.recomendations}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((res, index) => (
              <RestaurantCard key={index} restaurant={res} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}