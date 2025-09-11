'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { swipeVariants, slideTransition } from '@/lib/motion'

export interface SlideProps {
  children: React.ReactNode
  id: string
  layout?: 'standard' | 'full-bleed' | 'split' | 'demo'
  className?: string
  isActive?: boolean
  direction?: number
  background?: string
  notes?: string
}

export function Slide({
  children,
  id,
  layout = 'standard',
  className,
  isActive = false,
  direction = 1,
  background,
  notes,
}: SlideProps) {
  const layoutClasses = {
    standard: 'slide-content',
    'full-bleed': 'p-0',
    split: 'slide-content grid grid-cols-2 gap-12 items-center',
    demo: 'slide-content flex flex-col justify-center items-center text-center',
  }

  return (
    <AnimatePresence mode="wait" custom={direction}>
      {isActive && (
        <motion.div
          key={id}
          custom={direction}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className={cn(
            'slide-container absolute inset-0',
            background && 'relative'
          )}
          style={background ? { background } : undefined}
          data-slide-id={id}
          data-notes={notes}
        >
          {background && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{ background }}
            />
          )}
          
          <div className={cn(
            layoutClasses[layout],
            'relative z-10',
            className
          )}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SlideTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <motion.h1
      className={cn('slide-title', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {children}
    </motion.h1>
  )
}

export function SlideSubtitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <motion.p
      className={cn('slide-subtitle', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      {children}
    </motion.p>
  )
}