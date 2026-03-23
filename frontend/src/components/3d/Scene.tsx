import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 200

const Scene = () => {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)

    const primaryColor = new THREE.Color('#a8a4ff')
    const tertiaryColor = new THREE.Color('#ff9dcf')
    const dimColor = new THREE.Color('#665bff')

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 16
      pos[i3 + 1] = (Math.random() - 0.5) * 16
      pos[i3 + 2] = (Math.random() - 0.5) * 10

      const colorChoice = Math.random()
      const color = colorChoice < 0.5 ? primaryColor : colorChoice < 0.8 ? dimColor : tertiaryColor
      col[i3] = color.r
      col[i3 + 1] = color.g
      col[i3 + 2] = color.b
    }

    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return

    const time = state.clock.elapsedTime * 0.3
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      posArray[i3 + 1] += Math.sin(time + i * 0.1) * 0.002
      posArray[i3] += Math.cos(time + i * 0.05) * 0.001
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y = time * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default Scene
