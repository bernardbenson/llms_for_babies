import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SlideNote {
  slideId: string
  content: string
  lastModified: Date
}

export interface PresentationSettings {
  theme: 'dark' | 'light'
  reducedMotion: boolean
  autoProgress: boolean
  autoProgressDuration: number // seconds
  showNotes: boolean
  showProgress: boolean
  showSlideNumbers: boolean
}

export interface PresentationState {
  currentSlide: number
  totalSlides: number
  isPresenterMode: boolean
  isPresenterViewOpen: boolean
  isOverviewMode: boolean
  isFullscreen: boolean
  showKeyboardShortcuts: boolean
  isAccessibilityPanelOpen: boolean
  direction: number // 1 for next, -1 for previous
  startTime: Date | null
  elapsedTime: number
  notes: SlideNote[]
  settings: PresentationSettings
  
  // Actions
  setCurrentSlide: (slide: number) => void
  setTotalSlides: (total: number) => void
  nextSlide: () => void
  previousSlide: () => void
  goToSlide: (slide: number) => void
  togglePresenterMode: () => void
  setIsPresenterViewOpen: (open: boolean) => void
  toggleOverviewMode: () => void
  toggleFullscreen: () => void
  toggleKeyboardShortcuts: () => void
  toggleAccessibilityPanel: () => void
  startPresentation: () => void
  resetPresentation: () => void
  updateElapsedTime: (time: number) => void
  
  // Notes
  updateNote: (slideId: string, content: string) => void
  getNoteForSlide: (slideId: string) => string
  
  // Settings
  updateSettings: (settings: Partial<PresentationSettings>) => void
  toggleTheme: () => void
}

const defaultSettings: PresentationSettings = {
  theme: 'dark',
  reducedMotion: false,
  autoProgress: false,
  autoProgressDuration: 30,
  showNotes: false,
  showProgress: true,
  showSlideNumbers: true,
}

export const usePresentationStore = create<PresentationState>()(
  persist(
    (set, get) => ({
      currentSlide: 0,
      totalSlides: 0,
      isPresenterMode: false,
      isPresenterViewOpen: false,
      isOverviewMode: false,
      isFullscreen: false,
      showKeyboardShortcuts: false,
      isAccessibilityPanelOpen: false,
      direction: 1,
      startTime: null,
      elapsedTime: 0,
      notes: [],
      settings: defaultSettings,

      setCurrentSlide: (slide) => {
        const { currentSlide } = get()
        set({ 
          currentSlide: slide,
          direction: slide > currentSlide ? 1 : -1
        })
      },

      setTotalSlides: (total) => set({ totalSlides: total }),

      nextSlide: () => {
        const { currentSlide, totalSlides } = get()
        if (currentSlide < totalSlides - 1) {
          set({ 
            currentSlide: currentSlide + 1,
            direction: 1
          })
        }
      },

      previousSlide: () => {
        const { currentSlide } = get()
        if (currentSlide > 0) {
          set({ 
            currentSlide: currentSlide - 1,
            direction: -1
          })
        }
      },

      goToSlide: (slide) => {
        const { currentSlide, totalSlides } = get()
        const clampedSlide = Math.max(0, Math.min(slide, totalSlides - 1))
        set({ 
          currentSlide: clampedSlide,
          direction: clampedSlide > currentSlide ? 1 : -1,
          isOverviewMode: false
        })
      },

      togglePresenterMode: () => {
        set(state => ({ isPresenterMode: !state.isPresenterMode }))
      },

      toggleOverviewMode: () => {
        set(state => ({ isOverviewMode: !state.isOverviewMode }))
      },

      toggleFullscreen: () => {
        const { isFullscreen } = get()
        if (!isFullscreen) {
          document.documentElement.requestFullscreen?.()
        } else {
          document.exitFullscreen?.()
        }
        set({ isFullscreen: !isFullscreen })
      },

      toggleKeyboardShortcuts: () => {
        set(state => ({ showKeyboardShortcuts: !state.showKeyboardShortcuts }))
      },

      setIsPresenterViewOpen: (open) => {
        set({ isPresenterViewOpen: open })
      },

      toggleAccessibilityPanel: () => {
        set(state => ({ isAccessibilityPanelOpen: !state.isAccessibilityPanelOpen }))
      },

      startPresentation: () => {
        set({ 
          startTime: new Date(),
          currentSlide: 0,
          elapsedTime: 0
        })
      },

      resetPresentation: () => {
        set({ 
          currentSlide: 0,
          startTime: null,
          elapsedTime: 0,
          isPresenterMode: false,
          isOverviewMode: false,
          isFullscreen: false
        })
      },

      updateElapsedTime: (time) => set({ elapsedTime: time }),

      updateNote: (slideId, content) => {
        set(state => {
          const existingNoteIndex = state.notes.findIndex(note => note.slideId === slideId)
          const newNote: SlideNote = {
            slideId,
            content,
            lastModified: new Date()
          }
          
          if (existingNoteIndex >= 0) {
            const newNotes = [...state.notes]
            newNotes[existingNoteIndex] = newNote
            return { notes: newNotes }
          } else {
            return { notes: [...state.notes, newNote] }
          }
        })
      },

      getNoteForSlide: (slideId) => {
        const note = get().notes.find(note => note.slideId === slideId)
        return note?.content || ''
      },

      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }))
      },

      toggleTheme: () => {
        set(state => ({
          settings: {
            ...state.settings,
            theme: state.settings.theme === 'dark' ? 'light' : 'dark'
          }
        }))
        
        // Update document class
        const { settings } = get()
        document.documentElement.className = settings.theme === 'light' ? 'light' : 'dark'
      },
    }),
    {
      name: 'llms-presentation-storage',
      partialize: (state) => ({
        notes: state.notes,
        settings: state.settings,
      }),
    }
  )
)

// Hook for accessing presentation progress
export const useProgress = () => {
  const { currentSlide, totalSlides, elapsedTime, startTime } = usePresentationStore()
  
  const progress = totalSlides > 0 ? (currentSlide + 1) / totalSlides : 0
  const progressPercent = Math.round(progress * 100)
  
  const estimatedDuration = 45 * 60 // 45 minutes in seconds
  const timeProgress = elapsedTime / estimatedDuration
  const timeProgressPercent = Math.min(Math.round(timeProgress * 100), 100)
  
  const remainingTime = Math.max(0, estimatedDuration - elapsedTime)
  const isOvertime = elapsedTime > estimatedDuration
  
  return {
    progress,
    progressPercent,
    timeProgress,
    timeProgressPercent,
    remainingTime,
    isOvertime,
    elapsedTime,
    startTime,
    currentSlide: currentSlide + 1, // 1-indexed for display
    totalSlides,
  }
}

// Hook for slide navigation with keyboard support
export const useSlideNavigation = () => {
  const store = usePresentationStore()
  
  const canGoNext = store.currentSlide < store.totalSlides - 1
  const canGoPrevious = store.currentSlide > 0
  
  const goToFirst = () => store.goToSlide(0)
  const goToLast = () => store.goToSlide(store.totalSlides - 1)
  
  return {
    ...store,
    canGoNext,
    canGoPrevious,
    goToFirst,
    goToLast,
  }
}