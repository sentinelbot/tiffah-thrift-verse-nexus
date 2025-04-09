
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, Loader2, ShoppingBag } from "lucide-react";
import { getAIChatResponse } from '@/services/aiService';
import { Link } from 'react-router-dom';

interface Message {
  role: 'user' | 'bot';
  content: string;
  products?: {id: string, name: string}[];
  timestamp: Date;
}

const CustomerServiceChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'Hello! Welcome to Tiffah Thrift Store. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await getAIChatResponse(inputValue);
      
      const botResponse: Message = {
        role: 'bot',
        content: response.answer,
        timestamp: new Date(),
      };
      
      // If there are related products, add them to the message
      if (response.relatedProducts && response.relatedProducts.length > 0) {
        // Ideally we would fetch product details here
        botResponse.products = response.relatedProducts.map(id => ({
          id,
          name: `Product ${id}` // This would be replaced with actual product name
        }));
      }
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage: Message = {
        role: 'bot',
        content: "I'm sorry, I'm having trouble connecting. Please try again later or contact our customer service team directly at help@tiffahthrift.com",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Chat Button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Bot size={24} />
      </Button>
      
      {/* Chat Dialog */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-full max-w-sm z-50">
          <Card className="h-[500px] flex flex-col shadow-xl border-2">
            <CardHeader className="bg-primary/10 border-b">
              <CardTitle className="flex items-center text-base">
                <Bot className="mr-2 h-5 w-5 text-primary" />
                Tiffah Assistant
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto h-8 w-8 p-0 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  &times;
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    } rounded-lg p-3`}
                  >
                    <div className="flex-shrink-0 mr-2">
                      {message.role === 'user' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Related Products */}
                      {message.products && message.products.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs mb-1">You might be interested in:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.products.map(product => (
                              <Link 
                                key={product.id} 
                                to={`/product/${product.id}`} 
                                className="text-xs bg-background text-foreground px-2 py-1 rounded-full flex items-center gap-1"
                              >
                                <ShoppingBag className="h-3 w-3" />
                                {product.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <span className="text-xs opacity-70 block mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 flex items-center">
                    <Bot className="h-5 w-5 mr-2" />
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-xs">Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>
            
            <CardFooter className="p-2 border-t bg-background">
              <div className="flex w-full items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  size="icon" 
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default CustomerServiceChat;
