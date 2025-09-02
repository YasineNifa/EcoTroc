import React, { useCallback, useState } from "react";
import _ from "lodash";
import apiClient from "../../services/api";
import getCommonOptions from "../../helpers/axios/getCommonOptions";

function BrandAutocomplete({ formik }) {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(formik.values.brand || "");

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await apiClient.get(
        `/brands/?name_search=${query}`,
        getCommonOptions()
      );
      const data = response.data;
      console.log("our data : ", data);
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch brand suggestions:", error);
    }
  };

  const debouncedFetch = useCallback(_.debounce(fetchSuggestions, 500), []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    formik.setFieldValue("brand_id", null);
    debouncedFetch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    formik.setFieldValue("brand_id", suggestion.id);
    setSuggestions([]);
    setInputValue(suggestion.name);
  };

  return (
    <div className="relative flex items-center">
      <label htmlFor="brand_id" className="w-1/4 text-sm text-gray-600">
        Brand
      </label>
      <div className="w-3/4 flex flex-col">
        <input
          type="text"
          id="brand_id"
          name="brand_id"
          placeholder="e.g. Nike, Sézane, etc."
          value={inputValue}
          onChange={handleInputChange}
          autoComplete="off"
          className="p-2 border-b border-gray-300  focus:border-teal-500 focus:outline-none"
        />
        {formik.touched.brand_id && formik.errors.brand_id ? (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.brand_id}
          </div>
        ) : null}

        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-3/4 bg-white border border-gray-300 rounded-md mt-1 top-full max-h-60 overflow-y-auto shadow-lg">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BrandAutocomplete;
