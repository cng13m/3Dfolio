'use client'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-6 md:px-12 lg:px-16 border-t border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-foreground flex items-center justify-center">
            <span className="text-background text-[8px] font-medium tracking-widest">AM</span>
          </div>
          <span className="text-xs tracking-[0.15em] uppercase">
            Atelier Monolith
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          {currentYear} Atelier Monolith. All rights reserved.
        </p>

        {/* Credits */}
        <p className="text-xs text-muted-foreground">
          Crafted with precision
        </p>
      </div>
    </footer>
  )
}
