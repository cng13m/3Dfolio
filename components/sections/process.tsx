'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const processSteps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'We begin with deep immersion into your vision, site, and context. Through conversations and site analysis, we uncover the essence of what the project must become.',
  },
  {
    number: '02',
    title: 'Concept',
    description: 'Ideas take form through sketches, models, and spatial studies. We explore multiple directions, refining until we find the design that feels both innovative and inevitable.',
  },
  {
    number: '03',
    title: 'Development',
    description: 'The concept evolves into detailed drawings, material selections, and technical specifications. Every detail is considered, from structural systems to light fixtures.',
  },
  {
    number: '04',
    title: 'Realization',
    description: 'We guide the construction process with precision and care, ensuring the built work honors the design intent while adapting to the realities of making.',
  },
]

export function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Header animation
    gsap.fromTo(
      headerRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
      }
    )

    // Process steps animation
    const steps = stepsRef.current?.querySelectorAll('.process-step')
    steps?.forEach((step, index) => {
      gsap.fromTo(
        step,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          },
          delay: index * 0.15,
        }
      )
    })

    // Horizontal line animation
    const lines = stepsRef.current?.querySelectorAll('.step-line')
    lines?.forEach((line) => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
          },
        }
      )
    })
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="process"
      className="py-32 md:py-48 px-6 md:px-12 lg:px-16 bg-secondary/30"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-20 md:mb-32 max-w-3xl">
        <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 block">
          Our Process
        </span>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
          From vision to reality, a journey of refinement
        </h2>
      </div>

      {/* Process steps */}
      <div ref={stepsRef} className="space-y-0">
        {processSteps.map((step, index) => (
          <div 
            key={step.number}
            className="process-step group"
          >
            {/* Top line */}
            <div className="step-line h-px bg-border origin-left" />
            
            <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
              {/* Number */}
              <div className="md:col-span-2">
                <span className="font-serif text-4xl md:text-5xl text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-500">
                  {step.number}
                </span>
              </div>
              
              {/* Title */}
              <div className="md:col-span-3">
                <h3 className="font-serif text-2xl md:text-3xl font-light">
                  {step.title}
                </h3>
              </div>
              
              {/* Description */}
              <div className="md:col-span-7">
                <p className="text-muted-foreground leading-relaxed md:text-lg">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Bottom line for last item */}
            {index === processSteps.length - 1 && (
              <div className="step-line h-px bg-border origin-left" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
