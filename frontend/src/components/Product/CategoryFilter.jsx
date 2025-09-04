import React, { useEffect } from "react";
import useRequestResource from "../../hooks/useRequestResource";
import { useSearchParams } from "react-router-dom";

function CategoryFilter() {
  const { getResourceList: getCategories, resourceList: categories } =
    useRequestResource({
      endpoint: "categories",
      resourceLabel: "category",
    });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    const newSearchParams = new URLSearchParams(searchParams);
    if (newCategoryId) {
      newSearchParams.set("category", newCategoryId);
    } else {
      newSearchParams.delete("category");
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Categories</option>
        {categories.results.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
