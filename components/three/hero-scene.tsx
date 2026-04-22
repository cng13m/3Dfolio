'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { ArchitecturalModel } from './architectural-model'
import * as THREE from 'three'

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3(0, 2, 12))
  const targetLookAt = useRef(new THREE.Vector3(0, 0.5, 0))
  
  useFrame(() => {
    // Cinematic camera movement based on scroll
    const progress = scrollProgress
    
    // Camera position interpolation
    targetPosition.current.x = Math.sin(progress * Math.PI * 0.3) * 3
    targetPosition.current.y = 2 + progress * 1.5
    targetPosition.current.z = 12 - progress * 4
    
    // Look at target - slightly offset
    targetLookAt.current.y = 0.5 + progress * 0.5
    
    // Smooth lerp to target
    camera.position.lerp(targetPosition.current, 0.03)
    
    const currentLookAt = new THREE.Vector3()
    camera.getWorldDirection(currentLookAt)
    currentLookAt.add(camera.position)
    currentLookAt.lerp(targetLookAt.current, 0.03)
    camera.lookAt(targetLookAt.current)
  })
  
  return null
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={['#f9f8f6']} />
      <fog attach="fog" args={['#f9f8f6', 15, 35]} />
      
      <CameraRig scrollProgress={scrollProgress} />
      <ArchitecturalModel scrollProgress={scrollProgress} />
      
      {/* Ground plane with soft shadow */}
      <ContactShadows 
        position={[0, -1.55, 0]}
        opacity={0.4}
        scale={20}
        blur={2.5}
        far={10}
        color="#8a8580"
      />
      
      {/* Subtle environment for reflections */}
      <Environment preset="city" environmentIntensity={0.3} />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
    </div>
  )
}

interface HeroSceneProps {
  scrollProgress: number
}

export function HeroScene({ scrollProgress }: HeroSceneProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <LoadingFallback />
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 2, 12], fov: 35, near: 0.1, far: 100 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  )
}
