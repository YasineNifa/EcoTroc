// import React, { useState, useCallback } from 'react';
// import { useFormikContext } from 'formik';
// import _ from 'lodash'; // Lodash is great for debouncing
// import FormikTextInput from '../ui/FormikTextInput';

// const LocationAutocomplete = ({ formik }) => {
//   const [suggestions, setSuggestions] = useState([]);
//   const [inputValue, setInputValue] = useState(formik.values.location || '');

//   const fetchSuggestions = async (query) => {
//     if (query.length < 3) {
//       setSuggestions([]);
//       return;
//     }
//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`);
//       const data = await response.json();
//       setSuggestions(data);
//     } catch (error) {
//       console.error("Failed to fetch location suggestions:", error);
//     }
//   };

//   // Debounce the fetch function to avoid making too many API calls
//   const debouncedFetch = useCallback(_.debounce(fetchSuggestions, 500), []);

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInputValue(value);
//     debouncedFetch(value);
//   };

//   const handleSuggestionClick = (suggestion) => {
//     formik.setFieldValue('location', suggestion.display_name);
//     formik.setFieldValue('latitude', parseFloat(suggestion.lat));
//     formik.setFieldValue('longitude', parseFloat(suggestion.lon));
    
//     setSuggestions([]);
//     setInputValue(suggestion.display_name);
//   };

//   return (
//     <div className="relative">
//       <FormikTextInput
//         formik={formik}
//         label="Location"
//         name="location"
//         placeholder="e.g. Paris, France"
//         value={inputValue}
//         onChange={handleInputChange}
//         autoComplete="off" // Disable browser's default autocomplete
//       />
//       {suggestions.length > 0 && (
//         <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
//           {suggestions.map((suggestion) => (
//             <li
//               key={suggestion.place_id}
//               onClick={() => handleSuggestionClick(suggestion)}
//               className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//             >
//               {suggestion.display_name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default LocationAutocomplete;


import React, { useState, useCallback } from 'react';
import _ from 'lodash'; // Lodash is great for debouncing

const LocationAutocomplete = ({ formik }) => {
  const [suggestions, setSuggestions] = useState([]);
  // Use the location from Formik as the initial value
  const [inputValue, setInputValue] = useState(formik.values.location || '');

  // This function fetches suggestions from the API
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch location suggestions:", error);
    }
  };

  // Debounce the fetch function to avoid making too many API calls
  const debouncedFetch = useCallback(_.debounce(fetchSuggestions, 500), []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    // Also update the formik value in real-time for the text field
    formik.setFieldValue('location', value); 
    debouncedFetch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    // When a user clicks a suggestion, update all related formik fields
    formik.setFieldValue('location', suggestion.display_name);
    formik.setFieldValue('latitude', parseFloat(suggestion.lat));
    formik.setFieldValue('longitude', parseFloat(suggestion.lon));
    
    // Clear the suggestions and update the input field's visual state
    setSuggestions([]);
    setInputValue(suggestion.display_name);
  };

  return (
    <div className="relative flex items-center">
      <label htmlFor="location" className="w-1/4 text-sm text-gray-600">
        Location
      </label>
      <div className="w-3/4 flex flex-col">
        {/* --- FIX: Use a standard input instead of FormikTextInput --- */}
        <input
          type="text"
          id="location"
          name="location"
          placeholder="e.g. Paris, France"
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off"
          className="p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none"
        />
        {formik.touched.location && formik.errors.location ? (
          <div className="text-red-500 text-xs mt-1">{formik.errors.location}</div>
        ) : null}

        {/* --- Suggestions dropdown remains the same --- */}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-3/4 bg-white border border-gray-300 rounded-md mt-1 top-full max-h-60 overflow-y-auto shadow-lg">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;
