'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowRight, Plus } from 'lucide-react'

interface TransformerBlockProps {
  className?: string
  animated?: boolean
  interactive?: boolean
  showLabels?: boolean
}

export function TransformerBlock({
  className,
  animated = true,
  interactive = true,
  showLabels = true
}: TransformerBlockProps) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [showFlow, setShowFlow] = useState(false)

  const layers = [
    {
      id: 'input',
      label: 'Input Embeddings',
      description: 'Token + Position Embeddings',
      color: 'bg-cyan-100 border-cyan-300 text-cyan-800',
      darkColor: 'dark:bg-cyan-900/30 dark:border-cyan-600 dark:text-cyan-200'
    },
    {
      id: 'attention',
      label: 'Multi-Head Attention',
      description: 'Self-attention mechanism',
      color: 'bg-purple-100 border-purple-300 text-purple-800',
      darkColor: 'dark:bg-purple-900/30 dark:border-purple-600 dark:text-purple-200'
    },
    {
      id: 'norm1',
      label: 'Add & Norm',
      description: 'Residual connection + Layer normalization',
      color: 'bg-amber-100 border-amber-300 text-amber-800',
      darkColor: 'dark:bg-amber-900/30 dark:border-amber-600 dark:text-amber-200'
    },
    {
      id: 'ffn',
      label: 'Feed Forward',
      description: 'Position-wise feed-forward network',
      color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      darkColor: 'dark:bg-emerald-900/30 dark:border-emerald-600 dark:text-emerald-200'
    },
    {
      id: 'norm2',
      label: 'Add & Norm',
      description: 'Residual connection + Layer normalization',
      color: 'bg-amber-100 border-amber-300 text-amber-800',
      darkColor: 'dark:bg-amber-900/30 dark:border-amber-600 dark:text-amber-200'
    },
    {
      id: 'output',
      label: 'Output',
      description: 'Transformed representations',
      color: 'bg-rose-100 border-rose-300 text-rose-800',
      darkColor: 'dark:bg-rose-900/30 dark:border-rose-600 dark:text-rose-200'
    }
  ]

  const handleLayerClick = (layerId: string) => {
    if (!interactive) return
    setActiveLayer(activeLayer === layerId ? null : layerId)
  }

  const startFlow = () => {
    setShowFlow(true)
    setActiveLayer('input')
    
    layers.forEach((layer, index) => {
      setTimeout(() => {
        setActiveLayer(layer.id)
      }, index * 800)
    })
    
    setTimeout(() => {
      setShowFlow(false)
      setActiveLayer(null)
    }, layers.length * 800 + 1000)
  }

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-xl font-bold mb-2">Transformer Encoder Block</h4>
          <p className="text-muted-foreground">
            The core building block of modern language models
          </p>
          
          {interactive && (
            <motion.button
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
              onClick={startFlow}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={showFlow}
            >
              {showFlow ? 'Processing...' : '▶ Show Information Flow'}
            </motion.button>
          )}
        </div>

        <div className="relative">
          {/* Flow lines */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-border opacity-30" />
          
          {layers.map((layer, index) => {
            const isActive = activeLayer === layer.id
            const isProcessing = showFlow && layers.findIndex(l => l.id === activeLayer) >= index
            
            return (
              <motion.div
                key={layer.id}
                className={cn(
                  'relative mb-4 last:mb-0 cursor-pointer group',
                  interactive && 'hover:scale-105'
                )}
                onClick={() => handleLayerClick(layer.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={interactive ? { scale: 1.02 } : undefined}
              >
                <div className={cn(
                  'border-2 rounded-xl p-4 transition-all duration-300',
                  layer.color,
                  layer.darkColor,
                  isActive || isProcessing ? 'ring-4 ring-primary/30 shadow-lg' : 'shadow-sm',
                  'group-hover:shadow-md'
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm">{layer.label}</h5>
                      {showLabels && (
                        <p className="text-xs opacity-75 mt-1">{layer.description}</p>
                      )}
                    </div>
                    
                    {/* Processing indicator */}
                    {isProcessing && (
                      <motion.div
                        className="w-3 h-3 bg-primary rounded-full"
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Expanded details */}
                  {isActive && !showFlow && (
                    <motion.div
                      className="mt-3 pt-3 border-t border-current/20"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="text-xs">
                        {layer.id === 'input' && 'Converts tokens to vectors and adds positional information'}
                        {layer.id === 'attention' && 'Each token attends to all other tokens in the sequence'}
                        {layer.id === 'norm1' && 'Adds input to attention output and normalizes'}
                        {layer.id === 'ffn' && 'Two-layer neural network processes each position independently'}
                        {layer.id === 'norm2' && 'Adds FFN input to output and normalizes'}
                        {layer.id === 'output' && 'Final contextualized representations for each token'}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Arrow between layers */}
                {index < layers.length - 1 && (
                  <motion.div
                    className="flex justify-center my-2"
                    animate={{ 
                      scale: isProcessing ? 1.2 : 1,
                      opacity: isProcessing ? 1 : 0.5
                    }}
                  >
                    <ArrowDown 
                      className={cn(
                        'w-6 h-6 transition-colors',
                        isProcessing ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </motion.div>
                )}

                {/* Residual connection indicators for Add & Norm layers */}
                {(layer.id === 'norm1' || layer.id === 'norm2') && (
                  <div className="absolute right-0 top-1/2 transform translate-x-8 -translate-y-1/2">
                    <motion.div
                      className="flex items-center text-xs text-muted-foreground"
                      animate={{ 
                        opacity: isActive || isProcessing ? 1 : 0.3,
                        x: isActive || isProcessing ? 0 : -10
                      }}
                    >
                      <div className="w-8 h-px bg-current mr-2" />
                      <Plus className="w-3 h-3" />
                      <div className="w-8 h-px bg-current ml-2" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Key concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-muted/30 rounded-lg p-4">
            <h6 className="font-semibold text-sm mb-2">Key Features:</h6>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Parallel processing of all tokens</li>
              <li>• Self-attention for context modeling</li>
              <li>• Residual connections prevent vanishing gradients</li>
              <li>• Layer normalization for training stability</li>
            </ul>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-4">
            <h6 className="font-semibold text-sm mb-2">Why It Works:</h6>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• No sequential bottleneck (unlike RNNs)</li>
              <li>• Long-range dependencies captured</li>
              <li>• Highly parallelizable</li>
              <li>• Scales well with data and compute</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TransformerArchitecture({ className }: { className?: string }) {
  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <div className="text-center mb-8">
        <h4 className="text-xl font-bold mb-2">Full Transformer Architecture</h4>
        <p className="text-muted-foreground">
          Multiple encoder blocks stacked together
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Input */}
        <div className="space-y-4">
          <h5 className="text-center font-semibold">Input Processing</h5>
          <div className="space-y-2">
            <div className="bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-300 dark:border-cyan-600 rounded p-3 text-center">
              <div className="text-sm font-medium">Token Embeddings</div>
              <div className="text-xs text-muted-foreground mt-1">Word → Vector</div>
            </div>
            <div className="flex justify-center">
              <Plus className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-300 dark:border-cyan-600 rounded p-3 text-center">
              <div className="text-sm font-medium">Position Embeddings</div>
              <div className="text-xs text-muted-foreground mt-1">Where in sequence?</div>
            </div>
          </div>
        </div>

        {/* Transformer Blocks */}
        <div className="space-y-4">
          <h5 className="text-center font-semibold">Encoder Stack</h5>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded p-2 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-xs font-medium">Encoder Layer {i + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <h5 className="text-center font-semibold">Output</h5>
          <div className="bg-rose-100 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-600 rounded p-4 text-center">
            <div className="text-sm font-medium">Contextualized Representations</div>
            <div className="text-xs text-muted-foreground mt-2">
              Each token now has rich contextual information from the entire sequence
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}