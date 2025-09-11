'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AttentionCell {
  query: string
  key: string
  attention: number
}

interface AttentionHeatmapProps {
  sentence?: string
  className?: string
  animated?: boolean
  interactive?: boolean
}

export function AttentionHeatmap({
  sentence = "The cat sat on the mat",
  className,
  animated = true,
  interactive = true
}: AttentionHeatmapProps) {
  const tokens = sentence.split(' ')
  const [hoveredCell, setHoveredCell] = useState<{ i: number; j: number } | null>(null)
  const [selectedToken, setSelectedToken] = useState<number | null>(null)

  // Generate realistic attention weights
  const generateAttentionWeights = (queryIndex: number, keyIndex: number) => {
    // Higher attention to nearby words and self-attention
    const distance = Math.abs(queryIndex - keyIndex)
    const selfAttention = queryIndex === keyIndex ? 0.8 : 0
    const proximityAttention = Math.exp(-distance * 0.5) * 0.6
    const randomNoise = Math.random() * 0.2
    
    return Math.min(1, selfAttention + proximityAttention + randomNoise)
  }

  const attentionMatrix = tokens.map((queryToken, i) =>
    tokens.map((keyToken, j) => ({
      query: queryToken,
      key: keyToken,
      attention: generateAttentionWeights(i, j)
    }))
  )

  const getAttentionColor = (attention: number) => {
    const intensity = Math.floor(attention * 255)
    return `rgba(94, 114, 228, ${attention})`
  }

  const getTextColor = (attention: number) => {
    return attention > 0.5 ? 'white' : 'black'
  }

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold mb-2">Attention Matrix</h4>
          <p className="text-muted-foreground">
            {interactive ? 'Hover over cells or click tokens to see attention patterns' : 'Self-attention visualization'}
          </p>
        </div>

        {/* Sentence with clickable tokens */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tokens.map((token, i) => (
            <motion.button
              key={i}
              className={cn(
                'px-4 py-2 rounded-lg border-2 transition-all',
                selectedToken === i 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-border bg-background hover:border-primary/50'
              )}
              onClick={() => interactive && setSelectedToken(selectedToken === i ? null : i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {token}
            </motion.button>
          ))}
        </div>

        {/* Attention matrix */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-px bg-border p-1 rounded-lg" 
                 style={{ gridTemplateColumns: `auto repeat(${tokens.length}, 1fr)` }}>
              
              {/* Header row */}
              <div className="bg-background p-2 text-center font-medium text-sm">
                Query → Key
              </div>
              {tokens.map((token, i) => (
                <div key={i} className="bg-background p-2 text-center font-medium text-sm min-w-16">
                  {token}
                </div>
              ))}

              {/* Matrix rows */}
              {tokens.map((queryToken, i) => (
                <React.Fragment key={i}>
                  {/* Row header */}
                  <div className="bg-background p-2 text-center font-medium text-sm">
                    {queryToken}
                  </div>
                  
                  {/* Attention cells */}
                  {tokens.map((keyToken, j) => {
                    const cell = attentionMatrix[i][j]
                    const isHovered = hoveredCell?.i === i && hoveredCell?.j === j
                    const isHighlighted = selectedToken === i || selectedToken === j
                    const shouldAnimate = animated && (isHovered || isHighlighted)

                    return (
                      <motion.div
                        key={j}
                        className={cn(
                          'relative p-2 text-center text-sm font-mono cursor-pointer min-h-12 flex items-center justify-center',
                          isHighlighted && 'ring-2 ring-primary ring-offset-1'
                        )}
                        style={{ 
                          backgroundColor: getAttentionColor(cell.attention),
                          color: getTextColor(cell.attention)
                        }}
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ 
                          scale: shouldAnimate ? 1.1 : 1,
                          opacity: shouldAnimate ? 1 : 0.8
                        }}
                        whileHover={{ scale: 1.05 }}
                        onHoverStart={() => interactive && setHoveredCell({ i, j })}
                        onHoverEnd={() => interactive && setHoveredCell(null)}
                      >
                        {cell.attention.toFixed(2)}
                        
                        {isHovered && (
                          <motion.div
                            className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap z-10"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            "{queryToken}" attending to "{keyToken}"
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/20 rounded"></div>
            <span>Low attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/60 rounded"></div>
            <span>Medium attention</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span>High attention</span>
          </div>
        </div>

        {selectedToken !== null && (
          <motion.div
            className="bg-muted/50 rounded-lg p-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm">
              Attention pattern for "<strong>{tokens[selectedToken]}</strong>": 
              The model pays most attention to{' '}
              {tokens.map((token, i) => {
                const attention = attentionMatrix[selectedToken][i].attention
                return attention > 0.6 ? `"${token}"` : null
              }).filter(Boolean).join(', ') || 'itself'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

interface MultiHeadAttentionProps {
  className?: string
  heads?: number
  sentence?: string
}

export function MultiHeadAttention({
  className,
  heads = 4,
  sentence = "The cat sat on the mat"
}: MultiHeadAttentionProps) {
  const tokens = sentence.split(' ')
  const [activeHead, setActiveHead] = useState<number | null>(null)

  return (
    <div className={cn('w-full max-w-6xl mx-auto', className)}>
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold mb-2">Multi-Head Attention</h4>
        <p className="text-muted-foreground">
          Different attention heads focus on different aspects of the relationships
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[...Array(heads)].map((_, headIndex) => {
          const isActive = activeHead === headIndex
          
          return (
            <motion.div
              key={headIndex}
              className={cn(
                'border-2 rounded-lg p-4 cursor-pointer transition-all',
                isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              )}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveHead(activeHead === headIndex ? null : headIndex)}
            >
              <h5 className="font-medium mb-3 text-center">
                Head {headIndex + 1}
                {isActive && <span className="ml-2 text-primary">●</span>}
              </h5>
              
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${tokens.length}, 1fr)` }}>
                {tokens.map((queryToken, i) =>
                  tokens.map((keyToken, j) => {
                    // Different heads focus on different patterns
                    let attention = 0
                    switch (headIndex) {
                      case 0: // Positional attention
                        attention = Math.exp(-Math.abs(i - j) * 0.5)
                        break
                      case 1: // Syntactic attention
                        attention = (i === 0 && j === 1) || (i === 1 && j === 2) ? 0.9 : Math.random() * 0.3
                        break
                      case 2: // Semantic attention
                        attention = (queryToken === 'cat' && keyToken === 'mat') ? 0.8 : Math.random() * 0.4
                        break
                      case 3: // Self attention
                        attention = i === j ? 0.9 : Math.random() * 0.2
                        break
                    }
                    
                    return (
                      <motion.div
                        key={`${i}-${j}`}
                        className="aspect-square rounded"
                        style={{ 
                          backgroundColor: `rgba(94, 114, 228, ${attention})`,
                          opacity: isActive ? 1 : 0.7
                        }}
                        animate={{
                          scale: isActive ? 1 : 0.9,
                          opacity: isActive ? 1 : 0.7
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    )
                  })
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.p
        className="text-center text-sm text-muted-foreground mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Click on attention heads to highlight their patterns
      </motion.p>
    </div>
  )
}