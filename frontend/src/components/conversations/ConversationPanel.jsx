import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Modal from "../ui/Modal";
import SummarizeIcon from "@mui/icons-material/Summarize";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../../context/AuthContextProvider";
import useRequestResource from "../../hooks/useRequestResource";
import MessageContainer from "./MessageContainer";

const ConversationPanel = ({ conversationId }) => {
  const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummaryLoading, setSummaryLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [isQuickReplyLoading, setQuickReplyLoading] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const { getResourceList, resourceList, addResource } = useRequestResource({
    endpoint: `conversations/${conversationId}/messages`,
    resourceLabel: "messages",
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const summarizeConversation = useCallback(async () => {
    setSummaryLoading(true);
    setSummary("");
    const conversationText = resourceList.results
      .map((m) => `${m.sender}: ${m.text || `(sent an offer: ${m.price})`}`)
      .join("\n");
    const prompt = `Summarize the following conversation concisely:\n\n${conversationText}`;
    try {
      const apiKey = "";
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
  }, [resourceList]);

  const generateQuickReplies = useCallback(async () => {
    setQuickReplyLoading(true);
    setQuickReplies([]);
    const lastMessage = resourceList.results
      .filter((m) => m.sender !== "me")
      .pop();
    if (!lastMessage) {
      setQuickReplyLoading(false);
      return;
    }
    const prompt = `Based on the last message in a conversation, suggest three short, distinct, and relevant replies. The last message is: "${lastMessage.text}". Return a JSON array of 3 strings.`;
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
      const replies = JSON.parse(result.candidates[0].content.parts[0].text);
      setQuickReplies(replies);
    } catch (err) {
      console.error("Gemini API Error:", err);
    } finally {
      setQuickReplyLoading(false);
    }
  }, [resourceList]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    addResource(
      {
        content: messageInput,
      },
      () => {
        getResourceList(); // Re-fetch the messages to include the new one
        setMessageInput("");
      }
    );
  };

  useEffect(() => {
    getResourceList();
  }, [getResourceList, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [resourceList]);

  if (!user) return null;

  return (
    <>
      <div className="flex-1 flex flex-col h-full">
        <div className="p-3 flex justify-between items-center border-b border-gray-500">
          <div className="flex items-center gap-2 h-5">
            <button
              onClick={() => {
                setSummaryModalOpen(true);
                summarizeConversation();
              }}
              className="text-gray-500 hover:text-gray-800"
            >
              <Icon>
                <SummarizeIcon />
              </Icon>
            </button>
            <Icon>
              <InfoOutlineIcon />
            </Icon>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto rounded-lg">
          {resourceList.results.map((msg) => (
            <MessageContainer key={msg.id} msg={msg} user={user} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t bg-white">
          {quickReplies.length > 0 && (
            <div className="flex gap-2 mb-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => setMessageInput(reply)}
                  className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full hover:bg-teal-100"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
          <div className="relative">
            <form onSubmit={handleSendMessage} className="relative w-full">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Envoyer un message"
                className="w-full border rounded-full py-2 px-10"
              />
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                <AddPhotoAlternateIcon />
              </Icon>
            </form>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                onClick={generateQuickReplies}
                disabled={isQuickReplyLoading}
                variant="secondary"
                className="!w-auto !py-1 !px-2 !text-xs"
              >
                {isQuickReplyLoading ? "..." : "✨ Quick Reply"}
              </Button>
              <Icon
                onClick={handleSendMessage}
                className="text-gray-400 cursor-pointer"
              >
                <SendIcon />
              </Icon>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        title="✨ Conversation Summary"
      >
        {isSummaryLoading ? (
          <p>Summarizing...</p>
        ) : (
          <p className="text-sm text-gray-700">{summary}</p>
        )}
      </Modal>
    </>
  );
};

export default ConversationPanel;
