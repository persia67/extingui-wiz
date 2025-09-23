import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 max-w-sm shadow-large border-primary/20 z-50" dir="rtl">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              نصب روی دسکتاپ
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              برای دسترسی آسان‌تر، این برنامه را روی دسکتاپ نصب کنید
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="bg-gradient-fire hover:opacity-90"
              >
                <Download className="w-4 h-4 ml-1" />
                نصب
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
              >
                <X className="w-4 h-4 ml-1" />
                رد کردن
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};