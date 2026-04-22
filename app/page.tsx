'use client'

import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/sections/hero'
import { Projects } from '@/components/sections/projects'
import { Studio } from '@/components/sections/studio'
import { Process } from '@/components/sections/process'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="relative">
        <Navigation />
        <Hero />
        <Projects />
        <Studio />
        <Process />
        <Contact />
        <Footer />
      </main>
    </SmoothScrollProvider>
  )
}
