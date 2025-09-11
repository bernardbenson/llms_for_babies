export interface KeyboardShortcut {
  key: string
  description: string
  action: () => void
  category: 'navigation' | 'presentation' | 'tools'
}

export interface KeyboardHandler {
  shortcuts: KeyboardShortcut[]
  addShortcut: (shortcut: KeyboardShortcut) => void
  removeShortcut: (key: string) => void
  handleKeyPress: (event: KeyboardEvent) => boolean
}

export class KeyboardManager implements KeyboardHandler {
  shortcuts: KeyboardShortcut[] = []
  private isEnabled = true
  private preventDefaults = new Set(['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'])

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (!this.isEnabled) return
      
      // Don't handle shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return
      }

      const handled = this.handleKeyPress(event)
      if (handled && this.preventDefaults.has(event.code)) {
        event.preventDefault()
      }
    })
  }

  addShortcut(shortcut: KeyboardShortcut) {
    // Remove existing shortcut with same key
    this.shortcuts = this.shortcuts.filter(s => s.key !== shortcut.key)
    this.shortcuts.push(shortcut)
  }

  removeShortcut(key: string) {
    this.shortcuts = this.shortcuts.filter(s => s.key !== key)
  }

  handleKeyPress(event: KeyboardEvent): boolean {
    const key = this.normalizeKey(event)
    const shortcut = this.shortcuts.find(s => s.key === key)
    
    if (shortcut) {
      shortcut.action()
      return true
    }
    
    return false
  }

  private normalizeKey(event: KeyboardEvent): string {
    const modifiers = []
    if (event.metaKey) modifiers.push('meta')
    if (event.ctrlKey) modifiers.push('ctrl')
    if (event.altKey) modifiers.push('alt')
    if (event.shiftKey) modifiers.push('shift')
    
    let key = event.key
    
    // Normalize common keys
    switch (event.code) {
      case 'Space':
        key = 'space'
        break
      case 'ArrowLeft':
        key = 'left'
        break
      case 'ArrowRight':
        key = 'right'
        break
      case 'ArrowUp':
        key = 'up'
        break
      case 'ArrowDown':
        key = 'down'
        break
      case 'Escape':
        key = 'escape'
        break
      default:
        key = key.toLowerCase()
    }
    
    return modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key
  }

  enable() {
    this.isEnabled = true
  }

  disable() {
    this.isEnabled = false
  }

  getShortcutsByCategory(category: KeyboardShortcut['category']) {
    return this.shortcuts.filter(s => s.category === category)
  }

  getAllShortcuts() {
    return [...this.shortcuts]
  }
}

// Default shortcuts for the presentation
export const defaultShortcuts: Omit<KeyboardShortcut, 'action'>[] = [
  // Navigation
  { key: 'right', description: 'Next slide', category: 'navigation' },
  { key: 'left', description: 'Previous slide', category: 'navigation' },
  { key: 'space', description: 'Next slide', category: 'navigation' },
  { key: 'up', description: 'First slide', category: 'navigation' },
  { key: 'down', description: 'Last slide', category: 'navigation' },
  
  // Presentation modes
  { key: 'p', description: 'Toggle presenter mode', category: 'presentation' },
  { key: 'n', description: 'Toggle notes', category: 'presentation' },
  { key: 'escape', description: 'Exit fullscreen/overview', category: 'presentation' },
  { key: 'f', description: 'Toggle fullscreen', category: 'presentation' },
  
  // Tools
  { key: 'g', description: 'Go to slide (grid view)', category: 'tools' },
  { key: 't', description: 'Toggle theme', category: 'tools' },
  { key: 'k', description: 'Show keyboard shortcuts', category: 'tools' },
  { key: 's', description: 'Settings', category: 'tools' },
]

// Touch gesture support
export class TouchManager {
  private startX = 0
  private startY = 0
  private minSwipeDistance = 50
  private maxVerticalDistance = 100

  constructor(
    private onSwipeLeft: () => void,
    private onSwipeRight: () => void,
    private element: HTMLElement = document.body
  ) {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true })
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true })
  }

  private handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0]
    this.startX = touch.clientX
    this.startY = touch.clientY
  }

  private handleTouchEnd(event: TouchEvent) {
    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - this.startX
    const deltaY = touch.clientY - this.startY
    
    // Check if this is a horizontal swipe
    if (
      Math.abs(deltaX) > this.minSwipeDistance &&
      Math.abs(deltaY) < this.maxVerticalDistance
    ) {
      if (deltaX > 0) {
        this.onSwipeRight()
      } else {
        this.onSwipeLeft()
      }
    }
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this))
  }
}

// Mouse wheel support for slide navigation
export class WheelManager {
  private isThrottled = false
  private throttleDelay = 500

  constructor(
    private onWheelUp: () => void,
    private onWheelDown: () => void,
    private element: HTMLElement = document.body
  ) {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    this.element.addEventListener('wheel', this.handleWheel.bind(this), { passive: false })
  }

  private handleWheel(event: WheelEvent) {
    if (this.isThrottled) return

    // Only handle vertical scrolling
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return

    event.preventDefault()
    
    this.isThrottled = true
    setTimeout(() => {
      this.isThrottled = false
    }, this.throttleDelay)

    if (event.deltaY > 0) {
      this.onWheelDown()
    } else {
      this.onWheelUp()
    }
  }

  destroy() {
    this.element.removeEventListener('wheel', this.handleWheel.bind(this))
  }
}