import React from "react";
import { Button } from "./ui/button";

interface Message {
  key: number;
  text?: string;
  image?: string;
  isUser?: boolean;
}

interface ChatUIProps {
  onClose: () => void;
  messages: Message[]; // Array of messages to display
}

const ChatUI: React.FC<ChatUIProps> = ({ onClose, messages }) => {
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
            className={`mb-2 p-2 rounded-lg ${
              message.isUser ? "bg-blue-100 ml-auto" : "bg-gray-100"
            } max-w-[80%]`}
          >
            {message.image && (
              <img
                src={message.image}
                alt="User uploaded"
                className="mt-2 rounded-lg"
              />
            )}
            {message.text && (
              <p className="text-sm whitespace-pre-line">
                {message.isUser ? message.text : message.text}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatUI;
