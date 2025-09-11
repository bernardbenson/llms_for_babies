'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { KeyboardShortcut } from '@/lib/keyboard'

interface KeyboardShortcutsProps {
  shortcuts: Omit<KeyboardShortcut, 'action'>[]
  onClose: () => void
  className?: string
}

export function KeyboardShortcuts({ 
  shortcuts, 
  onClose, 
  className 
}: KeyboardShortcutsProps) {
  const categories = {
    navigation: shortcuts.filter(s => s.category === 'navigation'),
    presentation: shortcuts.filter(s => s.category === 'presentation'),
    tools: shortcuts.filter(s => s.category === 'tools'),
  }

  const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
      'left': '←',
      'right': '→',
      'up': '↑',
      'down': '↓',
      'space': 'Space',
      'escape': 'Esc',
      'meta': '⌘',
      'ctrl': 'Ctrl',
      'alt': 'Alt',
      'shift': 'Shift',
    }

    return key.split('+').map(k => keyMap[k] || k.toUpperCase()).join(' + ')
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
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
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close shortcuts"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-8">
              {Object.entries(categories).map(([categoryName, categoryShortcuts]) => (
                <div key={categoryName}>
                  <h3 className="text-lg font-semibold mb-4 capitalize text-primary">
                    {categoryName}
                  </h3>
                  <div className="grid gap-3">
                    {categoryShortcuts.map((shortcut) => (
                      <motion.div
                        key={shortcut.key}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
                        whileHover={{ scale: 1.02, backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                      >
                        <span className="text-foreground">{shortcut.description}</span>
                        <kbd className="px-3 py-1 text-sm font-mono bg-background border border-border rounded-md text-muted-foreground">
                          {formatKey(shortcut.key)}
                        </kbd>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
              Press <kbd className="px-2 py-1 bg-muted rounded">K</kbd> or{' '}
              <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> to close
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}