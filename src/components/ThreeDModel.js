import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ color, scale, isChrome }) => {
  const { scene } = useGLTF(`${process.env.PUBLIC_URL}/spiral.glb`);
  const modelRef = useRef();

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.sub(center);

      scene.scale.set(scale, scale, scale);

      scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.5,
            metalness: 0.1,
          });
          child.frustumCulled = true; // Aktiviert Frustum Culling
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
    const time = performance.now() * 0.001; // Zeit in Sekunden
    if (modelRef.current) {
      // Langsame oder keine Bewegung, wenn Chrome erkannt wird
      const rotationSpeed = isChrome ? 0.0001 : 0.001;
      const positionAmplitude = isChrome ? 0.05 : 0.5;

      modelRef.current.rotation.y += rotationSpeed;
      modelRef.current.position.y = Math.sin(time * 0.5) * positionAmplitude;
    }
  });

  return <primitive ref={modelRef} object={scene} />;
};

const ResponsiveModel = ({ color, isMenuActive, isChrome }) => {
  const { size, invalidate } = useThree();
  const baseScale = 2; // Basis-Skalierung
  const scaleFactor = Math.min(size.width / 2000, size.height / 2000); // Skalierungsfaktor
  const scale = baseScale * (scaleFactor > 0.5 ? scaleFactor : 0.5); // Skalierung

  const displayColor = isMenuActive ? '#ffffff' : color; // Farbe ändern bei aktivem Menü

  useEffect(() => {
    setTimeout(() => {
      invalidate();
    }, 100);
  }, [invalidate]);

  return <Model color={displayColor} scale={scale} isChrome={isChrome} />;
};

const ThreeDModel = ({ color, isMenuActive }) => {
  // Erkennen des Browsers
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  return (
    <Canvas
      camera={{ position: [10, 10, 10] }} // Kamera-Position
      gl={{ antialias: true, pixelRatio: Math.min(2, window.devicePixelRatio) }} // Antialiasing aktiviert und höhere Auflösung
      style={{ width: '100%', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1.5} />
      <directionalLight position={[-2, -2, -2]} intensity={1} />
      <directionalLight position={[0, 2, -2]} intensity={0.8} />
      <Suspense fallback={null}>
        <ResponsiveModel color={color} isMenuActive={isMenuActive} isChrome={isChrome} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

useGLTF.preload(`${process.env.PUBLIC_URL}/spiral.glb`);

export default ThreeDModel;
