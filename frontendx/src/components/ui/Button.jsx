const Button = ({ children, className = "", onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-teal-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export default Button;
