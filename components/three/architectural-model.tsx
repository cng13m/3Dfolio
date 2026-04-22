'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface ArchitecturalModelProps {
  scrollProgress: number
}

function ClientHeroModel({ scrollProgress }: ArchitecturalModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/client-hero-model.glb')

  const model = useMemo(() => {
    const clonedScene = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clonedScene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDimension = Math.max(size.x, size.y, size.z) || 1
    const normalizedScale = 6.4 / maxDimension

    clonedScene.position.sub(center)
    clonedScene.position.y -= box.min.y - center.y
    clonedScene.scale.setScalar(normalizedScale)

    clonedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return
      }

      child.castShadow = true
      child.receiveShadow = true

      if (Array.isArray(child.material)) {
        for (const material of child.material) {
          material.needsUpdate = true
        }
      } else if (child.material) {
        child.material.needsUpdate = true
      }
    })

    return clonedScene
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const progress = THREE.MathUtils.smoothstep(scrollProgress, 0.02, 0.98)
    const idle = state.clock.elapsedTime

    const targetRotationY = THREE.MathUtils.lerp(0.7, -0.55, progress) + Math.sin(idle * 0.22) * 0.04
    const targetRotationX = THREE.MathUtils.lerp(0.08, -0.05, progress)
    const targetRotationZ = Math.sin(idle * 0.16) * 0.015

    const targetX = THREE.MathUtils.lerp(0.45, -0.55, progress)
    const targetY = THREE.MathUtils.lerp(-1.8, -1.15, progress) + Math.sin(idle * 0.55) * 0.06
    const targetZ = THREE.MathUtils.lerp(0.4, -0.9, progress)
    const targetScale = THREE.MathUtils.lerp(0.9, 1.08, progress) + Math.sin(idle * 0.28) * 0.008

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

  return <primitive ref={groupRef} object={model} />
}

export function ArchitecturalModel({ scrollProgress }: ArchitecturalModelProps) {
  return (
    <>
      <ambientLight intensity={1.25} color="#f7f2ea" />
      <directionalLight
        castShadow
        color="#fff6ea"
        intensity={2.6}
        position={[7, 10, 8]}
        shadow-bias={-0.00008}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-camera-bottom={-12}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
      />
      <directionalLight color="#dbe7f3" intensity={0.8} position={[-6, 7, -6]} />
      <pointLight color="#f6ede2" intensity={0.45} position={[0, -1.2, 4]} />

      <ClientHeroModel scrollProgress={scrollProgress} />
    </>
  )
}

useGLTF.preload('/client-hero-model.glb')
