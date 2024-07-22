import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ color, scale }) => {
  const { scene } = useGLTF(`${process.env.PUBLIC_URL}/spiral.glb`);
  const modelRef = useRef();

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.sub(center);

      // Einmalige Anfangsrotation und feste Skalierung
      scene.rotation.set(Math.PI / 4, Math.PI / 4, Math.PI / 4);
      scene.scale.set(scale, scale, scale); // Skalierung basierend auf der Fenstergröße

      scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.5,
            metalness: 0.1,
          });
        }
      });
    }
  }, [scene, scale]);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color);
        }
      });
    }
  }, [color]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001;
      modelRef.current.rotation.x += 0.0005;
      modelRef.current.rotation.z += 0.0005;
    }
  });

  return <primitive ref={modelRef} object={scene} />;
};

const ResponsiveModel = ({ color, isMenuActive }) => {
  const { size } = useThree();
  const maxScale = 600 / 2000; // Maximale Skalierung bei einer Breite von 600 Pixeln
  const scale = Math.min(size.width / 2000, maxScale); // Skalierung basierend auf der Breite des Fensters, aber maximal 600 Pixel

  const displayColor = isMenuActive ? '#ffffff' : color; // Weiß, wenn Menü aktiv ist, sonst die übergebene Farbe

  return <Model color={displayColor} scale={scale} />;
};

const ThreeDModel = ({ color, isMenuActive }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 10] }} // Feste Kamera-Position
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100vh' }} // Responsivität sicherstellen
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1.5} />
      <directionalLight position={[-2, -2, -2]} intensity={1} />
      <directionalLight position={[0, 2, -2]} intensity={0.8} />
      <Suspense fallback={null}>
        <ResponsiveModel color={color} isMenuActive={isMenuActive} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

useGLTF.preload(`${process.env.PUBLIC_URL}/spiral.glb`);

export default ThreeDModel;
