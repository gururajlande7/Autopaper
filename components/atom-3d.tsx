'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Atom() {
  const nucleusRef = useRef<THREE.Mesh>(null);
  const electron1Ref = useRef<THREE.Mesh>(null);
  const electron2Ref = useRef<THREE.Mesh>(null);
  const electron3Ref = useRef<THREE.Mesh>(null);
  const orbitGroup1Ref = useRef<THREE.Group>(null);
  const orbitGroup2Ref = useRef<THREE.Group>(null);
  const orbitGroup3Ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (orbitGroup1Ref.current) orbitGroup1Ref.current.rotation.z += 0.01;
    if (orbitGroup2Ref.current) orbitGroup2Ref.current.rotation.z -= 0.008;
    if (orbitGroup3Ref.current) orbitGroup3Ref.current.rotation.z += 0.006;
  });

  return (
    <group>
      {/* Nucleus - Deep Navy Blue */}
      <Sphere ref={nucleusRef} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="#2d3d5f" />
      </Sphere>

      {/* Orbital 1 - Inner ring with electron */}
      <group ref={orbitGroup1Ref}>
        <mesh>
          <torusGeometry args={[2, 0.08, 16, 100]} />
          <meshBasicMaterial color="#35588b" />
        </mesh>
        <mesh ref={electron1Ref} position={[2, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#d4a574" emissive="#d4a574" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Orbital 2 - Middle ring with electron */}
      <group ref={orbitGroup2Ref} rotation={[0.6, 0, 0]}>
        <mesh>
          <torusGeometry args={[3, 0.08, 16, 100]} />
          <meshBasicMaterial color="#35588b" />
        </mesh>
        <mesh ref={electron2Ref} position={[3, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#d4a574" emissive="#d4a574" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Orbital 3 - Outer ring with electron */}
      <group ref={orbitGroup3Ref} rotation={[1.2, 0, 0]}>
        <mesh>
          <torusGeometry args={[4, 0.08, 16, 100]} />
          <meshBasicMaterial color="#35588b" />
        </mesh>
        <mesh ref={electron3Ref} position={[4, 0, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#d4a574" emissive="#d4a574" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Additional torus for visual depth */}
      <mesh rotation={[0.3, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.06, 16, 100]} />
        <meshBasicMaterial color="#35588b" opacity={0.3} transparent />
      </mesh>
      <mesh rotation={[0.9, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[3.5, 0.06, 16, 100]} />
        <meshBasicMaterial color="#35588b" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

export function AtomCanvas() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 48 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Atom />
        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
      </Canvas>
    </div>
  );
}
