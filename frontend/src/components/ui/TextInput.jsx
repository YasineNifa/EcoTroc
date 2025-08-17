const TextInput = ({ label, name, value, onChange, placeholder }) => (
  <div className="flex items-center">
    <label htmlFor={name} className="w-1/4 text-sm text-gray-600">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-3/4 p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none"
    />
  </div>
);

export default TextInput;
