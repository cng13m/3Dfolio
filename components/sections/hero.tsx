'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HeroScene } from '@/components/three/hero-scene'
import { useScroll } from '@/components/smooth-scroll-provider'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const { scrollProgress } = useScroll()
  const containerRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    
    // Initial load animation
    tl.fromTo(
      titleRef.current?.querySelectorAll('.title-line') || [],
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power3.out' }
    )
    .fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo(
      scrollIndicatorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )

    // Scroll-based fade out for text
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '30% top',
      scrub: true,
      onUpdate: (self) => {
        if (titleRef.current) {
          gsap.to(titleRef.current, {
            opacity: 1 - self.progress * 1.5,
            y: self.progress * -50,
            duration: 0.1,
          })
        }
        if (subtitleRef.current) {
          gsap.to(subtitleRef.current, {
            opacity: 1 - self.progress * 2,
            y: self.progress * -30,
            duration: 0.1,
          })
        }
        if (scrollIndicatorRef.current) {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 1 - self.progress * 3,
            duration: 0.1,
          })
        }
      },
    })
  }, [])

  return (
    <section 
      ref={containerRef}
      id="hero-section"
      className="relative h-[260vh]"
    >
      {/* Sticky container for 3D scene */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D Scene */}
        <HeroScene scrollProgress={scrollProgress} />

        {/* Typography overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main title */}
          <div 
            ref={titleRef}
            className="absolute left-6 top-24 max-w-[min(860px,calc(100vw-3rem))] overflow-hidden md:left-12 md:top-28 lg:left-16"
          >
            <div className="title-line">
              <span className="block font-serif text-5xl font-light tracking-normal text-foreground/90 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                Architecture
              </span>
            </div>
            <div className="title-line">
              <span className="block font-serif text-5xl font-light tracking-normal text-foreground/90 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
                of Clarity
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <div 
            ref={subtitleRef}
            className="absolute bottom-24 right-6 hidden max-w-xs text-right sm:block md:right-12 md:max-w-sm lg:right-16"
          >
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed tracking-wide">
              Award-winning studio crafting timeless spaces through refined design and meticulous attention to materiality.
            </p>
          </div>

          {/* Scroll indicator */}
          <div 
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Scroll to explore
            </span>
            <div className="w-px h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-foreground/60 animate-scroll-line" />
            </div>
          </div>

          {/* Year badge */}
          <div className="absolute right-6 top-28 hidden sm:block md:right-12 lg:right-16">
            <span className="text-xs tracking-[0.25em] text-muted-foreground">
              EST. 2008
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
