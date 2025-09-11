'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  number: number
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ 
  number, 
  title, 
  subtitle, 
  className 
}: SectionHeaderProps) {
  return (
    <motion.div
      className={cn(
        'relative min-h-screen flex items-center justify-center text-center',
        'bg-gradient-to-br from-background via-background/95 to-background/90',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, hsl(var(--primary) / 0.3), transparent),
                       radial-gradient(ellipse 60% 60% at 80% 20%, hsl(var(--accent) / 0.2), transparent),
                       radial-gradient(ellipse 60% 60% at 20% 80%, hsl(var(--secondary) / 0.2), transparent)`
        }}
        animate={{
          background: [
            `radial-gradient(ellipse 80% 80% at 50% 50%, hsl(var(--primary) / 0.3), transparent),
             radial-gradient(ellipse 60% 60% at 80% 20%, hsl(var(--accent) / 0.2), transparent),
             radial-gradient(ellipse 60% 60% at 20% 80%, hsl(var(--secondary) / 0.2), transparent)`,
            `radial-gradient(ellipse 80% 80% at 60% 40%, hsl(var(--primary) / 0.4), transparent),
             radial-gradient(ellipse 60% 60% at 70% 30%, hsl(var(--accent) / 0.3), transparent),
             radial-gradient(ellipse 60% 60% at 30% 70%, hsl(var(--secondary) / 0.3), transparent)`,
            `radial-gradient(ellipse 80% 80% at 40% 60%, hsl(var(--primary) / 0.3), transparent),
             radial-gradient(ellipse 60% 60% at 90% 10%, hsl(var(--accent) / 0.2), transparent),
             radial-gradient(ellipse 60% 60% at 10% 90%, hsl(var(--secondary) / 0.2), transparent)`
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Section number with motion blur effect */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            className="text-[12rem] md:text-[16rem] font-bold text-primary/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {number.toString().padStart(2, '0')}
          </motion.div>
          
          <div className="relative">
            <motion.h1
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p
                className="text-2xl md:text-3xl text-muted-foreground max-w-4xl mx-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Animated decoration */}
        <motion.div
          className="flex justify-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/40 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}