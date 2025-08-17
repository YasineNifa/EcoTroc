const FormikTextArea = ({ formik, label, name, placeholder }) => (
  <div className="flex items-start">
    <label htmlFor={name} className="w-1/4 pt-2 text-sm text-gray-600">
      {label}
    </label>
    <div className="w-3/4 flex flex-col">
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows="4"
        {...formik.getFieldProps(name)}
        className="p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none"
      />
      {formik.touched[name] && formik.errors[name] ? (
        <div className="text-red-500 text-xs mt-1">{formik.errors[name]}</div>
      ) : null}
    </div>
  </div>
);

export default FormikTextArea;
