'use client'

import { useEffect, useRef, createContext, useContext, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollContextType {
  lenis: Lenis | null
  scrollProgress: number
}

const ScrollContext = createContext<ScrollContextType>({ lenis: null, scrollProgress: 0 })

export function useScroll() {
  return useContext(ScrollContext)
}

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })
    
    lenisRef.current = lenis

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000)
    }
    
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useGSAP(() => {
    // Hero scroll progress tracker
    ScrollTrigger.create({
      trigger: '#hero-section',
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      scrub: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress)
      },
    })
  }, [])

  return (
    <ScrollContext.Provider value={{ lenis: lenisRef.current, scrollProgress }}>
      {children}
    </ScrollContext.Provider>
  )
}
