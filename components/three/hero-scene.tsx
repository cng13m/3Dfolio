'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { ArchitecturalModel } from './architectural-model'
import * as THREE from 'three'

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera, size } = useThree()
  const targetPosition = useRef(new THREE.Vector3(0, 3.25, 9.7))
  const targetLookAt = useRef(new THREE.Vector3(0, 1.15, 0))
  
  useFrame(() => {
    const progress = scrollProgress
    const isMobile = size.width < 640
    const baseZ = isMobile ? 13.2 : 9.7
    const baseY = isMobile ? 3.45 : 3.25

    targetPosition.current.x = Math.sin(progress * Math.PI * 0.35) * 0.9
    targetPosition.current.y = baseY + progress * 0.55
    targetPosition.current.z = baseZ - progress * (isMobile ? 0.55 : 0.9)

    targetLookAt.current.x = THREE.MathUtils.lerp(0.02, -0.12, progress)
    targetLookAt.current.y = (isMobile ? 0.8 : 1.15) + progress * 0.18

    camera.position.lerp(targetPosition.current, 0.045)
    camera.lookAt(targetLookAt.current)
  })
  
  return null
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <color attach="background" args={['#f9f8f6']} />
      <fog attach="fog" args={['#f9f8f6', 14, 28]} />
      
      <CameraRig scrollProgress={scrollProgress} />
      <ArchitecturalModel scrollProgress={scrollProgress} />
      <ContactShadows
        blur={2.4}
        color="#8c857d"
        far={10}
        opacity={0.3}
        position={[0, -2.22, 0]}
        resolution={512}
        scale={12}
      />
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
        dpr={[1, 1.4]}
        performance={{ min: 0.55 }}
        camera={{ position: [0, 3.25, 9.7], fov: 33, near: 0.1, far: 100 }}
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
