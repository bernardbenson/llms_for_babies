'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeuronProps {
  x: number
  y: number
  size?: number
  active?: boolean
  onClick?: () => void
  label?: string
  color?: 'input' | 'hidden' | 'output'
  className?: string
}

function Neuron({ 
  x, 
  y, 
  size = 40, 
  active = false, 
  onClick, 
  label, 
  color = 'hidden',
  className 
}: NeuronProps) {
  const colorClasses = {
    input: 'fill-cyan-400 stroke-cyan-200',
    hidden: 'fill-purple-400 stroke-purple-200',
    output: 'fill-emerald-400 stroke-emerald-200',
  }

  return (
    <g className={cn('cursor-pointer', className)} onClick={onClick}>
      <motion.circle
        cx={x}
        cy={y}
        r={size / 2}
        className={cn(
          'stroke-2 transition-all duration-300',
          colorClasses[color],
          active && 'drop-shadow-lg'
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: active ? 1.2 : 1, 
          opacity: 1,
          filter: active ? 'drop-shadow(0 0 20px currentColor)' : 'none'
        }}
        whileHover={{ scale: 1.1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          opacity: { duration: 0.2 }
        }}
      />
      {label && (
        <motion.text
          x={x}
          y={y + size/2 + 20}
          textAnchor="middle"
          className="text-sm fill-muted-foreground font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {label}
        </motion.text>
      )}
    </g>
  )
}

interface ConnectionProps {
  x1: number
  y1: number
  x2: number
  y2: number
  active?: boolean
  weight?: number
  animated?: boolean
}

function Connection({ x1, y1, x2, y2, active = false, weight = 0.5, animated = false }: ConnectionProps) {
  const strokeWidth = Math.max(1, weight * 4)
  const opacity = Math.max(0.3, weight)

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={cn(
        'stroke-muted-foreground transition-all duration-500',
        active && 'stroke-primary'
      )}
      strokeWidth={strokeWidth}
      opacity={opacity}
      initial={{ pathLength: 0 }}
      animate={{ 
        pathLength: 1,
        stroke: active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
        filter: active ? 'drop-shadow(0 0 4px hsl(var(--primary)))' : 'none'
      }}
      transition={{ 
        pathLength: { duration: 0.8, delay: 0.2 },
        stroke: { duration: 0.3 }
      }}
    />
  )
}

interface SimpleNeuralNetworkProps {
  className?: string
  interactive?: boolean
  showLabels?: boolean
  autoDemo?: boolean
  onNeuronClick?: (layerIndex: number, neuronIndex: number) => void
}

export function SimpleNeuralNetwork({
  className,
  interactive = true,
  showLabels = true,
  autoDemo = false,
  onNeuronClick
}: SimpleNeuralNetworkProps) {
  const [activeNeurons, setActiveNeurons] = useState<Set<string>>(new Set())
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set())

  const layers = [
    { neurons: 3, label: 'Input', type: 'input' as const, x: 100 },
    { neurons: 4, label: 'Hidden', type: 'hidden' as const, x: 300 },
    { neurons: 2, label: 'Output', type: 'output' as const, x: 500 },
  ]

  const neuronPositions = layers.map(layer => {
    const spacing = 60
    const startY = 200 - (layer.neurons - 1) * spacing / 2
    return layer.neurons === 1 
      ? [{ x: layer.x, y: 200 }]
      : Array.from({ length: layer.neurons }, (_, i) => ({
          x: layer.x,
          y: startY + i * spacing
        }))
  })

  const handleNeuronClick = (layerIndex: number, neuronIndex: number) => {
    if (!interactive) return

    const neuronKey = `${layerIndex}-${neuronIndex}`
    
    // Activate clicked neuron
    setActiveNeurons(new Set([neuronKey]))
    
    // Activate connected neurons and connections
    const newActiveConnections = new Set<string>()
    
    if (layerIndex < layers.length - 1) {
      // Forward connections
      neuronPositions[layerIndex + 1].forEach((_, nextNeuronIndex) => {
        const connectionKey = `${layerIndex}-${neuronIndex}-${layerIndex + 1}-${nextNeuronIndex}`
        newActiveConnections.add(connectionKey)
        
        // Activate next layer neurons with delay
        setTimeout(() => {
          setActiveNeurons(prev => new Set([...prev, `${layerIndex + 1}-${nextNeuronIndex}`]))
        }, 300)
      })
    }
    
    setActiveConnections(newActiveConnections)
    
    // Reset after animation
    setTimeout(() => {
      setActiveNeurons(new Set())
      setActiveConnections(new Set())
    }, 2000)

    onNeuronClick?.(layerIndex, neuronIndex)
  }

  // Auto demo mode
  useEffect(() => {
    if (!autoDemo) return

    const runDemo = () => {
      // Activate input
      setActiveNeurons(new Set(['0-0']))
      
      setTimeout(() => {
        // Activate hidden layer
        setActiveNeurons(prev => new Set([...prev, '1-0', '1-1', '1-2']))
        setActiveConnections(new Set(['0-0-1-0', '0-0-1-1', '0-0-1-2']))
      }, 500)
      
      setTimeout(() => {
        // Activate output
        setActiveNeurons(prev => new Set([...prev, '2-0', '2-1']))
        setActiveConnections(prev => new Set([...prev, '1-0-2-0', '1-1-2-0', '1-2-2-1']))
      }, 1000)
      
      setTimeout(() => {
        // Reset
        setActiveNeurons(new Set())
        setActiveConnections(new Set())
      }, 2500)
    }

    const interval = setInterval(runDemo, 4000)
    runDemo() // Run immediately

    return () => clearInterval(interval)
  }, [autoDemo])

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      <svg 
        viewBox="0 0 600 400" 
        className="w-full h-auto"
        role="img"
        aria-label="Neural network diagram"
      >
        {/* Render connections first (behind neurons) */}
        {layers.slice(0, -1).map((layer, layerIndex) => 
          neuronPositions[layerIndex].map((neuron, neuronIndex) =>
            neuronPositions[layerIndex + 1].map((nextNeuron, nextNeuronIndex) => {
              const connectionKey = `${layerIndex}-${neuronIndex}-${layerIndex + 1}-${nextNeuronIndex}`
              const isActive = activeConnections.has(connectionKey)
              
              return (
                <Connection
                  key={connectionKey}
                  x1={neuron.x + 20}
                  y1={neuron.y}
                  x2={nextNeuron.x - 20}
                  y2={nextNeuron.y}
                  active={isActive}
                  weight={Math.random() * 0.8 + 0.2}
                />
              )
            })
          )
        )}

        {/* Render neurons */}
        {layers.map((layer, layerIndex) =>
          neuronPositions[layerIndex].map((position, neuronIndex) => {
            const neuronKey = `${layerIndex}-${neuronIndex}`
            const isActive = activeNeurons.has(neuronKey)
            
            return (
              <Neuron
                key={neuronKey}
                x={position.x}
                y={position.y}
                active={isActive}
                color={layer.type}
                label={showLabels && neuronIndex === 0 ? layer.label : undefined}
                onClick={() => handleNeuronClick(layerIndex, neuronIndex)}
              />
            )
          })
        )}
      </svg>
      
      {interactive && (
        <motion.p 
          className="text-center text-sm text-muted-foreground mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Click any neuron to see signal propagation
        </motion.p>
      )}
    </div>
  )
}

