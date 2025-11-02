import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Planet properties
const planetData = [
  {
    name: 'Mercury',
    color: '#a9a9a9',
    size: 0.38,
    distance: 5,
    orbitSpeed: 0.04,
    rotationSpeed: 0.01,
  },
  {
    name: 'Venus',
    color: '#d8a26e',
    size: 0.95,
    distance: 8,
    orbitSpeed: 0.025,
    rotationSpeed: 0.005,
  },
  {
    name: 'Earth',
    color: '#6fa1d8',
    size: 1,
    distance: 12,
    orbitSpeed: 0.015,
    rotationSpeed: 0.02,
  },
  {
    name: 'Mars',
    color: '#d86e6e',
    size: 0.53,
    distance: 18,
    orbitSpeed: 0.01,
    rotationSpeed: 0.018,
  },
];

// A component for planets
const Planet: React.FC<typeof planetData[0]> = ({
  color,
  size,
  distance,
  orbitSpeed,
  rotationSpeed,
}) => {
  const planetRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // Simulate orbit
    const angle = elapsedTime * orbitSpeed * 10;
    const x = distance * Math.cos(angle);
    const z = distance * Math.sin(angle);
    if (planetRef.current) {
        planetRef.current.position.set(x, 0, z);
        // Simulate rotation abt an axis
        planetRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <>
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Orbit path visual */}
      <Ring
        args={[distance - 0.02, distance + 0.02, 128]}
        rotation-x={Math.PI / 2}
      >
        <meshBasicMaterial color="white" side={THREE.DoubleSide} transparent opacity={0.2} />
      </Ring>
    </>
  );
};

// Main component to render the Solar System
const SolarSystem = () => {
    return (
        <Canvas camera={{ position: [0, 25, 45], fov: 45 }}>
            {/* Lighting */}
            <ambientLight intensity={0.1} />
            <pointLight position={[0, 0, 0]} intensity={3.0} color="#ffd48c" />

            {/* Background */}
            <Stars radius={200} depth={50} count={5000} factor={7} saturation={0} fade speed={1} />
            
            {/* Sun */}
            <mesh>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshStandardMaterial emissive="#ffd48c" emissiveIntensity={2} color="#ffd48c" />
            </mesh>
            
            {/* Render each planet */}
            {planetData.map(planet => <Planet key={planet.name} {...planet} />)}

            {/* Controls */}
            <OrbitControls enablePan enableZoom enableRotate minDistance={5} maxDistance={100} />
        </Canvas>
    )
}

const SimulationPage: React.FC = () => {
  return (
    <div className="relative z-10 flex flex-col items-center p-4 sm:p-6">
      <div className="content-box w-full max-w-5xl p-8 space-y-6 bg-black/40 backdrop-blur-lg rounded-xl border border-gray-800/60 shadow-2xl shadow-purple-500/10">
        <h1>Solar System Simulation</h1>
        <p>
          Explore a miniature model of our solar system. Click and drag to orbit, scroll to zoom, and right-click to pan.
        </p>
        <div className="w-full h-[60vh] rounded-lg overflow-hidden bg-black/50 border border-gray-700/50 cursor-grab active:cursor-grabbing">
          <SolarSystem />
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;