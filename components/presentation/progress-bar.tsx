'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useProgress } from '@/lib/store'
import { formatDuration } from '@/lib/utils'

interface ProgressBarProps {
  className?: string
  showTime?: boolean
  showSlideNumbers?: boolean
}

export function ProgressBar({ 
  className, 
  showTime = true, 
  showSlideNumbers = true 
}: ProgressBarProps) {
  const {
    progress,
    progressPercent,
    timeProgressPercent,
    remainingTime,
    isOvertime,
    elapsedTime,
    currentSlide,
    totalSlides,
  } = useProgress()

  return (
    <motion.div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-background/80 backdrop-blur-sm border-t border-border/50',
        'px-6 py-3',
        className
      )}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center justify-between text-sm">
        {showSlideNumbers && (
          <div className="text-muted-foreground font-mono">
            <span className="text-foreground font-semibold">{currentSlide}</span>
            {' / '}
            {totalSlides}
          </div>
        )}

        {/* Progress bar container */}
        <div className="flex-1 mx-6">
          <div className="relative">
            {/* Slide progress */}
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
                style={{ width: `${progressPercent}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            {/* Time progress overlay */}
            <div className="absolute top-0 h-2 bg-transparent rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  'h-full opacity-40 rounded-full',
                  isOvertime ? 'bg-destructive' : 'bg-accent'
                )}
                style={{ width: `${Math.min(timeProgressPercent, 100)}%` }}
                animate={{ width: `${Math.min(timeProgressPercent, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Section markers */}
            <div className="absolute top-0 w-full h-2 flex justify-between">
              {[...Array(Math.max(0, totalSlides - 1))].map((_, i) => {
                const position = ((i + 1) / totalSlides) * 100
                return (
                  <div
                    key={i}
                    className="w-px h-full bg-border/50"
                    style={{ marginLeft: `${position}%` }}
                  />
                )
              })}
            </div>
          </div>

          {/* Mini timeline with hover labels */}
          <div className="mt-1 text-xs text-muted-foreground flex justify-between">
            <span>Start</span>
            <span>{progressPercent}% complete</span>
            <span>End</span>
          </div>
        </div>

        {showTime && (
          <div className="text-muted-foreground font-mono flex items-center gap-3">
            <div className="text-right">
              <div className={cn(
                'text-foreground font-semibold',
                isOvertime && 'text-destructive'
              )}>
                {formatDuration(Math.floor(elapsedTime))}
              </div>
              <div className="text-xs">
                {isOvertime ? 'overtime' : `${formatDuration(Math.floor(remainingTime))} left`}
              </div>
            </div>
            
            <div className={cn(
              'w-2 h-2 rounded-full',
              isOvertime ? 'bg-destructive animate-pulse' : 'bg-primary'
            )} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function MiniProgressBar({ 
  className,
  size = 'sm' 
}: { 
  className?: string
  size?: 'xs' | 'sm' | 'md'
}) {
  const { progressPercent } = useProgress()
  
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3'
  }

  return (
    <div className={cn(
      'bg-muted/30 rounded-full overflow-hidden',
      sizeClasses[size],
      className
    )}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
        style={{ width: `${progressPercent}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progressPercent}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  )
}