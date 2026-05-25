import { useMemo } from 'react';

const ParticleBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: (i % 4) + 2,
      left: (i * 37) % 100,
      delay: (i * 7) % 15,
      duration: ((i * 11) % 20) + 15,
      color: ['#4f8ef7', '#00d4aa', '#a855f7'][i % 3],
    }));
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Ambient gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(79,142,247,.06), transparent 35%),
            radial-gradient(circle at 80% 80%, rgba(168,85,247,.05), transparent 35%),
            radial-gradient(circle at 50% 50%, rgba(0,212,170,.03), transparent 35%)
          `,
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;