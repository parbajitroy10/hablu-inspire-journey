
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hello! I'm your InspireMe AI assistant. How can I help you with your self-improvement journey today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate AI response after short delay
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Based on your progress, I suggest focusing on your academics mission this week.",
        "I can help you with that. Have you tried setting smaller, achievable goals to build momentum?",
        "Your consistency is impressive! Keep up with your daily goals and you'll see significant improvement soon.",
        "Let me find some resources for you on that topic. Would you prefer articles, videos, or interactive exercises?",
        "Based on your recent activity, you might enjoy trying meditation to improve your mental wellness score.",
        "Remember, progress isn't always linear. Small steps consistently taken lead to big results!",
        "I've noticed you've been completing your fitness goals regularly. Great job maintaining that habit!"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button 
          onClick={toggleChat} 
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg p-3 h-12 w-12"
          size="icon"
        >
          <Bot size={20} />
        </Button>
      )}
      
      {/* Chat window */}
      <div className={cn(
        "fixed z-50 transition-all duration-300 ease-in-out",
        isOpen ? "bottom-20 right-4 opacity-100" : "bottom-20 right-4 opacity-0 pointer-events-none",
        isMinimized ? "h-14 w-72" : "h-96 w-80 sm:w-96"
      )}>
        <Card className="h-full flex flex-col shadow-lg border border-border">
          <CardHeader className="p-3 border-b cursor-pointer" onClick={toggleMinimize}>
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm flex items-center">
                <Bot size={18} className="mr-2 text-primary" />
                InspireMe Assistant
              </CardTitle>
              <div className="flex gap-1">
                {isMinimized ? (
                  <Maximize size={18} className="text-muted-foreground cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    toggleMinimize();
                  }} />
                ) : (
                  <Minimize size={18} className="text-muted-foreground cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    toggleMinimize();
                  }} />
                )}
                <X 
                  size={18} 
                  className="text-muted-foreground cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }} 
                />
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={cn(
                      "p-2 rounded-lg max-w-[80%]",
                      msg.sender === 'user' 
                        ? "bg-primary text-white ml-auto" 
                        : "bg-muted"
                    )}
                  >
                    {msg.text}
                    <div className={cn(
                      "text-[10px] mt-1",
                      msg.sender === 'user' ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>
              
              <CardFooter className="p-3 pt-0">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send size={16} />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default AIAssistant;
