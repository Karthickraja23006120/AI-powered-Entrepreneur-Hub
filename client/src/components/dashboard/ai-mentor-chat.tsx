import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AIMentorChat() {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/mentor/messages"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/mentor/chat", { message });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mentor/messages"] });
      setMessage("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !chatMutation.isPending) {
      chatMutation.mutate(message.trim());
    }
  };

  return (
    <Card className="p-6 shadow-lg" data-testid="ai-mentor-chat">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">AI Business Mentor</h4>
        <Bot className="h-5 w-5 text-primary" />
      </div>
      
      <ScrollArea className="h-64 mb-4 pr-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 max-w-md">
                <p className="text-sm">
                  Hello! I'm your AI business mentor. I'm here to help you with any questions about entrepreneurship, business strategy, funding, and more. What would you like to discuss?
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg: any) => (
              <div 
                key={msg.id} 
                className={`flex items-start space-x-3 ${msg.isUser ? 'justify-end' : ''}`}
                data-testid={msg.isUser ? "message-user" : "message-ai"}
              >
                {!msg.isUser && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg p-3 max-w-md ${
                  msg.isUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
                {msg.isUser && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {chatMutation.isPending && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 max-w-md">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your AI mentor anything..."
          disabled={chatMutation.isPending}
          data-testid="input-chat-message"
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={!message.trim() || chatMutation.isPending}
          data-testid="button-send-message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
