import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function CinematicScene() {
  const group = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Main Cinematic Sphere */}
      <Float speed={2} rotationIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.9}
            roughness={0.1}
            emissive="#4f46e5"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      {/* Neon Rings */}
      <Float speed={1.5}>
        <mesh rotation={[1.2, 0, 0]}>
          <torusGeometry args={[4, 0.15, 32, 100]} />
          <meshStandardMaterial color="#c026d3" emissive="#c026d3" emissiveIntensity={0.8} />
        </mesh>
      </Float>

      <Float speed={2.2}>
        <mesh rotation={[0.8, 0.6, 0]}>
          <torusGeometry args={[5.2, 0.1, 32, 80]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.6} />
        </mesh>
      </Float>

      {/* Floating Film Reels */}
      {[ -4, 4 ].map((x, i) => (
        <Float key={i} speed={1 + i} rotationIntensity={1}>
          <group position={[x, 1.5, -2]}>
            <mesh>
              <cylinderGeometry args={[1.2, 1.2, 0.4, 32]} />
              <meshStandardMaterial color="#111" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.8, 0.8, 0.6, 32]} />
              <meshStandardMaterial color="#e11d48" emissive="#e11d48" emissiveIntensity={0.4} />
            </mesh>
          </group>
        </Float>
      ))}

      {/* Director's Spotlight Text */}
      <Text
        position={[0, 5, -6]}
        fontSize={1.8}
        color="#a5b4fc"
        anchorX="center"
        anchorY="middle"
      >
        EPIC TECH AI
      </Text>

      <Text
        position={[0, 3.2, -6]}
        fontSize={0.9}
        color="#67e8f9"
        anchorX="center"
        anchorY="middle"
      >
        CINEMATIC STUDIO
      </Text>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 8, 18], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'radial-gradient(circle at 50% 30%, #1a1a2e 0%, #020205 70%)' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 20, 10]} intensity={2} color="#c026d3" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#22d3ee" />
        
        <CinematicScene />
        <Environment preset="night" />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={8}
          maxDistance={35}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>

      {/* Cinematic Overlay Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Film grain overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.8px,transparent_1px)] bg-[length:4px_4px] opacity-10"></div>
        
        {/* Corner vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#00000022_0px,#00000022_2px,transparent_2px,transparent_6px)] pointer-events-none"></div>
      </div>
    </div>
  );
}
