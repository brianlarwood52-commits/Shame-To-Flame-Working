'use client'

import { Download } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isRunningStandalone() {
  if (typeof window === 'undefined') return false

  // iOS Safari
  const nav = navigator as unknown as { standalone?: boolean }
  if (typeof nav.standalone === 'boolean' && nav.standalone) return true

  // Most browsers
  return window.matchMedia?.('(display-mode: standalone)')?.matches ?? false
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    setInstalled(isRunningStandalone())

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const onAppInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
    }

    const onDisplayModeChange = () => {
      setInstalled(isRunningStandalone())
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
    window.matchMedia?.('(display-mode: standalone)')?.addEventListener('change', onDisplayModeChange)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
      window.matchMedia?.('(display-mode: standalone)')?.removeEventListener('change', onDisplayModeChange)
    }
  }, [])

  const shouldShow = useMemo(() => {
    if (installed) return false
    return true
  }, [installed])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    try {
      setIsInstalling(true)
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
      // If accepted, appinstalled will fire; if dismissed, they can still try again later.
      setDeferredPrompt(null)
    } finally {
      setIsInstalling(false)
    }
  }

  if (!shouldShow) return null

  return (
    <div>
      <h3 className="font-semibold text-base uppercase tracking-wider mb-4 text-flame-300">Install App</h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        Read devotionals offline and open instantly from your home screen.
      </p>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleInstall}
          disabled={!deferredPrompt || isInstalling}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-flame-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-flame-900/20 transition-all duration-300 hover:from-flame-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          title={!deferredPrompt ? 'Install will be available once your browser marks the site as installable.' : undefined}
        >
          <Download className="h-4 w-4" />
          {isInstalling ? 'Opening…' : 'Install App'}
        </button>
        {!deferredPrompt && (
          <p className="mt-2 text-xs text-gray-500">
            If you don’t see install yet, use your browser menu to install (or “Add to Home Screen” on iPhone/iPad).
          </p>
        )}
      </div>
    </div>
  )
}
