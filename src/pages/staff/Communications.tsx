
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, User, Clock, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

const Communications = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Communications</h1>
        <p className="text-muted-foreground">Team messages and notifications</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Chat</CardTitle>
              <CardDescription>Connect with your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="relative">
                  <Input placeholder="Search conversations..." />
                  <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Team Members */}
                {['Admin', 'Product Manager', 'Order Preparer', 'Delivery Staff'].map((role, index) => (
                  <Button
                    key={role}
                    variant="ghost"
                    className="w-full justify-start py-6 px-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{role}</p>
                        <p className="text-xs text-muted-foreground">Last message: 30 mins ago</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Important updates from management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'New Inventory Process', time: '2 hours ago' },
                  { title: 'Weekend Schedule Update', time: 'Yesterday' },
                  { title: 'System Maintenance Notice', time: '3 days ago' }
                ].map((announcement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {announcement.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chat with Admin</CardTitle>
                  <CardDescription>Online now</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-sm">Good morning! How's your shift going today?</p>
                    <p className="text-xs text-muted-foreground mt-1">9:30 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-primary p-3 rounded-lg rounded-tr-none max-w-[80%]">
                    <p className="text-sm text-primary-foreground">Hi there! It's going well. I'm processing the new arrivals now.</p>
                    <p className="text-xs text-primary-foreground/70 mt-1">9:32 AM</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-sm">Great! We just received a large order (#TTS-20250410-4253) that needs to be processed ASAP. Can you prioritize that one?</p>
                    <p className="text-xs text-muted-foreground mt-1">9:35 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-primary p-3 rounded-lg rounded-tr-none max-w-[80%]">
                    <p className="text-sm text-primary-foreground">Sure thing! I'll get on it right away.</p>
                    <p className="text-xs text-primary-foreground/70 mt-1">9:36 AM</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
            
            <div className="p-4 border-t mt-auto">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Type your message..."
                  className="flex-1 min-h-[1rem] h-9 resize-none"
                />
                <Button className="h-9">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Communications;
