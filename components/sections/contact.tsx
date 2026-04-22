'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const elements = sectionRef.current?.querySelectorAll('.animate-in')
    
    elements?.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        }
      )
    })
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="contact"
      className="py-32 md:py-48 px-6 md:px-12 lg:px-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left column */}
        <div>
          <span className="animate-in text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 block">
            Get in Touch
          </span>
          <h2 className="animate-in font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-12">
            {"Let's create something extraordinary together"}
          </h2>
          
          <div className="animate-in">
            <a 
              href="mailto:studio@ateliermonolith.com" 
              className="inline-flex items-center gap-4 group"
            >
              <span className="text-2xl md:text-3xl font-light text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                studio@ateliermonolith.com
              </span>
              <span className="w-8 h-px bg-foreground group-hover:w-16 transition-all duration-300" />
            </a>
          </div>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:pt-16">
          {/* Address */}
          <div className="animate-in">
            <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Studio
            </h3>
            <address className="not-italic text-foreground leading-relaxed">
              <p>147 Mercer Street</p>
              <p>New York, NY 10012</p>
              <p className="mt-4">+1 212 555 0147</p>
            </address>
          </div>

          {/* Social */}
          <div className="animate-in">
            <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Follow
            </h3>
            <div className="flex flex-col gap-3">
              {['Instagram', 'LinkedIn', 'Pinterest'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-foreground hover:text-muted-foreground transition-colors duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
