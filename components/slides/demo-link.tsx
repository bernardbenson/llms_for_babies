'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Play, MousePointer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DemoLinkProps {
  href: string
  title: string
  description?: string
  preview?: string
  className?: string
  variant?: 'default' | 'large' | 'minimal'
}

export function DemoLink({
  href,
  title,
  description,
  preview,
  className,
  variant = 'default'
}: DemoLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    default: 'p-4',
    large: 'p-6',
    minimal: 'p-2'
  }

  return (
    <motion.div
      className={cn(
        'relative group',
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'block glass-card hover:shadow-xl transition-all duration-300 border-2 border-border/50 hover:border-primary/50',
          variants[variant]
        )}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <motion.div
              className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center"
              animate={{
                backgroundColor: isHovered ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--primary) / 0.1)'
              }}
            >
              <ExternalLink className={cn(
                'w-6 h-6 transition-colors',
                isHovered ? 'text-primary' : 'text-muted-foreground'
              )} />
            </motion.div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {title}
            </h4>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-primary font-medium">
                Interactive Demo
              </span>
              <Play className="w-3 h-3 text-primary" />
            </div>
          </div>
          
          <motion.div
            className="flex-shrink-0"
            animate={{ x: isHovered ? 5 : 0 }}
          >
            <MousePointer className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        </div>
        
        {/* Hover preview tooltip */}
        {preview && isHovered && (
          <motion.div
            className="absolute top-full left-0 mt-2 p-3 bg-popover border border-border rounded-lg shadow-lg z-50 max-w-xs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-popover-foreground">
              {preview}
            </p>
          </motion.div>
        )}
      </motion.a>
    </motion.div>
  )
}

interface DemoLinksGridProps {
  links: Array<{
    href: string
    title: string
    description?: string
    preview?: string
  }>
  className?: string
}

export function DemoLinksGrid({ links, className }: DemoLinksGridProps) {
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 gap-4',
      className
    )}>
      {links.map((link, index) => (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DemoLink {...link} />
        </motion.div>
      ))}
    </div>
  )
}

interface CalloutProps {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'success' | 'tip'
  title?: string
  className?: string
}

export function Callout({
  children,
  type = 'info',
  title,
  className
}: CalloutProps) {
  const styles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      icon: '💡'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-900 dark:text-amber-100',
      icon: '⚠️'
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-900 dark:text-emerald-100',
      icon: '✅'
    },
    tip: {
      bg: 'bg-purple-50 dark:bg-purple-950/50',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-900 dark:text-purple-100',
      icon: '💡'
    }
  }

  const style = styles[type]

  return (
    <motion.div
      className={cn(
        'rounded-2xl border-2 p-6',
        style.bg,
        style.border,
        style.text,
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{style.icon}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-2">{title}</h4>
          )}
          <div className="prose prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface TwoColumnProps {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
  split?: 'equal' | 'left-heavy' | 'right-heavy'
}

export function TwoColumn({
  left,
  right,
  className,
  split = 'equal'
}: TwoColumnProps) {
  const gridClasses = {
    equal: 'grid-cols-1 md:grid-cols-2',
    'left-heavy': 'grid-cols-1 md:grid-cols-3',
    'right-heavy': 'grid-cols-1 md:grid-cols-3'
  }

  const leftClasses = {
    equal: '',
    'left-heavy': 'md:col-span-2',
    'right-heavy': ''
  }

  const rightClasses = {
    equal: '',
    'left-heavy': '',
    'right-heavy': 'md:col-span-2'
  }

  return (
    <div className={cn(
      'grid gap-8 items-start',
      gridClasses[split],
      className
    )}>
      <motion.div
        className={leftClasses[split]}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {left}
      </motion.div>
      <motion.div
        className={rightClasses[split]}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {right}
      </motion.div>
    </div>
  )
}

interface FigureProps {
  children: React.ReactNode
  caption?: string
  className?: string
}

export function Figure({ children, caption, className }: FigureProps) {
  return (
    <motion.figure
      className={cn('space-y-4', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-center">
        {children}
      </div>
      {caption && (
        <figcaption className="text-sm text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}