'use client'

import React, { useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { usePresentationStore, useSlideNavigation } from '@/lib/store'
import { KeyboardManager, TouchManager, defaultShortcuts } from '@/lib/keyboard'
import { Slide } from '@/components/slides/slide'
import { ProgressBar } from '@/components/presentation/progress-bar'
import { NavigationControls } from '@/components/presentation/navigation-controls'
import { KeyboardShortcuts } from '@/components/presentation/keyboard-shortcuts'
import { PresenterView } from '@/components/presentation/presenter-view'
import { SlideOverview } from '@/components/presentation/slide-overview'
import { 
  AccessibilityPanel, 
  SkipLinks, 
  LiveRegion, 
  useFocusTrap,
  getSlideAriaProps 
} from '@/components/presentation/accessibility'
import { slides } from '@/content/decks/llms-for-everyone/slides'

function PresentationContent() {
  const searchParams = useSearchParams()
  const isPresenterMode = searchParams?.get('presenter') === '1'
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const {
    currentSlide,
    direction,
    showKeyboardShortcuts,
    isOverviewMode,
    isPresenterViewOpen,
    isAccessibilityPanelOpen,
    settings,
    setTotalSlides,
    startPresentation,
    updateElapsedTime,
    toggleKeyboardShortcuts,
    toggleAccessibilityPanel,
    setIsPresenterViewOpen,
  } = useSlideNavigation()

  // Focus trap for modal dialogs
  useFocusTrap(showKeyboardShortcuts || isAccessibilityPanelOpen, containerRef)

  // Initialize presentation
  useEffect(() => {
    setTotalSlides(slides.length)
    startPresentation()
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - (usePresentationStore.getState().startTime?.getTime() || Date.now())
      updateElapsedTime(Math.floor(elapsed / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [setTotalSlides, startPresentation, updateElapsedTime])

  // Set up keyboard shortcuts
  useEffect(() => {
    const keyboardManager = new KeyboardManager()
    const {
      nextSlide,
      previousSlide,
      goToSlide,
      togglePresenterMode,
      toggleOverviewMode,
      toggleFullscreen,
      toggleTheme,
    } = usePresentationStore.getState()

    // Add all default shortcuts
    const shortcuts = defaultShortcuts.map(shortcut => ({
      ...shortcut,
      action: () => {
        switch (shortcut.key) {
          case 'right':
          case 'space':
            nextSlide()
            break
          case 'left':
            previousSlide()
            break
          case 'up':
            goToSlide(0)
            break
          case 'down':
            goToSlide(slides.length - 1)
            break
          case 'p':
            togglePresenterMode()
            break
          case 'g':
          case 'escape':
            toggleOverviewMode()
            break
          case 'f':
            toggleFullscreen()
            break
          case 't':
            toggleTheme()
            break
          case 'k':
            toggleKeyboardShortcuts()
            break
          case 'a':
            toggleAccessibilityPanel()
            break
        }
      }
    }))

    shortcuts.forEach(shortcut => keyboardManager.addShortcut(shortcut))

    // Touch navigation
    const touchManager = new TouchManager(
      nextSlide,
      previousSlide
    )

    return () => {
      touchManager.destroy()
    }
  }, [])

  // Apply theme
  useEffect(() => {
    document.documentElement.className = settings.theme === 'light' ? 'light' : 'dark'
  }, [settings.theme])

  // Handle presenter mode
  if (isPresenterMode || isPresenterViewOpen) {
    return (
      <PresenterView 
        isOpen={true}
        onClose={() => setIsPresenterViewOpen(false)}
        slides={slides}
      />
    )
  }

  // Handle overview mode
  if (isOverviewMode) {
    return <SlideOverview slides={slides} />
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Skip Links for accessibility */}
      <SkipLinks />

      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh opacity-30" />
      
      {/* Main slide area */}
      <main 
        className="relative z-10"
        role="main" 
        aria-label="Presentation slides"
        {...getSlideAriaProps(currentSlide, slides.length, currentSlideData.title)}
        tabIndex={-1}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <Slide
            key={currentSlide}
            id={currentSlideData.id}
            layout={currentSlideData.layout}
            isActive={true}
            direction={direction}
            background={currentSlideData.background}
            notes={currentSlideData.notes}
          >
            <currentSlideData.component />
          </Slide>
        </AnimatePresence>
      </main>

      {/* Navigation and UI */}
      <div className="no-print">
        {settings.showProgress && <ProgressBar />}
        
        <NavigationControls />
        
        {showKeyboardShortcuts && (
          <KeyboardShortcuts
            shortcuts={defaultShortcuts}
            onClose={() => toggleKeyboardShortcuts()}
          />
        )}

        {isAccessibilityPanelOpen && (
          <AccessibilityPanel
            isOpen={isAccessibilityPanelOpen}
            onClose={() => toggleAccessibilityPanel()}
          />
        )}
      </div>

      {/* Live region for screen reader announcements */}
      <LiveRegion
        currentSlide={currentSlide}
        totalSlides={slides.length}
        slideTitle={currentSlideData.title}
      />
    </div>
  )
}

export default function LLMsPresentationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-muted-foreground">Loading presentation...</p>
        </div>
      </div>
    }>
      <PresentationContent />
    </Suspense>
  )
}