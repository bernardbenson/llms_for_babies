'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Clock, FileText, Monitor, Users, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { usePresentationStore } from '@/lib/store'

interface PresenterViewProps {
  isOpen: boolean
  onClose: () => void
  slides: any[]
  className?: string
}

export function PresenterView({ 
  isOpen, 
  onClose, 
  slides = [], 
  className 
}: PresenterViewProps) {
  const { 
    currentSlide, 
    notes, 
    startTime, 
    isPlaying,
    goToSlide,
    nextSlide,
    prevSlide
  } = usePresentationStore()

  const [currentTime, setCurrentTime] = useState(new Date())
  const [elapsedTime, setElapsedTime] = useState(0)

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      if (startTime) {
        setElapsedTime(Date.now() - startTime)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const getCurrentSlideData = () => slides[currentSlide] || {}
  const getNextSlideData = () => slides[currentSlide + 1] || {}
  const getPrevSlideData = () => slides[currentSlide - 1] || {}

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn('h-full flex flex-col', className)}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">Presenter Mode</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString()}</span>
                <span>•</span>
                <span>Elapsed: {formatTime(elapsedTime)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Slide {currentSlide + 1} of {slides.length}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close presenter mode"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex gap-6 p-6 overflow-hidden">
            {/* Current Slide */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Current Slide</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Card className="flex-1 p-4 bg-white dark:bg-gray-900">
                <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Monitor className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div className="text-lg font-semibold">
                      {getCurrentSlideData().title || `Slide ${currentSlide + 1}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Section {getCurrentSlideData().section || currentSlide + 1}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="w-80 space-y-4">
              {/* Next Slide Preview */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Next Slide
                </h4>
                <Card className="p-3 bg-muted/50">
                  {currentSlide < slides.length - 1 ? (
                    <div className="space-y-2">
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded text-xs flex items-center justify-center">
                        Preview
                      </div>
                      <div className="text-sm font-medium">
                        {getNextSlideData().title || `Slide ${currentSlide + 2}`}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <span className="text-sm">End of presentation</span>
                    </div>
                  )}
                </Card>
              </div>

              {/* Speaker Notes */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Speaker Notes
                </h4>
                <Card className="p-4 h-48 overflow-y-auto bg-muted/50">
                  <div className="text-sm">
                    {notes[currentSlide] ? (
                      <div className="whitespace-pre-wrap">{notes[currentSlide]}</div>
                    ) : (
                      <div className="text-muted-foreground italic">
                        No notes for this slide. Click to add notes...
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Slide Overview */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Slide Overview</h4>
                <Card className="p-3 max-h-40 overflow-y-auto bg-muted/50">
                  <div className="grid grid-cols-4 gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                          'aspect-video bg-gray-200 dark:bg-gray-700 rounded text-xs flex items-center justify-center transition-all',
                          currentSlide === index 
                            ? 'ring-2 ring-primary bg-primary/20' 
                            : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Timing Information */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Timing</h4>
                <Card className="p-3 bg-muted/50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Section:</span>
                      <span>{getCurrentSlideData().duration || '3 min'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Elapsed:</span>
                      <span>{formatTime(elapsedTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Total:</span>
                      <span>45 min</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

interface PresenterNotesProps {
  slideIndex: number
  notes: string
  onNotesChange: (notes: string) => void
  className?: string
}

export function PresenterNotes({
  slideIndex,
  notes,
  onNotesChange,
  className
}: PresenterNotesProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState(notes)

  const handleSave = () => {
    onNotesChange(editedNotes)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedNotes(notes)
    setIsEditing(false)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Speaker Notes</h4>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-xs"
          >
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            placeholder="Add speaker notes for this slide..."
            className="w-full h-24 p-2 text-sm border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-3 min-h-20 bg-muted/30">
          {notes ? (
            <div className="text-sm whitespace-pre-wrap">{notes}</div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              Click "Edit" to add speaker notes for this slide
            </div>
          )}
        </Card>
      )}
    </div>
  )
}