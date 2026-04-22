'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Studio', href: '#studio' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out',
          scrolled 
            ? 'bg-background/80 backdrop-blur-md border-b border-border/50' 
            : 'bg-transparent'
        )}
      >
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-6">
          {/* Logo */}
          <a 
            href="#" 
            className="group flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-medium tracking-widest">AM</span>
            </div>
            <span className="hidden sm:block text-sm tracking-[0.2em] uppercase font-medium">
              Atelier Monolith
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <span 
              className={cn(
                'w-6 h-px bg-foreground transition-all duration-300 origin-center',
                menuOpen && 'rotate-45 translate-y-[4px]'
              )} 
            />
            <span 
              className={cn(
                'w-6 h-px bg-foreground transition-all duration-300',
                menuOpen && 'opacity-0'
              )} 
            />
            <span 
              className={cn(
                'w-6 h-px bg-foreground transition-all duration-300 origin-center',
                menuOpen && '-rotate-45 -translate-y-[4px]'
              )} 
            />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div 
        className={cn(
          'fixed inset-0 z-40 bg-background/98 backdrop-blur-lg transition-all duration-500 md:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'text-2xl tracking-wide text-foreground transition-all duration-500',
                menuOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              )}
              style={{ transitionDelay: menuOpen ? `${index * 100}ms` : '0ms' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
