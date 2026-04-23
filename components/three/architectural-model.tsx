'use client'

import { useMemo, useRef } from 'react'
import { Edges } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ArchitecturalModelProps {
  scrollProgress: number
}

type Vec3 = [number, number, number]

interface RibbedBoxProps {
  position: Vec3
  scale: Vec3
  color?: string
  ribColor?: string
  ribSpacing?: number
  front?: boolean
  right?: boolean
}

interface BoxProps {
  position: Vec3
  scale: Vec3
  color: string
  roughness?: number
  edgeColor?: string
}

function SolidBox({ position, scale, color, roughness = 0.72, edgeColor = '#7f7b73' }: BoxProps) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} />
      <Edges color={edgeColor} scale={1.002} threshold={18} />
    </mesh>
  )
}

function RibbedBox({
  position,
  scale,
  color = '#eef1f0',
  ribColor = '#cfd5d6',
  ribSpacing = 0.16,
  front = true,
  right = true,
}: RibbedBoxProps) {
  const frontRibs = useMemo(() => {
    const count = Math.max(1, Math.floor(scale[0] / ribSpacing))
    return Array.from({ length: count + 1 }, (_, index) => -scale[0] / 2 + index * ribSpacing)
  }, [ribSpacing, scale])

  const sideRibs = useMemo(() => {
    const count = Math.max(1, Math.floor(scale[2] / ribSpacing))
    return Array.from({ length: count + 1 }, (_, index) => -scale[2] / 2 + index * ribSpacing)
  }, [ribSpacing, scale])

  return (
    <group position={position}>
      <SolidBox position={[0, 0, 0]} scale={scale} color={color} edgeColor="#a8adb0" />

      {front &&
        frontRibs.map((x) => (
          <mesh key={`front-${x}`} castShadow receiveShadow position={[x, 0, scale[2] / 2 + 0.018]}>
            <boxGeometry args={[0.026, scale[1] * 1.01, 0.035]} />
            <meshStandardMaterial color={ribColor} roughness={0.62} metalness={0.08} />
          </mesh>
        ))}

      {right &&
        sideRibs.map((z) => (
          <mesh key={`side-${z}`} castShadow receiveShadow position={[scale[0] / 2 + 0.018, 0, z]}>
            <boxGeometry args={[0.035, scale[1] * 1.01, 0.026]} />
            <meshStandardMaterial color={ribColor} roughness={0.62} metalness={0.08} />
          </mesh>
        ))}
    </group>
  )
}

function GlassPanel({ position, scale }: { position: Vec3; scale: Vec3 }) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        color="#6d7a7b"
        roughness={0.12}
        metalness={0.04}
        transparent
        opacity={0.58}
        transmission={0.18}
      />
      <Edges color="#2e3333" scale={1.004} threshold={10} />
    </mesh>
  )
}

