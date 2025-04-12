
import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const dummyResponses = [
  "I'll check your medical history and get back to you shortly.",
  "Based on your symptoms, I'd recommend scheduling an appointment with Dr. Sharma.",
  "Your test results look normal. No need to worry!",
  "Remember to take your medication regularly as prescribed.",
  "Would you like me to schedule a follow-up appointment for you?",
  "Drinking plenty of water and getting adequate rest will help with your recovery.",
  "I've updated your medical records with this new information.",
  "Your insurance should cover this procedure. Let me double-check for you.",
  "The pharmacy has been notified and your prescription will be ready in 30 minutes.",
  "Is there anything else I can help you with regarding your treatment plan?",
];

const AIChatbot = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm AssistMed AI. How can I help you with your healthcare needs today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">AI Health Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400">Get healthcare assistance and information instantly</p>
      </div>
      
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        <Card className="flex-grow flex flex-col overflow-hidden glass-card">
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className={message.sender === "user" ? "bg-indigo-100" : "bg-blue-100"}>
                    {message.sender === "user" ? (
                      <>
                        <AvatarFallback>U</AvatarFallback>
                        <User className="h-5 w-5 text-indigo-600" />
                      </>
                    ) : (
                      <>
                        <AvatarFallback>AI</AvatarFallback>
                        <Bot className="h-5 w-5 text-blue-600" />
                      </>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-indigo-600 text-white glass-button"
                        : "bg-gray-100 dark:bg-gray-800 glass-button"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="bg-blue-100">
                    <AvatarFallback>AI</AvatarFallback>
                    <Bot className="h-5 w-5 text-blue-600" />
                  </Avatar>
                  <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-800 glass-button">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </CardContent>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your health-related question..."
                className="flex-grow glass-input"
                disabled={isTyping}
              />
              <Button 
                type="submit" 
                disabled={isTyping || !input.trim()} 
                className="glass-button bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              This AI assistant is for informational purposes only. For medical emergencies, please contact your doctor or visit the nearest hospital.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIChatbot;
