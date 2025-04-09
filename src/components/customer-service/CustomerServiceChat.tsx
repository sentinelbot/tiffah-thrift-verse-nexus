import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SendHorizonal, MessagesSquare, MinusCircle, Bot, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const CustomerServiceChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm Tiffah's assistant. How can I help you with our second-hand clothing and accessories today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const { data, error } = await supabase.functions.invoke('customer-service-chat', {
        body: { question: input },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      if (data.relatedProducts && data.relatedProducts.length > 0) {
        setRelatedProducts(data.relatedProducts);
      }
    } catch (error) {
      console.error('Error querying AI assistant:', error);
      toast.error('Sorry, I had trouble processing your question. Please try again.');
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact customer service directly.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderChatContent = () => (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Tiffah Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about products, shipping, returns, etc.
        </CardDescription>
      </CardHeader>
      <ScrollArea className="h-[300px] px-4">
        <div className="space-y-4 pt-1 pb-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                {!message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <CardFooter className="pt-3 pb-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="outline" className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg">
          <MessagesSquare className="h-6 w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Customer Support</DrawerTitle>
          <DrawerDescription>
            Get help with your shopping experience
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          {renderChatContent()}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg">
          <MessagesSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customer Support</DialogTitle>
          <DialogDescription>
            Get help with your shopping experience
          </DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          {renderChatContent()}
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerServiceChat;