function RollerShutter({ position, width = 1.35 }: { position: Vec3; width?: number }) {
  return (
    <group position={position}>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} castShadow receiveShadow position={[0, 0.24 - index * 0.08, 0]}>
          <boxGeometry args={[width, 0.028, 0.055]} />
          <meshStandardMaterial color="#353331" roughness={0.48} metalness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function WoodPerforatedWall() {
  const dots = useMemo(() => {
    const points: Vec3[] = []
    for (let x = -2.4; x <= 2.4; x += 0.34) {
      for (let y = -0.42; y <= 0.58; y += 0.22) {
        points.push([x + (Math.sin(y * 13 + x) * 0.035), y, 0])
      }
    }
    return points
  }, [])

  return (
    <group position={[0.65, 0.22, 1.84]}>
      <SolidBox position={[0, 0, 0]} scale={[5.25, 1.55, 0.12]} color="#c7ae8d" roughness={0.86} edgeColor="#927a5f" />
      {dots.map((point, index) => (
        <mesh key={index} position={point}>
          <circleGeometry args={[0.018, 10]} />
          <meshStandardMaterial color="#6b543e" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function WindowFrame({ position, scale }: { position: Vec3; scale: Vec3 }) {
  return (
    <group position={position}>
      <GlassPanel position={[0, 0, 0]} scale={scale} />
      <SolidBox position={[0, scale[1] / 2 + 0.025, 0.045]} scale={[scale[0] + 0.12, 0.05, 0.08]} color="#2f3332" roughness={0.42} edgeColor="#2f3332" />
      <SolidBox position={[0, -scale[1] / 2 - 0.025, 0.045]} scale={[scale[0] + 0.12, 0.05, 0.08]} color="#2f3332" roughness={0.42} edgeColor="#2f3332" />
      <SolidBox position={[-scale[0] / 2 - 0.025, 0, 0.045]} scale={[0.05, scale[1] + 0.12, 0.08]} color="#2f3332" roughness={0.42} edgeColor="#2f3332" />
      <SolidBox position={[scale[0] / 2 + 0.025, 0, 0.045]} scale={[0.05, scale[1] + 0.12, 0.08]} color="#2f3332" roughness={0.42} edgeColor="#2f3332" />
      <SolidBox position={[0, 0, 0.05]} scale={[0.035, scale[1] + 0.08, 0.08]} color="#373b3b" roughness={0.42} edgeColor="#373b3b" />
    </group>
  )
}

function CafeSet({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.035, 20]} />
        <meshStandardMaterial color="#6d5a49" roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.4, 10]} />
        <meshStandardMaterial color="#4f4b44" roughness={0.62} />
      </mesh>
      {[-0.42, 0.42].map((x) => (
        <group key={x} position={[x, 0, 0.03]}>
          <SolidBox position={[0, 0.24, 0]} scale={[0.2, 0.04, 0.2]} color="#8b6f58" roughness={0.76} edgeColor="#6f5947" />
          <SolidBox position={[0, 0.48, -0.09]} scale={[0.2, 0.32, 0.04]} color="#8b6f58" roughness={0.76} edgeColor="#6f5947" />
          <SolidBox position={[-0.07, 0.1, -0.06]} scale={[0.025, 0.22, 0.025]} color="#4f4b44" roughness={0.62} edgeColor="#4f4b44" />
          <SolidBox position={[0.07, 0.1, 0.06]} scale={[0.025, 0.22, 0.025]} color="#4f4b44" roughness={0.62} edgeColor="#4f4b44" />
        </group>
      ))}
    </group>
  )
}

function ReferenceBuilding({ scrollProgress }: ArchitecturalModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { size } = useThree()

  useFrame((state) => {
    if (!groupRef.current) {
      return
    }

    const progress = THREE.MathUtils.smoothstep(scrollProgress, 0.02, 0.98)
    const idle = state.clock.elapsedTime
    const isMobile = size.width < 640
    const responsiveScale = isMobile ? 0.52 : size.width < 900 ? 0.7 : 0.78

    const targetRotationY = THREE.MathUtils.lerp(-1.05, 1.05, progress) + Math.sin(idle * 0.16) * 0.018
    const targetRotationX = THREE.MathUtils.lerp(0.02, -0.035, progress)
    const targetX = THREE.MathUtils.lerp(isMobile ? 0.02 : 0.38, isMobile ? -0.1 : 0.08, progress)
    const targetY = THREE.MathUtils.lerp(isMobile ? -1.28 : -1.34, isMobile ? -1.12 : -1.18, progress)
    const targetZ = THREE.MathUtils.lerp(0, -0.22, progress)
    const targetScale = responsiveScale * (THREE.MathUtils.lerp(1, 1.04, progress) + Math.sin(idle * 0.22) * 0.004)

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05)
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05))
  })

  return (
    <group ref={groupRef}>
      <SolidBox position={[0, -0.08, 0.1]} scale={[8.6, 0.22, 4.8]} color="#d7d2c7" roughness={0.84} edgeColor="#b5ad9f" />
      <SolidBox position={[0, -0.24, 2.78]} scale={[9.2, 0.06, 0.6]} color="#4e4b47" roughness={0.7} edgeColor="#4e4b47" />
      <SolidBox position={[0, -0.18, 2.14]} scale={[9.2, 0.035, 0.06]} color="#f4f2ec" roughness={0.7} edgeColor="#f4f2ec" />

      <WoodPerforatedWall />
      <SolidBox position={[-3.08, 0.2, 1.84]} scale={[1.8, 1.45, 0.16]} color="#eadfce" roughness={0.84} edgeColor="#c9bba6" />
      <SolidBox position={[-2.26, 0.28, 1.92]} scale={[0.82, 1.18, 0.12]} color="#9a5a42" roughness={0.68} edgeColor="#784330" />
      <GlassPanel position={[0.1, 0.15, 1.94]} scale={[0.72, 1.28, 0.08]} />
      <GlassPanel position={[1.15, 0.15, 1.94]} scale={[0.78, 1.28, 0.08]} />
      <GlassPanel position={[3.16, 0.18, 1.94]} scale={[1.05, 1.25, 0.08]} />
      <RollerShutter position={[0.12, 0.96, 2.02]} width={1.18} />
      <RollerShutter position={[1.15, 0.96, 2.02]} width={1.22} />
      <RollerShutter position={[3.16, 0.96, 2.02]} width={1.12} />

      <RibbedBox position={[-1.58, 1.55, 0.18]} scale={[5.65, 1.42, 3.1]} front right={false} />
      <RibbedBox position={[2.34, 1.78, 0.18]} scale={[4.6, 1.62, 3.3]} front right />
      <RibbedBox position={[-2.62, 2.86, -0.42]} scale={[2.6, 1.35, 2.55]} front right={false} />
      <RibbedBox position={[0.4, 3.05, -0.34]} scale={[2.85, 1.5, 2.45]} front right />
      <RibbedBox position={[2.86, 2.88, -0.62]} scale={[1.95, 1.18, 2.1]} front right />
      <RibbedBox position={[0.82, 4.0, -0.5]} scale={[2.35, 1.28, 1.78]} front right />

      <SolidBox position={[0.75, 1.06, 2.08]} scale={[6.4, 0.16, 0.42]} color="#eee8dc" roughness={0.7} edgeColor="#c7bdae" />
      <WindowFrame position={[-1.64, 1.55, 1.92]} scale={[0.94, 0.82, 0.08]} />
      <WindowFrame position={[2.9, 1.62, 1.92]} scale={[0.32, 1.14, 0.08]} />
      <WindowFrame position={[-1.55, 2.8, 1.0]} scale={[0.72, 0.82, 0.08]} />

      <SolidBox position={[0.1, 2.42, 1.7]} scale={[0.16, 1.65, 0.16]} color="#4a4f50" roughness={0.5} edgeColor="#343838" />
      <SolidBox position={[0.1, 2.42, 1.44]} scale={[0.08, 1.65, 0.08]} color="#dad4c9" roughness={0.7} edgeColor="#9b9488" />
      <SolidBox position={[0.1, 2.42, 1.18]} scale={[0.08, 1.65, 0.08]} color="#dad4c9" roughness={0.7} edgeColor="#9b9488" />

      {[-0.08, 0.88, 1.86].map((x) => (
        <CafeSet key={x} position={[x, -0.08, 2.44]} />
      ))}

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.37, 0.1]}>
        <planeGeometry args={[10, 6.2]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

export function ArchitecturalModel({ scrollProgress }: ArchitecturalModelProps) {
  return (
    <>
      <ambientLight intensity={1.35} color="#f8f2e8" />
      <directionalLight
        castShadow
        color="#fff7eb"
        intensity={2.7}
        position={[7, 9, 7]}
        shadow-bias={-0.0001}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        shadow-camera-bottom={-12}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
      />
      <directionalLight color="#d9e7f5" intensity={0.8} position={[-7, 7, -5]} />
      <pointLight color="#ffd9b2" intensity={0.45} position={[0, 0.4, 3.6]} />

      <ReferenceBuilding scrollProgress={scrollProgress} />
    </>
  )
}
