
/**
 * FormInput Component
 * * A reusable, styled input field designed for the Foodie AI forms.
 * It features a minimalist bottom-border design with smooth transitions 
 * and hover effects to enhance the user experience.
 *
 * @param {Object} props - The component props.
 * @param {string} props.label - The descriptive text displayed above the input.
 * @param {string} props.name - The name attribute, used to identify the field in state updates.
 * @param {string|number} props.value - The current value of the input.
 * @param {function} props.onChange - Callback function triggered on every keystroke.
 * @param {string} [props.placeholder] - Optional hint text displayed when the input is empty.
 * @param {string} [props.type="text"] - The HTML input type (e.g., "text", "email", "number").
 * * @returns {JSX.Element} A styled input field wrapped in a labeled container.
 */
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
                className="w-full bg-transparent text-gray-800 text-lg outline-none placeholder:text-gray-400/70 py-1 transition-all duration-500 hover:bg-white/70 hover:px-2 hover:rounded-lg"
            />
        </div>
    );
}