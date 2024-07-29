import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ color }) => {
  const { scene } = useGLTF(`${process.env.PUBLIC_URL}/spiral.glb`);
  const modelRef = useRef();
  const initialSetup = useRef(false);
  const { size } = useThree();

  useEffect(() => {
    if (scene && !initialSetup.current) {
      initialSetup.current = true;

      // Bounding Box und Zentrierung
      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.sub(center); // Zentriert das Modell

      // Einmalige Skalierung basierend auf der Fenstergröße
      const scaleFactor = Math.min(size.width / 2000, size.height / 2000);
      const scale = Math.max(scaleFactor, 1.5);
      scene.scale.set(scale, scale, scale);

      // Zusätzliche Verschiebungen
      const additionalYOffset = -8; // Senkt das Modell leicht ab
      const additionalXOffset = 20; // Verschiebt das Modell nach rechts
      const additionalZOffset = 15; // Bewegt das Modell leicht nach vorne
      scene.position.set(center.x + additionalXOffset, center.y + additionalYOffset, center.z + additionalZOffset);

      // Neue Ausrichtung: Rotationen entlang der X-, Y- und Z-Achsen
      scene.rotation.x = Math.PI / 3.5; // Neigung um 51.43 Grad entlang der X-Achse
      scene.rotation.y = Math.PI / 5.5; // 32.73 Grad Drehung entlang der Y-Achse
      scene.rotation.z = Math.PI / 8; // 22.5 Grad Drehung entlang der Z-Achse

      // Farbe setzen, ohne das Material zu überschreiben
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({ color: color });
        }
      });
    } else if (scene) {
      // Nur Farbe bei Änderungen aktualisieren
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color);
        }
      });
    }
  }, [scene, color, size]);

  useFrame(() => {
    if (modelRef.current) {
      // Langsame Rotation um die Z-Achse (blau)
      modelRef.current.rotation.z += 0.002; // Sehr langsame Rotation
    }
  });

  return <primitive ref={modelRef} object={scene} />;
};

const ThreeDModel = ({ color }) => {
  return (
    <Canvas
      camera={{ position: [20, 20, 20], up: [-2, 0, -3] }}
      style={{ width: '100%', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1.5} />
      <Suspense fallback={null}>
        <Model color={color} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

useGLTF.preload(`${process.env.PUBLIC_URL}/spiral.glb`);

export default ThreeDModel;
