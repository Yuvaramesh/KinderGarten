import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { sendImageToGemini } from "../lib/model";

interface Message {
  key: number;
  text: string;
  image?: string;
  isUser?: boolean;
}

interface ChatUIProps {
  imageSrc: string; // Base64 image passed as a prop
  onClose: () => void;
}

const ChatUI: React.FC<ChatUIProps> = ({ onClose, imageSrc }) => {
  const [imageInlineData, setImageInlineData] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      key: 1,
      image: imageSrc,
      text: "Analyze this image and give feedback",
      isUser: true,
    },
  ]);

  // Convert imageSrc to the format required by Gemini API
  useEffect(() => {
    const convertImageSrcToInlineData = async () => {
      if (imageSrc) {
        console.log(imageSrc);

        const base64Data = imageSrc.split(",")[1]; // Remove the "data:image/png;base64," prefix
        const mimeType = imageSrc.split(";")[0].split(":")[1]; // Extract MIME type

        setImageInlineData({
          inlineData: {
            data: base64Data,
            mimeType,
          },
        });
      }
    };

    convertImageSrcToInlineData();
  }, [imageSrc]);

  const handleSendToGemini = async () => {
    if (!imageInlineData) {
      console.error("No image data available.");
      return;
    }

    try {
      // Send the Base64 image to Gemini AI
      const aiResponse = await sendImageToGemini(imageInlineData);

      // Update the messages with the AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          key: prevMessages.length + 1,
          text: aiResponse,
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("Error sending image to Gemini AI:", error);
    }
  };

  // Automatically send to Gemini when imageInlineData is set
  useEffect(() => {
    if (imageInlineData) {
      handleSendToGemini();
    }
  }, [imageInlineData]);

  // Split text into lines for line-by-line typing
  const renderTextWithTypingEffect = (text: string) => {
    const lines = text.split("\n"); // Split text by newlines
    return lines.map((line, index) => (
      <span key={index} className="typing-animation">
        {line}
      </span>
    ));
  };

  return (
    <div className="fixed bottom-20 right-4 w-96 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-gray-300">
        <h3 className="font-bold">Chat with Shin-chan</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          X
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((message) => (
          <div
            key={message.key}
            className={`mb-2 p-2 rounded-lg ${message.isUser ? "bg-blue-100 ml-auto" : "bg-gray-100"
              } max-w-[80%]`}
          >
            {message.image && (
              <img
                src={message.image}
                alt="User uploaded"
                className="mt-2 rounded-lg"
              />
            )}
            {message.text ? (
              <p>{renderTextWithTypingEffect(message.text)}</p>
            ) : (
              <p>...processing</p>
            )}
          </div>
        ))}
      </div>
      <div className="p-2 border-t border-gray-300">
        <Button onClick={handleSendToGemini} className="w-full">
          Send to LLAMA AI
        </Button>
      </div>
    </div>
  );
};

export default ChatUI;
