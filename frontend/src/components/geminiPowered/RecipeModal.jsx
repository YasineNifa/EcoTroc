import { useCallback, useEffect, useState } from "react";
import Modal from "../ui/Modal";

const RecipeModal = ({ isOpen, onClose, itemTitle }) => {
  const [recipe, setRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipe = useCallback(async () => {
    if (!itemTitle) return;

    setIsLoading(true);
    setError("");
    setRecipe("");

    const prompt = `You are a creative chef. Give me a simple and delicious recipe idea for "${itemTitle}". The recipe should be easy to follow for a beginner. Format it nicely with a title, ingredients list, and steps.`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`API request failed with status ${response.status}`);

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const generatedText = result.candidates[0].content.parts[0].text;
        // Basic markdown-like formatting for display
        const formattedText = generatedText
          .replace(
            /### (.*)/g,
            '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>'
          )
          .replace(/\* (.*)/g, '<li class="ml-5 list-disc">$1</li>')
          .replace(/(\d)\. (.*)/g, '<li class="ml-5 list-decimal">$1. $2</li>');
        setRecipe(formattedText);
      } else {
        throw new Error("Aucune recette n'a été générée.");
      }
    } catch (err) {
      console.error("Error calling Gemini API:", err);
      setError(
        "Désolé, impossible de générer une recette pour le moment. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  }, [itemTitle]);

  // Fetch recipe when the modal opens or itemTitle changes
  useEffect(() => {
    if (isOpen) {
      fetchRecipe();
    }
  }, [isOpen, fetchRecipe]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Idée recette pour : ${itemTitle}`}
    >
      {isLoading && <p>✨ Un instant, nous concoctons une idée pour vous...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {recipe && (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: recipe }}
        />
      )}
    </Modal>
  );
};

export default RecipeModal;
