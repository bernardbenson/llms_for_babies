'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSlideNavigation } from '@/lib/store'
import { 
  ChevronLeft, 
  ChevronRight, 
  Grid3X3, 
  Presentation,
  Settings,
  Keyboard,
  Maximize,
  Sun,
  Moon,
  Eye
} from 'lucide-react'

interface NavigationControlsProps {
  className?: string
}

export function NavigationControls({ className }: NavigationControlsProps) {
  const {
    canGoNext,
    canGoPrevious,
    nextSlide,
    previousSlide,
    toggleOverviewMode,
    togglePresenterMode,
    setIsPresenterViewOpen,
    toggleFullscreen,
    toggleKeyboardShortcuts,
    toggleAccessibilityPanel,
    settings,
    toggleTheme,
  } = useSlideNavigation()

  return (
    <motion.div
      className={cn(
        'fixed top-6 right-6 z-50 flex items-center gap-2',
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Theme toggle */}
      <Button
        variant="glass"
        size="icon"
        onClick={toggleTheme}
        aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} theme`}
        className="hover:scale-110"
      >
        {settings.theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>

      {/* Keyboard shortcuts */}
      <Button
        variant="glass"
        size="icon"
        onClick={toggleKeyboardShortcuts}
        aria-label="Show keyboard shortcuts"
        className="hover:scale-110"
      >
        <Keyboard className="h-4 w-4" />
      </Button>

      {/* Fullscreen */}
      <Button
        variant="glass"
        size="icon"
        onClick={toggleFullscreen}
        aria-label="Toggle fullscreen"
        className="hover:scale-110"
      >
        <Maximize className="h-4 w-4" />
      </Button>

      {/* Overview grid */}
      <Button
        variant="glass"
        size="icon"
        onClick={toggleOverviewMode}
        aria-label="Show slide overview"
        className="hover:scale-110"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>

      {/* Presenter mode */}
      <Button
        variant="glass"
        size="icon"
        onClick={togglePresenterMode}
        aria-label="Toggle presenter mode"
        className="hover:scale-110"
      >
        <Presentation className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-8 bg-border/50 mx-2" />

      {/* Navigation */}
      <Button
        variant="glass"
        size="icon"
        onClick={previousSlide}
        disabled={!canGoPrevious}
        aria-label="Previous slide"
        className="hover:scale-110"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="glass"
        size="icon"
        onClick={nextSlide}
        disabled={!canGoNext}
        aria-label="Next slide"
        className="hover:scale-110"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}