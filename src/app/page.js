"use client";
import { useState } from "react";
import { UI_TEXTS } from "./constants";
import FormInput from "./components/FormInput";
import RestaurantCard from "./components/RestaurantCard";

/**
 * Main Home Component
 * * This component renders the landing page for Foodie AI, featuring a 
 * form to collect user preferences and a dynamic results section 
 * to display AI-generated restaurant recommendations.
 *
 * @returns {JSX.Element} The rendered Home page.
 */
export default function Home() {
  // Localization dictionary (currently set to Spanish)
  const t = UI_TEXTS.es;

  /**
   * @typedef {Object} FormData
   * @property {string} location - The physical area or city to search in.
   * @property {string} cuisine - The type of food preferred by the user.
   * @property {string} budget - The price range (low, medium, high).
   */
  const [formData, setFormData] = useState({
    location: "",
    cuisine: "",
    budget: "medium"
  });

  const [loading, setLoading] = useState(false);
  const [results, setResult] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Updates the form data state based on input changes.
   * * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The change event from the input or select.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  /**
   * Handles the search request by communicating with the internal API.
   * Performs client-side validation, toggles loading states, and processes server responses.
   * * @async
   * @function handleSearch
   * @returns {Promise<void>}
   */
  const handleSearch = async () => {
    // Reset error state before a new search
    setError(null);

    // Basic client-side validation for mandatory fields
    if (!formData.location.trim()) {
      setError("Por favor, introduce una localización.");
      return;
    }
    setLoading(true);
    setResult([]);// Clear previous results to improve UX feedback
    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Check if the API returned valid results
      if (data.restaurants && data.restaurants.length > 0) {
        setResult(data.restaurants);
      } else {
        // Handle specific rejection reasons provided by the AI/Backend
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

      {/* Visual background overlay to improve content readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xs fixed" />

      {/* Main Form Container (Glassmorphism card) */}
      <div className="relative  bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-xl w-full border border-white">

        {/* Header section with branding and subtitle */}
        <h1 className="text-gray-900 text-3xl tracking-tight text-center mb-2">
          {t.title1} <span className="font-bold  text-4xl text-emerald-600">{t.title2}</span>
        </h1>
        <p className="text-gray-500 text-center mb-10 text-sm">{t.subtitle}</p>

        <div className="space-y-6">

          {/* Location Search Input */}
          <FormInput
            label={t.labels.location}
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={t.placeholders.location}
          />

          {/* Grid layout for secondary filters */}
          <div className="grid grid-cols-2 gap-8">

            {/* Cuisine Type Input */}
            <FormInput
              label={t.labels.cuisine}
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder={t.placeholders.cuisine}
            />

            {/* Budget Selection Dropdown */}
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
                {t.budgetOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional rendering for error alerts */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded-r-xl transition-all">
              <div className="flex items-center">
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
          {/* Action Button: toggles styles based on loading state */}
          <button disabled={loading}
            onClick={handleSearch}
            className={`w-full py-4 rounded-full font-semibold transition-all shadow-lg mt-4 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200'}`}
          >
            {loading ? t.searching_button : t.search_button}
          </button>
        </div>
      </div>
      {/* Results Display Section: rendered only when recommendations are available */}
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