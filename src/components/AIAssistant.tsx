
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, Maximize, Minimize, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getCategories, getGoals, generateMotivationMessage } from '@/utils/data';
import { getCurrentUser } from '@/utils/auth';

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
  const [isTyping, setIsTyping] = useState(false);
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
    setIsTyping(true);
    
    // Process the message to generate a relevant response
    setTimeout(() => {
      const response = generateResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const generateResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    const user = getCurrentUser();
    const categories = getCategories();
    const goals = getGoals();
    
    // Check for common queries and generate appropriate responses
    if (lowerCaseMessage.includes('goal') && (lowerCaseMessage.includes('add') || lowerCaseMessage.includes('create'))) {
      return "To add a new goal, go to the Goals page or click on a specific mission and use the 'Add Goal' button. What kind of goal are you thinking of setting?";
    }
    
    if (lowerCaseMessage.includes('progress') || lowerCaseMessage.includes('how am i doing')) {
      const overallProgress = user?.overallProgress || 0;
      return `You're currently at ${overallProgress}% overall progress across all your missions. ${generateMotivationMessage()}`;
    }
    
    if (lowerCaseMessage.includes('mission') && (lowerCaseMessage.includes('create') || lowerCaseMessage.includes('add'))) {
      return "To add a new mission, navigate to the dashboard and look for the '+' card in the missions section. What kind of mission would you like to create?";
    }
    
    if (lowerCaseMessage.includes('motivation') || lowerCaseMessage.includes('inspire') || lowerCaseMessage.includes('encourage')) {
      return generateMotivationMessage();
    }
    
    if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('how to')) {
      return "I can help you with your self-improvement journey! I can provide advice on setting goals, track your progress, offer motivation, and answer questions about using the app. What specific help do you need?";
    }
    
    // If no specific query is detected, analyze the user's data to provide a relevant response
    const pendingGoals = goals.filter(g => !g.completed);
    const completedGoalsCount = goals.filter(g => g.completed).length;
    const totalGoals = goals.length;
    
    if (pendingGoals.length > 0) {
      const randomPendingGoal = pendingGoals[Math.floor(Math.random() * pendingGoals.length)];
      return `I notice you have a pending goal: "${randomPendingGoal.title}". Would you like some tips on how to accomplish this?`;
    }
    
    if (categories.length > 0) {
      const lowestProgressCategory = [...categories].sort((a, b) => a.progress - b.progress)[0];
      return `I see that your "${lowestProgressCategory.name}" mission has the lowest progress at ${lowestProgressCategory.progress}%. Would you like some suggestions to improve in this area?`;
    }
    
    // Default responses if all else fails
    const defaultResponses = [
      "I'm here to help you achieve your goals! What would you like to focus on today?",
      "Remember, small consistent steps lead to big results over time. How can I support your journey today?",
      "Your progress matters! Let me know if you need specific advice or motivation for any of your missions.",
      "Setting clear, achievable goals is key to success. Can I help you define your next goal?",
      "Success is a journey, not a destination. How can I help you on your path today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleAddSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };
  
  const suggestions = [
    "How am I doing overall?",
    "Give me motivation",
    "How do I add a goal?",
    "Tips for achieving goals"
  ];
  
  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button 
          onClick={toggleChat} 
          className="fixed bottom-20 right-4 z-50 rounded-full shadow-lg p-3 h-12 w-12 animate-pulse bg-gradient-to-r from-primary to-purple-600"
          size="icon"
        >
          <Bot size={20} className="text-white" />
        </Button>
      )}
      
      {/* Chat window */}
      <div className={cn(
        "fixed z-50 transition-all duration-300 ease-in-out",
        isOpen ? "bottom-20 right-4 opacity-100" : "bottom-20 right-4 opacity-0 pointer-events-none",
        isMinimized ? "h-14 w-72" : "h-[28rem] w-80 sm:w-96"
      )}>
        <Card className="h-full flex flex-col shadow-lg border border-border">
          <CardHeader className="p-3 border-b cursor-pointer bg-gradient-to-r from-primary/20 to-purple-500/20" onClick={toggleMinimize}>
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
                
                {isTyping && (
                  <div className="p-2 rounded-lg max-w-[80%] bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>
              
              <div className="px-3 py-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                      onClick={() => handleAddSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              
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
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={isTyping || message.trim() === ''}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    {isTyping ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send size={16} />
                    )}
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
