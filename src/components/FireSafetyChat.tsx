import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const FireSafetyChat: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('fire-safety-chat', {
        body: {
          messages: [...messages, userMessage],
          language
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      toast({
        title: language === 'fa' ? 'خطا' : 'Error',
        description: err.message || (language === 'fa' ? 'خطا در ارسال پیام' : 'Error sending message'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = language === 'fa' ? [
    'چه نوع کپسولی برای آشپزخانه صنعتی مناسب است؟',
    'استاندارد NFPA برای فاصله کپسول‌ها چیست؟',
    'تفاوت کپسول پودری و گازی چیست؟'
  ] : [
    'What type of extinguisher is suitable for industrial kitchens?',
    'What is the NFPA standard for extinguisher spacing?',
    'What is the difference between powder and gas extinguishers?'
  ];

  return (
    <Card className="border border-border shadow-soft h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          {language === 'fa' ? 'مشاور هوشمند اطفاء حریق' : 'AI Fire Safety Advisor'}
          <Sparkles className="h-4 w-4 text-warning ml-auto" />
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          {language === 'fa'
            ? 'سوالات خود درباره ایمنی و اطفاء حریق را بپرسید'
            : 'Ask your questions about fire safety and suppression'}
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <MessageCircle className="h-16 w-16 text-muted-foreground/40" />
            <p className="text-muted-foreground text-center">
              {language === 'fa'
                ? 'سوالات پیشنهادی:'
                : 'Suggested questions:'}
            </p>
            <div className="flex flex-col gap-2 w-full max-w-md">
              {suggestedQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="text-sm h-auto py-3 px-4 text-right whitespace-normal"
                  onClick={() => setInput(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'fa' ? 'پیام خود را بنویسید...' : 'Type your message...'}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
