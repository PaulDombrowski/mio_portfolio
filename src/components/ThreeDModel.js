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

      // Einmalige feste Skalierung ohne Rotation
      scene.position.set(0, 0, 0); // Positioniere das Modell in der Mitte
      scene.rotation.set(0, 0, 0); // Keine Anfangsrotation
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
      modelRef.current.rotation.y += 0.0005; // Langsame Rotation um die Y-Achse
      modelRef.current.rotation.z += 0.0005; // Zusätzliche langsame Rotation um die Z-Achse
      modelRef.current.rotation.x += 0.0005; // Zusätzliche langsame Rotation um die X-Achse
    }
  });

  return <primitive ref={modelRef} object={scene} />;
};

const ResponsiveModel = ({ color, isMenuActive }) => {
  const { size, invalidate } = useThree();
  const baseScale = 2; // Reduzierte Basis-Skalierung, um das Modell etwas kleiner zu machen
  const scaleFactor = Math.min(size.width / 2000, size.height / 2000); // Minimaler Skalierungsfaktor
  const scale = baseScale * (scaleFactor > 0.5 ? scaleFactor : 0.5); // Verhindere zu kleine Skalierung

  const displayColor = isMenuActive ? '#ffffff' : color; // Weiß, wenn Menü aktiv ist, sonst die übergebene Farbe

  useEffect(() => {
    // Forciert ein erneutes Rendern nach der ersten Anzeige
    setTimeout(() => {
      invalidate();
    }, 100);
  }, [invalidate]);

  return <Model color={displayColor} scale={scale} />;
};

const ThreeDModel = ({ color, isMenuActive }) => {
  return (
    <Canvas
      camera={{ position: [10, 10, 10] }} // Kamera-Position leicht schräg
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
