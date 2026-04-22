'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '47', label: 'Projects Completed' },
  { value: '12', label: 'Design Awards' },
  { value: '16', label: 'Years Experience' },
  { value: '8', label: 'Countries' },
]

export function Studio() {
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

    // Parallax effect on image
    const image = sectionRef.current?.querySelector('.parallax-image')
    if (image) {
      gsap.to(image, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: image,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="studio"
      className="py-32 md:py-48"
    >
      {/* Philosophy section */}
      <div className="px-6 md:px-12 lg:px-16 mb-32 md:mb-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Title */}
          <div className="animate-in">
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 block">
              Our Philosophy
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
              Where light meets form, space becomes experience
            </h2>
          </div>

          {/* Right column - Description */}
          <div className="animate-in lg:pt-16">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              At Atelier Monolith, we believe architecture is not merely about creating structures, 
              but crafting environments that elevate the human experience. Our practice is rooted 
              in the dialogue between material and void, between permanence and poetry.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Every project begins with deep listening - to the site, the context, and most 
              importantly, to the lives that will unfold within the spaces we create. We seek 
              to design buildings that feel inevitable, as if they have always belonged.
            </p>
          </div>
        </div>
      </div>

      {/* Full-width image */}
      <div className="animate-in relative h-[60vh] md:h-[80vh] overflow-hidden mb-32 md:mb-48">
        <div className="parallax-image absolute inset-0 -top-[15%] h-[130%]">
          <Image
            src="https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1920&h=1200&fit=crop"
            alt="Atelier Monolith studio space"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
      </div>

      {/* Stats */}
      <div className="px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={stat.label} className="animate-in text-center md:text-left">
              <span className="block font-serif text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-2">
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
