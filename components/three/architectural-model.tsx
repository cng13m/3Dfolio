'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

interface ArchitecturalModelProps {
  scrollProgress: number
}

interface ArchitecturalViewProps {
  texture: THREE.Texture
  width: number
  opacity: number
  baseY: number
  x: number
  z: number
  rotationY: number
  yOffset?: number
  renderOrder: number
}

interface TextureImageLike {
  width: number
  height: number
}

function createShadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024

  const context = canvas.getContext('2d')
  if (!context) {
    return null
  }

  const gradient = context.createRadialGradient(512, 512, 120, 512, 512, 460)
  gradient.addColorStop(0, 'rgba(92, 83, 72, 0.34)')
  gradient.addColorStop(0.55, 'rgba(120, 110, 100, 0.14)')
  gradient.addColorStop(1, 'rgba(120, 110, 100, 0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, 1024, 1024)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true

  return texture
}

function ArchitecturalView({
  texture,
  width,
  opacity,
  baseY,
  x,
  z,
  rotationY,
  yOffset = 0,
  renderOrder,
}: ArchitecturalViewProps) {
  const image = texture.image as TextureImageLike
  const aspect = image.width / image.height
  const height = width / aspect

  return (
    <mesh
      position={[x, baseY + height / 2 + yOffset, z]}
      rotation={[0, rotationY, 0]}
      renderOrder={renderOrder}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        alphaTest={0.08}
        depthWrite={false}
        map={texture}
        opacity={opacity}
        side={THREE.DoubleSide}
        toneMapped={false}
        transparent
      />
    </mesh>
  )
}

function ClientArchitectureTransition({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const [viewA, viewB] = useTexture(['/client-hero-view-a.png', '/client-hero-view-b.png'])

  const shadowTexture = useMemo(() => createShadowTexture(), [])

  useEffect(() => {
    for (const texture of [viewA, viewB]) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      texture.needsUpdate = true
    }
  }, [viewA, viewB])

  useEffect(() => {
    if (!shadowTexture) {
      return
    }

    shadowTexture.anisotropy = 4

    return () => {
      shadowTexture.dispose()
    }
  }, [shadowTexture])

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const orbit = THREE.MathUtils.smoothstep(scrollProgress, 0.04, 0.92)
    const targetX = THREE.MathUtils.lerp(0.35, -0.55, orbit)
    const targetY = THREE.MathUtils.lerp(-0.1, 0.28, orbit)
    const targetZ = THREE.MathUtils.lerp(0.5, -0.85, orbit)
    const targetRotationY = THREE.MathUtils.lerp(0.18, -0.16, orbit)
    const targetRotationX = THREE.MathUtils.lerp(0.04, -0.02, orbit)
    const floatOffset = Math.sin(state.clock.elapsedTime * 0.35) * 0.04
    const targetScale = THREE.MathUtils.lerp(0.88, 1.04, orbit) + Math.sin(state.clock.elapsedTime * 0.18) * 0.006

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + floatOffset, 0.05)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05)
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05)
    )
  })

  const blend = THREE.MathUtils.smoothstep(scrollProgress, 0.18, 0.72)
  const fadeInB = THREE.MathUtils.smoothstep(scrollProgress, 0.2, 0.66)
  const fadeOutA = 1 - THREE.MathUtils.smoothstep(scrollProgress, 0.32, 0.76)
  const baseY = -2.1

  const viewAState = {
    width: THREE.MathUtils.lerp(9.8, 8.9, blend),
    opacity: THREE.MathUtils.clamp(fadeOutA, 0, 1),
    x: THREE.MathUtils.lerp(-0.35, -0.95, blend),
    z: THREE.MathUtils.lerp(0.35, -0.45, blend),
    rotationY: THREE.MathUtils.lerp(-0.04, -0.22, blend),
    yOffset: THREE.MathUtils.lerp(0, 0.08, blend),
  }

  const viewBState = {
    width: THREE.MathUtils.lerp(6.6, 8.1, blend),
    opacity: THREE.MathUtils.clamp(fadeInB, 0, 1),
    x: THREE.MathUtils.lerp(1.6, 0.35, blend),
    z: THREE.MathUtils.lerp(-1.15, 0.2, blend),
    rotationY: THREE.MathUtils.lerp(0.22, 0.02, blend),
    yOffset: THREE.MathUtils.lerp(0.2, 0.02, blend),
  }

  return (
    <>
      <mesh position={[0, -2.45, -0.4]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={0}>
        <planeGeometry args={[10.5, 5.8]} />
        <meshBasicMaterial
          depthWrite={false}
          map={shadowTexture ?? undefined}
          opacity={0.95}
          toneMapped={false}
          transparent
        />
      </mesh>

      <group ref={groupRef}>
        <ArchitecturalView
          baseY={baseY}
          opacity={viewAState.opacity}
          renderOrder={1}
          rotationY={viewAState.rotationY}
          texture={viewA}
          width={viewAState.width}
          x={viewAState.x}
          yOffset={viewAState.yOffset}
          z={viewAState.z}
        />
        <ArchitecturalView
          baseY={baseY}
          opacity={viewBState.opacity}
          renderOrder={2}
          rotationY={viewBState.rotationY}
          texture={viewB}
          width={viewBState.width}
          x={viewBState.x}
          yOffset={viewBState.yOffset}
          z={viewBState.z}
        />
      </group>
    </>
  )
}

export function ArchitecturalModel({ scrollProgress }: ArchitecturalModelProps) {
  return <ClientArchitectureTransition scrollProgress={scrollProgress} />
}
