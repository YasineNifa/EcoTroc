import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const BioGeneratorModal = ({ isOpen, onClose, onBioGenerated }) => {
  const [keywords, setKeywords] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateBio = async () => {
    if (!keywords) {
      setError("Please enter at least one keyword.");
      return;
    }
    setIsLoading(true);
    setError("");

    const prompt = `Write a friendly and engaging marketplace bio for a seller who describes themselves with these keywords: "${keywords}". The bio should be short, welcoming, and encourage people to check out their items.`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const newBio = result.candidates[0].content.parts[0].text;
        onBioGenerated(newBio);
        onClose();
      } else {
        throw new Error("No bio was generated.");
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Failed to generate bio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✨ Generate Bio with AI">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Enter some keywords about yourself or your shop (e.g., "vintage lover,
          fast shipping, minimalist style").
        </p>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Keywords..."
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <Button onClick={generateBio} disabled={isLoading} className="w-full">
          {isLoading ? "Generating..." : "Generate Bio"}
        </Button>
      </div>
    </Modal>
  );
};

export default BioGeneratorModal;
