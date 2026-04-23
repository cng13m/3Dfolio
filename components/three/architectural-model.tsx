'use client'

import { useMemo, useRef } from 'react'
import { Edges } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ArchitecturalModelProps {
  scrollProgress: number
}

type BlockTone = 'stone' | 'warm' | 'shadow' | 'glass'

interface Block {
  position: [number, number, number]
  scale: [number, number, number]
  tone: BlockTone
}

function ArchitecturalMass({ scrollProgress }: ArchitecturalModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { size } = useThree()

  const blocks = useMemo<Block[]>(
    () => [
      { position: [0, -0.3, 0], scale: [6.8, 0.28, 4.5], tone: 'shadow' },
      { position: [-1.5, 0.08, 0.3], scale: [3.1, 0.26, 3.6], tone: 'stone' },
      { position: [1.25, 0.3, -0.35], scale: [3.6, 0.28, 3.2], tone: 'warm' },
      { position: [-0.2, 0.72, -0.2], scale: [5.4, 0.24, 2.9], tone: 'stone' },
      { position: [-1.85, 1.22, 0.2], scale: [2.1, 0.24, 2.65], tone: 'warm' },
      { position: [1.55, 1.42, -0.5], scale: [2.5, 0.24, 2.35], tone: 'stone' },
      { position: [-0.1, 1.92, -0.1], scale: [4.35, 0.22, 2.25], tone: 'warm' },
      { position: [-1.45, 2.45, 0], scale: [1.8, 0.22, 1.85], tone: 'stone' },
      { position: [1.15, 2.68, -0.35], scale: [2.05, 0.22, 1.7], tone: 'warm' },
      { position: [-0.1, 3.16, -0.05], scale: [3.15, 0.2, 1.45], tone: 'stone' },
      { position: [0.85, 3.67, -0.28], scale: [1.38, 0.2, 1.1], tone: 'warm' },
      { position: [-0.72, 3.82, 0.1], scale: [1.05, 0.18, 0.95], tone: 'stone' },
      { position: [-3.05, 0.85, 0.85], scale: [0.24, 1.9, 0.24], tone: 'shadow' },
      { position: [3.05, 0.95, -1.25], scale: [0.24, 2.2, 0.24], tone: 'shadow' },
      { position: [-0.05, 1.2, 1.45], scale: [0.2, 1.65, 0.2], tone: 'shadow' },
      { position: [2.18, 2.08, 0.65], scale: [0.18, 1.62, 0.18], tone: 'shadow' },
      { position: [-2.25, 2.25, -1.0], scale: [0.18, 1.4, 0.18], tone: 'shadow' },
    ],
    []
  )

  const glassPanels = useMemo<Block[]>(
    () => [
      { position: [-0.1, 0.92, 1.83], scale: [4.7, 1.15, 0.05], tone: 'glass' },
      { position: [1.82, 1.58, 1.05], scale: [0.05, 1.45, 1.55], tone: 'glass' },
      { position: [-2.45, 1.45, -0.55], scale: [0.05, 1.25, 1.7], tone: 'glass' },
      { position: [0.1, 2.8, 0.68], scale: [2.6, 0.96, 0.05], tone: 'glass' },
    ],
    []
  )

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const progress = THREE.MathUtils.smoothstep(scrollProgress, 0.02, 0.98)
    const idle = state.clock.elapsedTime
    const isMobile = size.width < 640
    const responsiveScale = isMobile ? 0.42 : size.width < 900 ? 0.84 : 0.92

    const targetRotationY = THREE.MathUtils.lerp(0.45, -0.36, progress) + Math.sin(idle * 0.18) * 0.025
    const targetRotationX = THREE.MathUtils.lerp(0.02, -0.04, progress)
    const targetRotationZ = Math.sin(idle * 0.14) * 0.008

    const targetX = THREE.MathUtils.lerp(isMobile ? 0.02 : 0.68, isMobile ? -0.18 : 0.36, progress)
    const targetY = THREE.MathUtils.lerp(isMobile ? -1.82 : -1.92, isMobile ? -1.66 : -1.72, progress) + Math.sin(idle * 0.45) * 0.035
    const targetZ = THREE.MathUtils.lerp(0.1, -0.42, progress)
    const targetScale = responsiveScale * (THREE.MathUtils.lerp(1.08, 1.16, progress) + Math.sin(idle * 0.22) * 0.006)

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.05)
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05)
    )
  })

  const materialForTone = (tone: BlockTone) => {
    if (tone === 'warm') {
      return <meshStandardMaterial color="#d9c9b4" roughness={0.74} metalness={0.02} />
    }

    if (tone === 'shadow') {
      return <meshStandardMaterial color="#8b857b" roughness={0.82} metalness={0.03} />
    }

    if (tone === 'glass') {
      return (
        <meshPhysicalMaterial
          color="#9fb2b7"
          roughness={0.22}
          metalness={0}
          transparent
          opacity={0.36}
          transmission={0.2}
        />
      )
    }

    return <meshStandardMaterial color="#eee8dc" roughness={0.68} metalness={0.02} />
  }

  return (
    <group ref={groupRef}>
      {blocks.map((block, index) => (
        <mesh
          key={`block-${index}`}
          castShadow
          receiveShadow
          position={block.position}
          scale={block.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          {materialForTone(block.tone)}
          <Edges color="#5c5750" scale={1.003} threshold={18} />
        </mesh>
      ))}

      {glassPanels.map((panel, index) => (
        <mesh
          key={`glass-${index}`}
          castShadow
          receiveShadow
          position={panel.position}
          scale={panel.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          {materialForTone(panel.tone)}
          <Edges color="#d9e4e5" scale={1.002} threshold={10} />
        </mesh>
      ))}

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <planeGeometry args={[9.4, 6.4]} />
        <shadowMaterial transparent opacity={0.13} />
      </mesh>
    </group>
  )
}

export function ArchitecturalModel({ scrollProgress }: ArchitecturalModelProps) {
  return (
    <>
      <ambientLight intensity={1.4} color="#f8f0e4" />
      <directionalLight
        castShadow
        color="#fff6ea"
        intensity={2.8}
        position={[7, 10, 8]}
        shadow-bias={-0.0001}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        shadow-camera-bottom={-12}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
      />
      <directionalLight color="#dbe7f3" intensity={0.9} position={[-6, 7, -6]} />
      <pointLight color="#f6ede2" intensity={0.55} position={[0, -1.2, 4]} />

      <ArchitecturalMass scrollProgress={scrollProgress} />
    </>
  )
}
