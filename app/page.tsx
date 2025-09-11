import { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Brain, Presentation, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'LLMs for Everyone - Deck Library',
  description: 'Choose your presentation deck',
}

const decks = [
  {
    id: 'llms-for-everyone',
    title: 'LLMs for Everyone',
    description: 'Demystifying Neural Networks and Large Language Models',
    duration: '45 minutes',
    slides: 15,
    icon: Brain,
    href: '/deck/llms-for-everyone',
    featured: true,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-mesh">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            variants={itemVariants}
          >
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LLMs for Everyone
            </h1>
          </motion.div>
          
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8"
            variants={itemVariants}
          >
            Interactive presentations that make complex AI concepts accessible
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:gap-8 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {decks.map((deck) => {
            const Icon = deck.icon
            return (
              <motion.div key={deck.id} variants={itemVariants}>
                <Card className="glass-card hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex items-start gap-6 p-8">
                    <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-2">
                            {deck.title}
                          </h2>
                          <p className="text-muted-foreground text-lg">
                            {deck.description}
                          </p>
                        </div>
                        {deck.featured && (
                          <div className="px-3 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full">
                            Featured
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Presentation className="h-4 w-4" />
                          {deck.slides} slides
                        </div>
                        <div>⏱️ {deck.duration}</div>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button asChild className="flex-1">
                          <Link href={deck.href}>
                            Start Presentation
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`${deck.href}?presenter=1`}>
                            Presenter Mode
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
        
        <motion.div
          className="text-center mt-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.p
            className="text-muted-foreground mb-8"
            variants={itemVariants}
          >
            More decks coming soon...
          </motion.p>
          
          <motion.div
            className="flex justify-center gap-4"
            variants={itemVariants}
          >
            <Button variant="outline" asChild>
              <Link href="/settings">
                Settings
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/export/html">
                Export Tools
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}