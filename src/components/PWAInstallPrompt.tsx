import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { subscribe, getDeferredPrompt } from '../lib/pwa-install-store';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkInstalled();

    // Subscribe to shared prompt store (PWAWrapper captures the event)
    const unsubscribe = subscribe((prompt) => {
      setDeferredPrompt(prompt);
      if (prompt && !isInstalled) {
        setTimeout(() => {
          if (!isInstalled && typeof window !== 'undefined' && !localStorage.getItem('pwa-install-dismissed')) {
            setShowPrompt(true);
          }
        }, 3000);
      }
    });

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || (typeof window !== 'undefined' ? getDeferredPrompt() : null);
    if (!prompt) return;

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 dark:border-gray-700/50 p-3.5">
        <div className="flex items-start space-x-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-flame-400 to-flame-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Smartphone className="h-4 w-4 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 dark:text-white text-xs">
              Install Shame to Flame
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 leading-relaxed">
              Add our ministry app to your home screen for quick access to healing resources, even offline.
            </p>
            
            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center px-6 py-1.5 bg-flame-600 hover:bg-flame-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                <Download className="h-3 w-3 mr-1.5" />
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs whitespace-nowrap"
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
