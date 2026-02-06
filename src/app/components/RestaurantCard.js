export default function RestaurantCard({ restaurant }) {
    const { name, description, rating, address } = restaurant;

    // Función para renderizar estrellas según el rating
    const renderStars = (num) => "⭐".repeat(Math.min(5, Math.max(1, num)));

    return (
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
                    ⭐ {restaurant.rating}
                </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {restaurant.description}
            </p>

            <div className="flex items-center text-gray-400 text-xs italic">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {address}
            </div>
        </div>
    );
}
