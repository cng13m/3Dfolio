'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { ArchitecturalModel } from './architectural-model'
import * as THREE from 'three'

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3(0, 2, 12))
  const targetLookAt = useRef(new THREE.Vector3(0, 0.5, 0))
  
  useFrame(() => {
    const progress = scrollProgress

    targetPosition.current.x = Math.sin(progress * Math.PI * 0.28) * 1.8
    targetPosition.current.y = 1.35 + progress * 1.2
    targetPosition.current.z = 11.8 - progress * 2.6

    targetLookAt.current.x = THREE.MathUtils.lerp(0.15, -0.2, progress)
    targetLookAt.current.y = 0.6 + progress * 0.35

    camera.position.lerp(targetPosition.current, 0.03)
    camera.lookAt(targetLookAt.current)
  })
  
  return null
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={['#f9f8f6']} />
      <fog attach="fog" args={['#f9f8f6', 14, 30]} />
      
      <CameraRig scrollProgress={scrollProgress} />
      <ArchitecturalModel scrollProgress={scrollProgress} />
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
