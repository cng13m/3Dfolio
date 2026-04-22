'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ArchitecturalModelProps {
  scrollProgress: number
}

// Create a refined architectural sculpture - stacked volumes with voids
function ArchitecturalSculpture({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  
  // Subtle ambient rotation
  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation from scroll
      const targetRotationY = scrollProgress * Math.PI * 0.5
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY + Math.sin(state.clock.elapsedTime * 0.1) * 0.02,
        0.05
      )
      
      // Subtle floating motion
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
      
      // Scale breathing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.2) * 0.01
      groupRef.current.scale.setScalar(scale)
    }
  })

  // Concrete material - warm, matte
  const concreteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#b5b0a8'),
    roughness: 0.85,
    metalness: 0.05,
    envMapIntensity: 0.3,
  }), [])

  // Stone material - slightly warmer
  const stoneMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c8c2b8'),
    roughness: 0.9,
    metalness: 0.02,
    envMapIntensity: 0.2,
  }), [])

  // Glass material
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#e8e6e2'),
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.9,
    thickness: 0.5,
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), [])

  // Calculate separation based on scroll
  const separation = scrollProgress * 0.8

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Base platform */}
      <mesh position={[0, -1.5, 0]} material={stoneMaterial} castShadow receiveShadow>
        <boxGeometry args={[4, 0.1, 3]} />
      </mesh>

      {/* Main monolithic base volume */}
      <mesh 
        position={[0, -0.8 - separation * 0.2, 0]} 
        material={concreteMaterial} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[3.2, 1.2, 2.4]} />
      </mesh>

      {/* Left wing - cantilever */}
      <mesh 
        position={[-1.8, 0.2 + separation * 0.3, -0.2]} 
        material={concreteMaterial} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[1.6, 0.8, 2]} />
      </mesh>

      {/* Right stepped volume */}
      <group position={[1.2, 0.1 + separation * 0.4, 0]}>
        <mesh material={concreteMaterial} castShadow receiveShadow>
          <boxGeometry args={[1.4, 1.4, 2.2]} />
        </mesh>
        {/* Terrace cutout */}
        <mesh position={[0.3, 0.5, 0.8]} material={stoneMaterial} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.5, 0.6]} />
        </mesh>
      </group>

      {/* Central tower element */}
      <mesh 
        position={[0, 1.2 + separation * 0.5, 0]} 
        material={concreteMaterial} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[1.2, 2.4, 1.4]} />
      </mesh>

      {/* Tower top - glass pavilion */}
      <mesh 
        position={[0, 2.8 + separation * 0.6, 0]} 
        material={glassMaterial} 
        castShadow
      >
        <boxGeometry args={[1.4, 0.8, 1.6]} />
      </mesh>

      {/* Floating roof plane */}
      <mesh 
        position={[0, 3.4 + separation * 0.7, 0]} 
        material={stoneMaterial} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[2, 0.08, 2.2]} />
      </mesh>

      {/* Void / courtyard cutout visual */}
      <mesh 
        position={[-0.6, -0.2, 1.4 + separation * 0.2]} 
        material={glassMaterial}
      >
        <boxGeometry args={[1.8, 1.6, 0.05]} />
      </mesh>

      {/* Horizontal bridge element */}
      <mesh 
        position={[-0.3, 0.8 + separation * 0.35, -1.4]} 
        material={concreteMaterial} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[2.6, 0.15, 0.5]} />
      </mesh>

      {/* Sculptural vertical fin */}
      <mesh 
        position={[1.8, 0.6 + separation * 0.3, -0.8]} 
        rotation={[0, 0.2, 0]}
        material={stoneMaterial} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[0.08, 2.5, 0.8]} />
      </mesh>

      {/* Secondary floating platform */}
      <mesh 
        position={[-1.4, 1.6 + separation * 0.45, 0.5]} 
        material={concreteMaterial} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[1.2, 0.1, 1.4]} />
      </mesh>
    </group>
  )
}

export function ArchitecturalModel({ scrollProgress }: ArchitecturalModelProps) {
  return (
    <>
      {/* Refined lighting setup */}
      <ambientLight intensity={0.4} color="#f5f3ef" />
      
      {/* Main key light - warm */}
      <directionalLight 
        position={[8, 12, 6]} 
        intensity={1.2} 
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light - cooler */}
      <directionalLight 
        position={[-6, 8, -4]} 
        intensity={0.4} 
        color="#e8eef5"
      />
      
      {/* Rim light */}
      <directionalLight 
        position={[0, 5, -10]} 
        intensity={0.3} 
        color="#ffffff"
      />

      {/* Subtle ground reflection */}
      <pointLight position={[0, -3, 0]} intensity={0.15} color="#f0ebe5" />

      <ArchitecturalSculpture scrollProgress={scrollProgress} />
    </>
  )
}