interface LayeredNetworkProps {
  layers: number[]
  labels?: string[]
  className?: string
  animated?: boolean
}

export function LayeredNetwork({ 
  layers, 
  labels = [], 
  className, 
  animated = true 
}: LayeredNetworkProps) {
  return (
    <div className={cn('w-full max-w-5xl mx-auto', className)}>
      <svg viewBox="0 0 800 400" className="w-full h-auto">
        {layers.map((neuronCount, layerIndex) => {
          const x = 150 + layerIndex * 150
          const spacing = neuronCount > 1 ? 240 / (neuronCount - 1) : 0
          const startY = 200 - spacing * (neuronCount - 1) / 2

          return (
            <g key={layerIndex}>
              {/* Layer label */}
              {labels[layerIndex] && (
                <motion.text
                  x={x}
                  y={120}
                  textAnchor="middle"
                  className="text-sm fill-primary font-semibold"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: layerIndex * 0.2 }}
                >
                  {labels[layerIndex]}
                </motion.text>
              )}
              
              {/* Neurons */}
              {Array.from({ length: neuronCount }, (_, i) => (
                <Neuron
                  key={i}
                  x={x}
                  y={neuronCount === 1 ? 200 : startY + i * spacing}
                  color={
                    layerIndex === 0 ? 'input' : 
                    layerIndex === layers.length - 1 ? 'output' : 
                    'hidden'
                  }
                />
              ))}
            </g>
          )
        })}
        
        {/* Connections between layers */}
        {layers.slice(0, -1).map((currentCount, layerIndex) => {
          const nextCount = layers[layerIndex + 1]
          const x1 = 150 + layerIndex * 150 + 20
          const x2 = 150 + (layerIndex + 1) * 150 - 20
          
          const currentSpacing = currentCount > 1 ? 240 / (currentCount - 1) : 0
          const nextSpacing = nextCount > 1 ? 240 / (nextCount - 1) : 0
          
          const currentStartY = 200 - currentSpacing * (currentCount - 1) / 2
          const nextStartY = 200 - nextSpacing * (nextCount - 1) / 2

          return Array.from({ length: currentCount }, (_, i) =>
            Array.from({ length: nextCount }, (_, j) => (
              <Connection
                key={`${layerIndex}-${i}-${j}`}
                x1={x1}
                y1={currentCount === 1 ? 200 : currentStartY + i * currentSpacing}
                x2={x2}
                y2={nextCount === 1 ? 200 : nextStartY + j * nextSpacing}
                weight={Math.random() * 0.6 + 0.2}
                animated={animated}
              />
            ))
          )
        })}
      </svg>
    </div>
  )
}