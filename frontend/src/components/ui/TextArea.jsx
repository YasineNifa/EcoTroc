const TextArea = ({ label, name, value, onChange, placeholder }) => (
  <div className="flex items-start">
    <label htmlFor={name} className="w-1/4 pt-2 text-sm text-gray-600">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows="4"
      className="w-3/4 p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none"
    />
  </div>
);

export default TextArea;
