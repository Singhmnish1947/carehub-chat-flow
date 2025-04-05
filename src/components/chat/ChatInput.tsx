
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperPlane, Paperclip, Smile } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t border-care-border bg-white p-4 sticky bottom-0 w-full"
    >
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-gray-500 hover:text-care-dark"
          disabled={disabled}
        >
          <Paperclip size={20} />
          <span className="sr-only">Attach file</span>
        </Button>
        
        <div className="relative flex-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="pr-10 focus-visible:ring-care-primary"
            disabled={disabled}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full text-gray-500 hover:text-care-dark"
            disabled={disabled}
          >
            <Smile size={20} />
            <span className="sr-only">Add emoji</span>
          </Button>
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          className="bg-care-primary hover:bg-care-dark text-white"
          disabled={disabled || message.trim() === ""}
        >
          <PaperPlane size={20} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
