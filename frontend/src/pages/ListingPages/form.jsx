import { useState } from "react";
import FormSection from "../../components/ui/FormSection";
import Icon from "../../components/ui/Icon";
import TextArea from "../../components/ui/TextArea";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

export default function ListingForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    brand: "",
  });
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
      setError("");
    } else {
      setError("Please select a valid image file.");
      setImage(null);
      setImageBase64("");
    }
  };

  const generateDetailsWithAI = async () => {
    if (!imageBase64) {
      setError("Please upload an image first to use the AI feature.");
      return;
    }
    setIsLoading(true);
    setError("");

    const prompt =
      "Analyze this image of an item for a marketplace. Provide a short, catchy title, a detailed description, a suggested price in Tokens, the item's brand, and a suggested category from this list: 'Women', 'Men', 'Kids', 'Home'. Return a JSON object with keys: 'title', 'description', 'price', 'brand', and 'category'.";

    try {
      const apiKey = ""; // Canvas provides the key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const content = JSON.parse(result.candidates[0].content.parts[0].text);
        setFormData((prev) => ({
          ...prev,
          title: content.title || "",
          description: content.description || "",
          price: content.price || "",
          brand: content.brand || "",
          category: content.category || "",
        }));
      } else {
        throw new Error("No content was generated.");
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Failed to generate details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Sell your item</h2>
        <FormSection>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {image ? (
              <img
                src={image}
                alt="Item preview"
                className="max-h-48 mx-auto mb-4"
              />
            ) : (
              <label
                htmlFor="photo-upload"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              >
                {" "}
                <Icon className="mr-2 -ml-1">
                  <AddAPhotoIcon />
                </Icon>{" "}
                Add photos{" "}
              </label>
            )}
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="mt-4 bg-teal-50 text-teal-800 p-3 rounded-md flex items-center text-sm">
            {" "}
            <Icon className="mr-2">info</Icon>{" "}
            <span>
              Attract buyers - use quality photos.{" "}
              <a href="#" className="font-semibold underline">
                Discover how
              </a>
            </span>{" "}
          </div>
          <div className="mt-4">
            {" "}
            <Button
              onClick={generateDetailsWithAI}
              disabled={!image || isLoading}
              className="w-full md:w-auto"
            >
              {" "}
              {isLoading ? "Generating..." : "✨ Fill details with AI"}{" "}
            </Button>{" "}
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}{" "}
          </div>
        </FormSection>
        <FormSection>
          <div className="space-y-4">
            <TextInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Green Sézane shirt"
            />
            <hr />
            <TextArea
              label="Describe your item"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g. worn a few times, good condition"
            />
          </div>
        </FormSection>
        <FormSection>
          <div className="space-y-4">
            <div className="flex items-center">
              <label htmlFor="category" className="w-1/4 text-sm text-gray-600">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-3/4 p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none bg-transparent"
              >
                <option value="">Select a category</option>
                <option value="Women">Women</option>{" "}
                <option value="Men">Men</option>{" "}
                <option value="Kids">Kids</option>{" "}
                <option value="Home">Home</option>
              </select>
            </div>
            <hr />
            <TextInput
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="e.g. Nike, Sézane, etc."
            />
          </div>
        </FormSection>
        <FormSection>
          <div className="flex items-center">
            <label htmlFor="price" className="w-1/4 text-sm text-gray-600">
              Price
            </label>
            <div className="w-3/4 relative">
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="p-2 border-b border-gray-300 focus:border-teal-500 focus:outline-none w-full"
              />
              <span className="absolute right-2 top-2 text-gray-500">
                Tokens
              </span>
            </div>
          </div>
        </FormSection>
        <div className="border border-gray-200 rounded-lg p-4 mb-6 flex justify-between items-center">
          {" "}
          <p className="text-sm text-gray-600">
            What do you think of our new listing process?
          </p>{" "}
          <Button variant="secondary">Give feedback</Button>{" "}
        </div>
        <p className="text-xs text-gray-500 mb-6">
          A professional seller must register as a professional on EcoTroc and
          is subject to the sections provided in Terms 1, T&C 2, and the
          Consumer Code.
        </p>
        <div className="flex justify-end items-center space-x-4">
          {" "}
          <Button variant="secondary">Save draft</Button>{" "}
          <Button variant="primary">Add</Button>{" "}
        </div>
      </div>
    </main>
  );
}
