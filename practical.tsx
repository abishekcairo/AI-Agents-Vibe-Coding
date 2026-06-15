import React, { useState, useEffect, useRef } from 'react';
import { Particle, ParticleType, SnowflakeParticle, BalloonParticle } from '../types';

interface ParticlePresenterProps {
  activeEffect: ParticleType | null;
  onEffectEnd: () => void;
  density: number; // multiplier for spawn rate
  speedMultiplier: number; // multiplier for fall/rise speed
}

// Formal refined color palettes for balloons
const BALLOON_COLORS = [
  { name: 'Velvet Burgundy', bg: 'rgba(128, 0, 32, 0.9)', border: '#5c0017', accent: '#ff8a9a', text: '#ffeef0' },
  { name: 'Imperial Blue', bg: 'rgba(21, 57, 107, 0.95)', border: '#0d2342', accent: '#739fe0', text: '#e6effc' },
  { name: 'Sage & Slate', bg: 'rgba(47, 79, 79, 0.9)', border: '#1c3030', accent: '#7ab8b8', text: '#f0fcfc' },
  { name: 'Champagne Gold', bg: 'rgba(197, 160, 89, 0.95)', border: '#8c6b2d', accent: '#ffeba3', text: '#fffbf0' },
  { name: 'Brushed Bronze', bg: 'rgba(139, 90, 43, 0.9)', border: '#613913', accent: '#dfaf7f', text: '#fbf5ee' },
  { name: 'Sienna Dusk', bg: 'rgba(160, 82, 45, 0.9)', border: '#703417', accent: '#ec9f79', text: '#fff4f0' },
];

export default function ParticlePresenter({
  activeEffect,
  onEffectEnd,
  density = 1.0,
  speedMultiplier = 1.0,
}: ParticlePresenterProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeEffectRef = useRef<ParticleType | null>(null);

  // Sync ref to read in async intervals without closures issues
  useEffect(() => {
    activeEffectRef.current = activeEffect;
    if (!activeEffect) {
      // If effect cleared, we can let existing particles finish or fade out
    }
  }, [activeEffect]);

  // Clean up existing out-of-bounds particles based on their animation duration
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setParticles((prev) =>
        prev.filter((p) => {
          // If particle was created more than 7s ago, remove it
          const maxAge = 8000;
          const age = now - parseInt(p.id.split('-')[1]);
          return age < maxAge;
        })
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Set up particle spawning while activeEffect is running
  useEffect(() => {
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = null;
    }

    if (!activeEffect) return;

    const spawnRateMs = activeEffect === 'snowflake' 
      ? Math.max(80, 150 / density) 
      : Math.max(100, 220 / density);

    const spawnInterval = setInterval(() => {
      if (activeEffectRef.current !== activeEffect) return;

      const id = `${activeEffect}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const x = 5 + Math.random() * 90; // percentage placement to avoid outer edges
      const baseSize = activeEffect === 'snowflake'
        ? 16 + Math.random() * 12 // 16px to 28px "medium" size
        : 38 + Math.random() * 12; // 38px to 50px physical width

      const speedBase = activeEffect === 'snowflake'
        ? 3.5 + Math.random() * 2 // 3.5s to 5.5s
        : 4.0 + Math.random() * 2.5; // 4.0s to 6.5s

      const speed = speedBase / speedMultiplier;
      const opacity = 0.75 + Math.random() * 0.25;

      if (activeEffect === 'snowflake') {
        const driftSpeed = 3 + Math.random() * 3;
        const rotationSpeed = 120 + Math.random() * 360;

        const newSnowflake: SnowflakeParticle = {
          id,
          type: 'snowflake',
          x,
          size: baseSize,
          speed,
          delay: 0,
          opacity,
          driftSpeed,
          rotationSpeed,
        };
        setParticles((prev) => [...prev, newSnowflake]);
      } else {
        const colorObj = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        const swaySpeed = 2 + Math.random() * 2;
        const swayAmplitude = 20 + Math.random() * 30;

        const newBalloon: BalloonParticle = {
          id,
          type: 'balloon',
          x,
          size: baseSize,
          speed,
          delay: 0,
          opacity,
          color: JSON.stringify(colorObj),
          swaySpeed,
          swayAmplitude,
          hasString: Math.random() > 0.15,
        };
        setParticles((prev) => [...prev, newBalloon]);
      }
    }, spawnRateMs);

    spawnTimerRef.current = spawnInterval;

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
    };
  }, [activeEffect, density, speedMultiplier]);

  // Clean all particles on unmount
  useEffect(() => {
    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, []);

  return (
    <div 
      id="particle-presentation-stage"
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
    >
      {particles.map((p) => {
        if (p.type === 'snowflake') {
          const s = p as SnowflakeParticle;
          return (
            <div
              key={s.id}
              className="absolute snowflake-animation"
              style={{
                left: `${s.x}%`,
                top: '-40px',
                width: `${s.size}px`,
                height: `${s.size}px`,
                opacity: s.opacity,
                '--fall-duration': `${s.speed}s`,
                '--fall-rotate': `${s.rotationSpeed}deg`,
              } as React.CSSProperties}
            >
              {/* Refined vectors for a crystal elegant snowflake */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-slate-400/90 drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]"
              >
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
                {/* Crystal details */}
                <path d="M12 5l3 3m-3-3L9 8" />
                <path d="M12 19l3-3m-3 3l-3-3" />
                <path d="M19 12l-3-3m3 3l-3 3" />
                <path d="M5 12l3-3m-3 3l3 3" />
              </svg>
            </div>
          );
        } else {
          const b = p as BalloonParticle;
          const color = JSON.parse(b.color);
          const balloonHeight = b.size * 1.28;

          return (
            <div
              key={b.id}
              className="absolute balloon-animation"
              style={{
                left: `${b.x}%`,
                width: `${b.size}px`,
                height: `${balloonHeight + 35}px`, // accommodates string length
                opacity: b.opacity,
                '--rise-duration': `${b.speed}s`,
                '--sway-duration': `${b.swaySpeed}s`,
                '--sway-distance': `${b.swayAmplitude}px`,
              } as React.CSSProperties}
            >
              <div className="relative w-full h-full flex flex-col items-center">
                {/* Glossy Balloon Body */}
                <div
                  className="w-full rounded-full relative shadow-md"
                  style={{
                    height: `${balloonHeight}px`,
                    backgroundColor: color.bg,
                    border: `1.5px solid ${color.border}`,
                    boxShadow: `inset 0 4px 6px -1px ${color.accent}, 0 4px 6px -1px rgba(0,0,0,0.15)`,
                  }}
                >
                  {/* Subtle Elegant Gloss Overlay */}
                  <div 
                    className="absolute top-[10%] left-[20%] w-[30%] h-[18%] rounded-full opacity-60 bg-white"
                    style={{ filter: 'blur(1px)' }}
                  />
                  
                  {/* Knot */}
                  <div
                    className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                    style={{
                      backgroundColor: color.bg,
                      borderBottom: `1.5px solid ${color.border}`,
                      borderRight: `1.5px solid ${color.border}`,
                    }}
                  />
                </div>

                {/* Elegant dangling string (draped, swinging slightly) */}
                {b.hasString && (
                  <svg
                    className="w-4 h-12 text-slate-400/70"
                    viewBox="0 0 20 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      d="M10 0 C 4 15, 16 30, 10 50"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
