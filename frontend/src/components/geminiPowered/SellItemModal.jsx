import { useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

const SellItemModal = ({ isOpen, onClose }) => {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDescription = async () => {
    if (!imageBase64) {
      setError("Veuillez d'abord télécharger une image.");
      return;
    }
    setIsLoading(true);
    setError("");

    const prompt =
      "Analyze this image of an item for a marketplace. Provide a short, catchy title, a detailed description (mentioning potential material, style, and condition), and a suggested price in the platform's virtual currency, 'Jetons'. Return the response as a JSON object with keys: 'title', 'description', and 'price'.";

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
            ],
          },
        ],
        generation_config: {
          response_mime_type: "application/json",
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const generatedContent = JSON.parse(
          result.candidates[0].content.parts[0].text
        );
        setTitle(generatedContent.title || "");
        setDescription(generatedContent.description || "");
        setPrice(generatedContent.price || "");
      } else {
        throw new Error("Aucun contenu n'a été généré.");
      }
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      setError(
        "Une erreur est survenue lors de la génération de la description. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vendre un article">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo de l'article
          </label>
          <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
            {image ? (
              <img
                src={image}
                alt="Aperçu de l'article"
                className="h-full w-full object-contain"
              />
            ) : (
              <p className="text-gray-400">Aperçu de l'image</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 text-sm"
          />
        </div>
        <div className="space-y-4">
          <div>
            <Button
              onClick={generateDescription}
              disabled={!image || isLoading}
              className="w-full"
            >
              {isLoading
                ? "Génération en cours..."
                : "✨ Générer la description avec l'IA"}
            </Button>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Titre
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Prix (en Jetons)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>Mettre en vente</Button>
      </div>
    </Modal>
  );
};

export default SellItemModal;
