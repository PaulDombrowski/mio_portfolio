import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../App.css';

const AnimatedShape = ({ color }) => {
  const shapeRef = useRef();

  useEffect(() => {
    const svg = d3.select(shapeRef.current);
    const path = svg.select('path');

    const generateRandomPath = () => {
      const points = Array.from({ length: 4 }, () => [
        Math.random() * 120 - 10,  // reduzierte horizontale Ausdehnung
        Math.random() * 120 - 10   // reduzierte vertikale Ausdehnung
      ]);
      return `M${points[0][0]} ${points[0][1]} Q ${points[1][0]} ${points[1][1]}, ${points[2][0]} ${points[2][1]} T ${points[3][0]} ${points[3][1]} Z`;
    };

    const morphing = () => {
      path
        .transition()
        .duration(3000)  // Verlängert die Dauer der Übergänge für weichere Animationen
        .attr('d', generateRandomPath)
        .on('end', morphing);
    };

    morphing();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      svg.attr('width', width).attr('height', height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const path = d3.select(shapeRef.current).select('path');
    path.attr('stroke', color || '#FFFF33');  // Fallback-Farbe, falls keine Farbe gesetzt ist
  }, [color]);

  return (
    <div className="animated-shape-container">
      <svg ref={shapeRef} viewBox="0 0 100 100" className="animated-shape">
        <path
          d="M10 10 Q 50 15, 90 10 T 90 90 Q 50 85, 10 90 T 10 10 Z"
          fill="none"
          stroke={color || '#FFFF33'}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default AnimatedShape;
