import { useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

const AskAIModal = ({ isOpen, onClose, listing }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskQuestion = async () => {
    if (!question) {
      setError("Please enter a question.");
      return;
    }
    setIsLoading(true);
    setError("");
    setAnswer("");

    const context = `Item Title: ${listing.title}, Brand: ${listing.brand}, Description: ${listing.description}, Color: ${listing.color}.`;
    const prompt = `Based on the following item details, answer the user's question. Item Details: ${context}. User Question: "${question}"`;

    try {
      const apiKey = ""; // Canvas provides the key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        setAnswer(result.candidates[0].content.parts[0].text);
      } else {
        throw new Error("No answer was generated.");
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("Failed to get an answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✨ Ask AI a Question">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Ask anything about this item, like "what occasions would this be
          suitable for?" or "is this material breathable?".
        </p>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Your question..."
          rows="3"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <Button
          onClick={handleAskQuestion}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Thinking..." : "Get Answer"}
        </Button>
        {answer && (
          <div className="mt-4 p-4 bg-teal-50 rounded-md text-sm text-teal-800">
            <p className="font-bold mb-2">AI Assistant:</p>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AskAIModal;
