import React, { useState, useEffect, useRef } from 'react';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

// they're just blurred circles shhhhh
const auroaColors = [
  'radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.4), rgba(138, 43, 226, 0))',
  'radial-gradient(circle at 50% 50%, rgba(75, 0, 130, 0.4), rgba(75, 0, 130, 0))',
  'radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.3), rgba(255, 105, 180, 0))',
  'radial-gradient(circle at 50% 50%, rgba(0, 191, 255, 0.3), rgba(0, 191, 255, 0))',
];

interface Blob {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface Star {
  x: number;
  y: number;
  baseRadius: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const createBlob = (id: number): Blob => {
  const size = random(300, 600);
  const color = auroaColors[Math.floor(random(0, auroaColors.length))];
  const side = Math.floor(random(0, 4)); // 0: top, 1: right, 2: bottom, 3: left

  let x: number, y: number, vx: number, vy: number;

  switch (side) {
    case 0: // Spawn from Top
      x = random(0, window.innerWidth);
      y = -size;
      vx = random(-0.5, 0.5);
      vy = random(0.2, 0.75); // Ensure it moves downwards
      break;
    case 1: // Spawn from Right
      x = window.innerWidth;
      y = random(0, window.innerHeight);
      vx = random(-0.75, -0.2); // Ensure it moves leftwards
      vy = random(-0.5, 0.5);
      break;
    case 2: // Spawn from Bottom
      x = random(0, window.innerWidth);
      y = window.innerHeight;
      vx = random(-0.5, 0.5);
      vy = random(-0.75, -0.2); // Ensure it moves upwards
      break;
    case 3: // Spawn from Left
    default:
      x = -size;
      y = random(0, window.innerHeight);
      vx = random(0.2, 0.75); // Ensure it moves rightwards
      vy = random(-0.5, 0.5);
      break;
  }

  return { id, x, y, vx, vy, size, color };
};

const BackgroundLayout: React.FC = () => {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const sparkleTimeoutId = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const initialBlobs = Array.from({ length: 4 }, (_, i) => createBlob(i));
    setBlobs(initialBlobs);

    const animateBlobs = () => {
      setBlobs(prevBlobs =>
        prevBlobs.map(blob => {
          let newX = blob.x + blob.vx;
          let newY = blob.y + blob.vy;
          if (newX + blob.size < 0 || newX > window.innerWidth || newY + blob.size < 0 || newY > window.innerHeight) {
            return createBlob(blob.id);
          }
          return { ...blob, x: newX, y: newY };
        })
      );
      animationFrameId.current = requestAnimationFrame(animateBlobs);
    };
    animationFrameId.current = requestAnimationFrame(animateBlobs);

    const scheduleNextSparkle = () => {
      const delay = random(2000, 5000);
      sparkleTimeoutId.current = window.setTimeout(() => {
        const newSparkle: Sparkle = {
          id: Date.now() + Math.random(),
          x: random(0, window.innerWidth),
          y: random(0, window.innerHeight),
          size: random(2, 6),
        };
        setSparkles(prev => [...prev, newSparkle]);
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 1500);
        scheduleNextSparkle();
      }, delay);
    };
    scheduleNextSparkle();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (sparkleTimeoutId.current) clearTimeout(sparkleTimeoutId.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Star[] = [];
    let canvasAnimationFrameId: number;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 2500);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseRadius: Math.random() * 0.5,
          twinkleSpeed: Math.random() * 0.0005 + 0.0002,
          twinkleOffset: Math.random() * Math.PI * 20,
        });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animateStars = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const minRadius = 0.5;
      const maxRadius = 2.5;
      const interactionRadiusSq = 150 * 150;

      stars.forEach(star => {
        // Twinkle effect
        const twinkleFactor = (Math.sin(timestamp * star.twinkleSpeed + star.twinkleOffset) + 1) / 2; // O to 1
        const opacity = 0.3 + twinkleFactor * 0.7; // Range from 0.3 to 1.0

        // Mouse interaction effect
        let finalRadius = star.baseRadius;
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = star.x - mouseRef.current.x;
          const dy = star.y - mouseRef.current.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < interactionRadiusSq) {
            const factor = 1 - (distSq / interactionRadiusSq);
            finalRadius = minRadius + (maxRadius - minRadius) * (factor * factor);
          }
        }
        finalRadius = Math.max(minRadius, Math.min(finalRadius, maxRadius));

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, finalRadius, 0, Math.PI * 2);
        ctx.fill();
      });
      canvasAnimationFrameId = requestAnimationFrame(animateStars);
    };

    const handleResize = () => {
      setCanvasDimensions();
      createStars();
    };

    window.addEventListener('resize', handleResize);

    setCanvasDimensions();
    createStars();
    animateStars(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(canvasAnimationFrameId);
    };
  }, []);

  return (
    // make decorative background non-interactive so UI elements above are clickable
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Layer 1: Static, smaller stars */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(white .5px, transparent 0)',
        backgroundSize: '40px 40px',
        opacity: 0.15
      }}></div>

  {/* Layer 2: Interactive Canvas Stars */}
  <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"></canvas>

      {/* Layer 3: Dynamic Aurora Blobs */}
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute rounded-full filter blur-3xl pointer-events-none"
          style={{
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            background: blob.color,
            transform: `translate(${blob.x}px, ${blob.y}px)`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Layer 4: Flashing Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle-container pointer-events-none"
          style={{
            top: `${sparkle.y}px`,
            left: `${sparkle.x}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
        >
          <div className="sparkle-dot"></div>
        </div>
      ))}
    </div>
  );
}

export default BackgroundLayout;
