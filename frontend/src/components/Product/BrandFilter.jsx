import React, { useEffect } from "react";
import useRequestResource from "../../hooks/useRequestResource";
import { useSearchParams } from "react-router-dom";

function BrandFilter() {
  const { getResourceList: getBrands, resourceList: brands } =
    useRequestResource({
      endpoint: "brands",
      resourceLabel: "brand",
    });

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedBrand = searchParams.get("brand") || "";

  useEffect(() => {
    getBrands();
  }, [getBrands]);

  const handleBrandChange = (e) => {
    const newBrandId = e.target.value;
    const newSearchParams = new URLSearchParams(searchParams);
    if (newBrandId) {
      newSearchParams.set("brand", newBrandId);
    } else {
      newSearchParams.delete("brand");
    }
    setSearchParams(newSearchParams);
  };
  return (
    <div className="flex justify-center gap-4 mb-8">
      <select
        value={selectedBrand}
        onChange={handleBrandChange}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Brands</option>
        {brands.results.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BrandFilter;
