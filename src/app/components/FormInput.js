export default function FormInput({ label, name, value, onChange, placeholder, type = "text" }) {
    return (
        <div className="border-b border-gray-100 pb-2">
            <label className="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent text-gray-800 text-lg outline-none placeholder:text-gray-400/70 py-1  
                   transition-all duration-500 hover:bg-white/70 hover:px-2 hover:rounded-lg"
            />
        </div>
    );
}