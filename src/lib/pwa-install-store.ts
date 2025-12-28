// Shared store for PWA install prompt across components
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners: Set<(prompt: BeforeInstallPromptEvent | null) => void> = new Set();

export function setDeferredPrompt(prompt: BeforeInstallPromptEvent | null) {
  deferredPrompt = prompt;
  listeners.forEach(listener => listener(prompt));
}

export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

export function subscribe(listener: (prompt: BeforeInstallPromptEvent | null) => void) {
  listeners.add(listener);
  // Immediately call with current value
  listener(deferredPrompt);
  
  return () => {
    listeners.delete(listener);
  };
}
