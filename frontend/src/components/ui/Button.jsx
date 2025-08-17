// const Button = ({ children, className = "", onClick, disabled = false }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     className={`bg-teal-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
//   >
//     {children}
//   </button>
// );

// export default Button;

const Button = ({
  children,
  className = "",
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
}) => {
  const baseClasses =
    "font-semibold px-5 py-2 rounded-md transition-colors text-center";
  const variantClasses = {
    primary:
      "bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:text-gray-400",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
