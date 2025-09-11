'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Contrast, 
  Minus, 
  Plus,
  Settings,
  RotateCcw,
  Keyboard,
  MousePointer
} from 'lucide-react'

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function AccessibilityPanel({ isOpen, onClose, className }: AccessibilityPanelProps) {
  const [settings, setSettings] = useState({
    fontSize: 16,
    highContrast: false,
    reduceMotion: false,
    focusOutlines: true,
    screenReaderMode: false,
    autoAdvance: false,
    keyboardNavigation: true
  })

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Apply settings to document
    const root = document.documentElement
    
    switch (key) {
      case 'fontSize':
        root.style.fontSize = `${value}px`
        break
      case 'highContrast':
        root.classList.toggle('high-contrast', value as boolean)
        break
      case 'reduceMotion':
        root.classList.toggle('reduce-motion', value as boolean)
        break
      case 'focusOutlines':
        root.classList.toggle('focus-outlines', value as boolean)
        break
    }
  }

  const resetSettings = () => {
    const defaults = {
      fontSize: 16,
      highContrast: false,
      reduceMotion: false,
      focusOutlines: true,
      screenReaderMode: false,
      autoAdvance: false,
      keyboardNavigation: true
    }
    
    setSettings(defaults)
    
    // Reset document styles
    const root = document.documentElement
    root.style.fontSize = '16px'
    root.classList.remove('high-contrast', 'reduce-motion')
    root.classList.add('focus-outlines')
  }

  // Apply initial settings
  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${settings.fontSize}px`
    root.classList.toggle('high-contrast', settings.highContrast)
    root.classList.toggle('reduce-motion', settings.reduceMotion)
    root.classList.toggle('focus-outlines', settings.focusOutlines)
  }, [])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={cn('w-full max-w-2xl m-6', className)}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="glass-card">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Accessibility Settings
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close accessibility settings"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-border/30 pb-2">
                  Visual Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Font Size */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Font Size
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                        disabled={settings.fontSize <= 12}
                        aria-label="Decrease font size"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="px-3 py-1 bg-muted rounded text-sm">
                        {settings.fontSize}px
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
                        disabled={settings.fontSize >= 24}
                        aria-label="Increase font size"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* High Contrast */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Contrast className="w-4 h-4" />
                      High Contrast Mode
                    </label>
                    <Button
                      variant={settings.highContrast ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSetting('highContrast', !settings.highContrast)}
                      className="w-full"
                    >
                      {settings.highContrast ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reduce Motion */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Reduce Motion
                    </label>
                    <Button
                      variant={settings.reduceMotion ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
                      className="w-full"
                    >
                      {settings.reduceMotion ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  {/* Focus Outlines */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MousePointer className="w-4 h-4" />
                      Focus Outlines
                    </label>
                    <Button
                      variant={settings.focusOutlines ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSetting('focusOutlines', !settings.focusOutlines)}
                      className="w-full"
                    >
                      {settings.focusOutlines ? 'Visible' : 'Hidden'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Navigation Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b border-border/30 pb-2">
                  Navigation Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Keyboard Navigation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Keyboard className="w-4 h-4" />
                      Keyboard Navigation
                    </label>
                    <Button
                      variant={settings.keyboardNavigation ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                      className="w-full"
                    >
                      {settings.keyboardNavigation ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                  
                  {/* Screen Reader Mode */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      Screen Reader Mode
                    </label>
                    <Button
                      variant={settings.screenReaderMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSetting('screenReaderMode', !settings.screenReaderMode)}
                      className="w-full"
                    >
                      {settings.screenReaderMode ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex justify-center pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  onClick={resetSettings}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Skip Link Component for screen readers
export function SkipLinks() {
  return (
    <div className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300]">
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          const main = document.querySelector('main')
          if (main) {
            main.focus()
            main.scrollIntoView()
          }
        }}
        className="bg-primary text-primary-foreground"
      >
        Skip to main content
      </Button>
    </div>
  )
}

// Live Region for announcing slide changes to screen readers
export function LiveRegion({ currentSlide, totalSlides, slideTitle }: {
  currentSlide: number
  totalSlides: number
  slideTitle?: string
}) {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const message = `Slide ${currentSlide + 1} of ${totalSlides}${slideTitle ? `: ${slideTitle}` : ''}`
    setAnnouncement(message)
    
    // Clear announcement after a delay to avoid repeated announcements
    const timeout = setTimeout(() => setAnnouncement(''), 1000)
    return () => clearTimeout(timeout)
  }, [currentSlide, totalSlides, slideTitle])

  return (
    <div
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {announcement}
    </div>
  )
}

// Focus management hook for modal dialogs and overlays
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Let parent components handle escape
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
        container.dispatchEvent(escapeEvent)
      }
    }

    // Focus first element when trap becomes active
    firstElement?.focus()

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, containerRef])
}

// ARIA attributes helper for slide content
export function getSlideAriaProps(slideIndex: number, totalSlides: number, slideTitle?: string) {
  return {
    role: 'region',
    'aria-label': `Slide ${slideIndex + 1} of ${totalSlides}${slideTitle ? `: ${slideTitle}` : ''}`,
    'aria-live': 'polite' as const,
    tabIndex: -1
  }
}