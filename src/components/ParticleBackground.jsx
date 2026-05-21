import { useMemo } from 'react';

const ParticleBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: Math.random() * 20 + 15,
      color: ['#4f8ef7', '#00d4aa', '#a855f7'][Math.floor(Math.random() * 3)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Mesh gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(79, 142, 247, 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 80%, rgba(168, 85, 247, 0.05) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(0, 212, 170, 0.03) 0%, transparent 70%)
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
