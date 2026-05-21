const ComplexityBadge = ({ type = 'time', value, color = 'cyan' }) => {
  const colorMap = {
    cyan: {
      bg: 'rgba(0, 212, 170, 0.1)',
      border: 'rgba(0, 212, 170, 0.3)',
      text: '#00d4aa',
    },
    blue: {
      bg: 'rgba(79, 142, 247, 0.1)',
      border: 'rgba(79, 142, 247, 0.3)',
      text: '#4f8ef7',
    },
    purple: {
      bg: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.3)',
      text: '#a855f7',
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#f59e0b',
    },
  };

  const colors = colorMap[color] || colorMap.cyan;
  const icon = type === 'time' ? '⏱' : type === 'space' ? '🗂' : '⚡';

  return (
    <span
      className="complexity-badge"
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      {icon} {value}
    </span>
  );
};

export default ComplexityBadge;
