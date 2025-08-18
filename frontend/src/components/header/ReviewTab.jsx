import { useCallback, useState } from "react";
import Button from "../ui/Button";

const ReviewsTab = ({ user, reviews }) => {
  const [summary, setSummary] = useState("");
  const [isSummaryLoading, setSummaryLoading] = useState(false);
  const [generatedReplies, setGeneratedReplies] = useState({});
  const [isReplyLoading, setReplyLoading] = useState(null);

  const summarizeReviews = useCallback(async () => {
    setSummaryLoading(true);
    const allComments = reviews.map((r) => r.comment).join("\n");
    const prompt = `Summarize the following marketplace reviews for a seller. Highlight the key positive points and any recurring themes. The summary should be concise and encouraging. Reviews:\n\n${allComments}`;
    try {
      const apiKey = ""; // Canvas provides the key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      setSummary(result.candidates[0].content.parts[0].text);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setSummary("Could not generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  }, [reviews]);

  const generateReply = useCallback(async (reviewId, comment) => {
    setReplyLoading(reviewId);
    const prompt = `A seller received the following review: "${comment}". Write a short, polite, and friendly reply to thank the buyer.`;
    try {
      const apiKey = ""; // Canvas provides the key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      setGeneratedReplies((prev) => ({
        ...prev,
        [reviewId]: result.candidates[0].content.parts[0].text,
      }));
    } catch (err) {
      console.error("Gemini API Error:", err);
      setGeneratedReplies((prev) => ({
        ...prev,
        [reviewId]: "Error generating reply.",
      }));
    } finally {
      setReplyLoading(null);
    }
  }, []);

  return (
    <div className="p-4 md:p-6 bg-white border rounded-lg">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <Button onClick={summarizeReviews} disabled={isSummaryLoading}>
          {isSummaryLoading ? "Analyzing..." : "✨ Summarize My Reviews"}
        </Button>
        {summary && (
          <p className="text-sm text-gray-700 mt-4 whitespace-pre-wrap">
            {summary}
          </p>
        )}
      </div>
      {reviews.map((review) => (
        <div key={review.id} className="border-t py-4">
          <div className="flex items-start gap-4">
            <img
              src={review.avatarUrl}
              alt={review.author}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              {/* ... review details ... */}
              <p className="font-bold">{review.author}</p>
              <p className="text-sm text-gray-700">{review.comment}</p>
              <Button
                variant="secondary"
                onClick={() => generateReply(review.id, review.comment)}
                disabled={isReplyLoading === review.id}
                className="mt-2 text-xs !px-2 !py-1"
              >
                {isReplyLoading === review.id
                  ? "Thinking..."
                  : "✨ Reply with AI"}
              </Button>
              {generatedReplies[review.id] && (
                <div className="mt-2 p-2 bg-teal-50 rounded-md text-sm text-teal-800">
                  <strong>Suggested Reply:</strong>{" "}
                  {generatedReplies[review.id]}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsTab;
