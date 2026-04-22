'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 1,
    title: 'Villa Serenity',
    location: 'Santorini, Greece',
    year: '2023',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop',
  },
  {
    id: 2,
    title: 'The Pavilion',
    location: 'Kyoto, Japan',
    year: '2023',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
  },
  {
    id: 3,
    title: 'Horizon House',
    location: 'Malibu, California',
    year: '2022',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop',
  },
  {
    id: 4,
    title: 'Stone Gallery',
    location: 'Copenhagen, Denmark',
    year: '2022',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&h=800&fit=crop',
  },
]

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

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

    // Project cards stagger animation
    const cards = sectionRef.current?.querySelectorAll('.project-card')
    cards?.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          delay: index * 0.1,
        }
      )
    })
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="projects"
      className="py-32 md:py-48 px-6 md:px-12 lg:px-16"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-20 md:mb-32">
        <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 block">
          Featured Work
        </span>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight max-w-3xl">
          Selected projects showcasing our commitment to spatial excellence
        </h2>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
        {projects.map((project, index) => (
          <article 
            key={project.id} 
            className={`project-card group cursor-pointer ${index === 0 ? 'md:col-span-2' : ''}`}
          >
            {/* Image container */}
            <div className={`relative overflow-hidden bg-muted mb-6 ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes={index === 0 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
            </div>

            {/* Project info */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-light mb-2 group-hover:text-muted-foreground transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.location}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs tracking-wider text-muted-foreground block mb-1">
                  {project.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {project.year}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* View all link */}
      <div className="mt-20 md:mt-32 text-center">
        <a 
          href="#" 
          className="inline-flex items-center gap-4 text-sm tracking-wide group"
        >
          <span className="group-hover:text-muted-foreground transition-colors duration-300">
            View all projects
          </span>
          <span className="w-12 h-px bg-foreground group-hover:w-20 transition-all duration-300" />
        </a>
      </div>
    </section>
  )
}
