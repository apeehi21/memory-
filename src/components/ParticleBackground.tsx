import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Heart and glowing particle definitions
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      type: 'heart' | 'glow' | 'star';
      color: string;
      rotation: number;
      rotSpeed: number;
    }

    const particles: Particle[] = [];
    const colors = [
      'rgba(244, 63, 94, ', // rose-500
      'rgba(251, 113, 133, ', // rose-400
      'rgba(236, 72, 153, ', // pink-500
      'rgba(244, 114, 182, ', // pink-400
      'rgba(225, 29, 72, ', // rose-600
      'rgba(253, 164, 175, ', // rose-300
    ];

    const particleCount = Math.min(window.innerWidth < 768 ? 25 : 45, 50);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 6,
        speedY: -(Math.random() * 0.7 + 0.3),
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.7 + 0.2,
        fadeSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        type: Math.random() > 0.35 ? 'heart' : Math.random() > 0.5 ? 'glow' : 'star',
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      // top left curve
      context.bezierCurveTo(
        -size / 2,
        -size / 2,
        -size,
        topCurveHeight / 3,
        0,
        size
      );
      // top right curve
      context.bezierCurveTo(
        size,
        topCurveHeight / 3,
        size / 2,
        -size / 2,
        0,
        topCurveHeight
      );
      context.closePath();
      context.fillStyle = `${color}${opacity})`;
      context.shadowColor = `${color}0.8)`;
      context.shadowBlur = size * 0.8;
      context.fill();
      context.restore();
    };

    const drawGlow = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number
    ) => {
      context.save();
      const gradient = context.createRadialGradient(x, y, 0, x, y, size * 2);
      gradient.addColorStop(0, `${color}${opacity})`);
      gradient.addColorStop(0.5, `${color}${opacity * 0.4})`);
      gradient.addColorStop(1, `${color}0)`);
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, size * 2, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.85 || p.opacity < 0.2) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Wrap around
        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else {
          drawGlow(ctx, p.x, p.y, p.size, p.color, p.opacity);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
