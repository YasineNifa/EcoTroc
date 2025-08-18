import { useCallback, useState } from "react";

const MoreFromSeller = ({ items, sellerUsername, currentListing }) => {
  const [activeTab, setActiveTab] = useState("seller");
  const [similarItems, setSimilarItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSimilarItems = useCallback(async () => {
    setIsLoading(true);
    setSimilarItems([]);
    const prompt = `Based on the item "${currentListing.title}" (Brand: ${currentListing.brand}, Color: ${currentListing.color}), generate a list of 4 similar but distinct fictional items. For each item, provide an "id", a short "title", and a "brand". Return this as a JSON array.`;
    try {
      const apiKey = ""; // Canvas provides the key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      const generatedItems = JSON.parse(
        result.candidates[0].content.parts[0].text
      );
      setSimilarItems(generatedItems);
    } catch (err) {
      console.error("Gemini API Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentListing]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "ai" && similarItems.length === 0) {
      generateSimilarItems();
    }
  };

  return (
    <div className="mt-12 pt-8 border-t">
      <div className="flex border-b mb-4">
        <button
          onClick={() => handleTabClick("seller")}
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "seller"
              ? "border-b-2 border-teal-600 text-teal-600"
              : "text-gray-500"
          }`}
        >
          More from {sellerUsername}
        </button>
        <button
          onClick={() => handleTabClick("ai")}
          className={`px-4 py-2 text-sm font-semibold ${
            activeTab === "ai"
              ? "border-b-2 border-teal-600 text-teal-600"
              : "text-gray-500"
          }`}
        >
          ✨ Similar Items (AI)
        </button>
      </div>

      {activeTab === "seller" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <img
              key={item.id}
              src={item.imageUrl}
              alt={`Item ${item.id}`}
              className="w-full aspect-[3/4] object-cover"
            />
          ))}
        </div>
      )}

      {activeTab === "ai" &&
        (isLoading ? (
          <p>✨ Generating similar items...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarItems.map((item) => (
              <div
                key={item.id}
                className="w-full aspect-[3/4] bg-gray-200 rounded-md flex flex-col justify-end p-2 text-white"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                }}
              >
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs">{item.brand}</p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default MoreFromSeller;
