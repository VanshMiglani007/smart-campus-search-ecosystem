import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, Clock, Hash, FolderOpen, BookOpen } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSearch } from '../context/SearchContext';
import ComplexityBadge from '../components/ComplexityBadge';
import { getCategoryColor } from '../data/campusData';
import { S, C } from '../styles';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Filler, Title, Tooltip, Legend
);

const chartFont = { family: "'JetBrains Mono', monospace", size: 10 };

const AnalyticsDashboard = () => {
  const { analytics, frequencyData, hashMap } = useSearch();

  const avgResponse = useMemo(() => {
    if (analytics.responseTimes.length === 0) return '—';
    const avg = analytics.responseTimes.reduce((a, b) => a + b, 0) / analytics.responseTimes.length;
    return `${avg.toFixed(2)}ms`;
  }, [analytics.responseTimes]);

  const uniqueTerms = useMemo(() => {
    void analytics.totalSearches;
    return hashMap?.current ? hashMap.current.getCount() : 0;
  }, [hashMap, analytics.totalSearches]);

  const topCategory = useMemo(() => {
    if (frequencyData.length === 0) return '—';
    return frequencyData[0]?.key?.split(' ').pop() || '—';
  }, [frequencyData]);

  const barChartData = useMemo(() => ({
    labels: frequencyData.slice(0, 10).map(d => d.key.length > 15 ? d.key.slice(0, 15) + '…' : d.key),
    datasets: [{
      label: 'Search Count',
      data: frequencyData.slice(0, 10).map(d => d.value),
      backgroundColor: frequencyData.slice(0, 10).map((_, i) => `rgba(79, 142, 247, ${0.9 - i * 0.06})`),
      borderColor: 'rgba(79, 142, 247, 1)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  }), [frequencyData]);

  const lineChartData = useMemo(() => {
    const timeline = analytics.searchTimeline;
    if (timeline.length === 0) {
      return {
        labels: ['Start'],
        datasets: [{ label: 'Total Searches', data: [0], borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.1)', tension: 0.4, fill: true, pointRadius: 3, pointBackgroundColor: '#00d4aa' }],
      };
    }
    return {
      labels: timeline.map((_, i) => `#${i + 1}`),
      datasets: [{ label: 'Total Searches', data: timeline.map(t => t.count), borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.1)', tension: 0.4, fill: true, pointRadius: 3, pointBackgroundColor: '#00d4aa' }],
    };
  }, [analytics.searchTimeline]);

  const doughnutData = useMemo(() => {
    const catCounts = {};
    for (const item of frequencyData) {
      const cats = ['notes', 'exams', 'faculty', 'hostel', 'events', 'library', 'courses', 'clubs', 'labs', 'resources'];
      let assigned = 'other';
      const lower = item.key.toLowerCase();
      for (const cat of cats) {
        if (lower.includes(cat.slice(0, 4))) { assigned = cat; break; }
      }
      catCounts[assigned] = (catCounts[assigned] || 0) + item.value;
    }
    const labels = Object.keys(catCounts);
    const data = Object.values(catCounts);
    const colors = labels.map(l => getCategoryColor(l) || '#94a3b8');
    return {
      labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      datasets: [{ data, backgroundColor: colors.map(c => c + '99'), borderColor: colors, borderWidth: 2, hoverOffset: 8 }],
    };
  }, [frequencyData]);

  const responseChartData = useMemo(() => {
    const times = analytics.responseTimes;
    if (times.length === 0) {
      return {
        labels: ['—'],
        datasets: [{ label: 'Response Time (ms)', data: [0], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', tension: 0.4, fill: true, pointRadius: 2, pointBackgroundColor: '#a855f7' }],
      };
    }
    return {
      labels: times.map((_, i) => `#${i + 1}`),
      datasets: [{ label: 'Response Time (ms)', data: times.map(t => parseFloat(t.toFixed(3))), borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', tension: 0.4, fill: true, pointRadius: 2, pointBackgroundColor: '#a855f7' }],
    };
  }, [analytics.responseTimes]);

  const commonOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title, color: '#f1f5f9', font: { family: "'Syne', sans-serif", size: 13 } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8', font: chartFont }, grid: { color: 'rgba(255,255,255,0.03)' } },
      y: { ticks: { color: '#94a3b8', font: chartFont }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  });

  const statCards = [
    { icon: Search, label: 'Total Searches', value: analytics.totalSearches, color: C.blue },
    { icon: Clock, label: 'Avg Response', value: avgResponse, color: C.cyan },
    { icon: Hash, label: 'Unique Terms', value: uniqueTerms, color: C.purple },
    { icon: FolderOpen, label: 'Top Category', value: topCategory, color: C.amber },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      style={S.page}
    >
      {/* Header */}
      <div style={S.pageHeader}>
        <div style={S.iconBadge(C.amber)}>
          <BarChart3 size={26} color={C.amber} />
        </div>
        <h1 style={S.pageTitle}>Analytics Dashboard</h1>
        <p style={S.pageSubtitle}>Real-time search analytics powered by HashMap</p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
      }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={S.statCard(card.color)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', justifyContent: 'center' }}>
                <Icon size={14} color={card.color} />
                <span style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{card.label}</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: card.color }}>
                {card.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div style={S.grid2}>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ ...S.card, marginBottom: 0 }}>
          <Bar data={barChartData} options={commonOptions('Top 10 Most Searched Keywords (HashMap)')} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ ...S.card, marginBottom: 0 }}>
          <Line data={lineChartData} options={commonOptions('Searches Per Session (Timeline)')} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ ...S.card, marginBottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>Search Distribution by Category</div>
          <div style={{ width: '100%', maxWidth: '280px' }}>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom', labels: { color: '#94a3b8', font: chartFont, padding: 12, usePointStyle: true } },
                },
                cutout: '60%',
              }}
            />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ ...S.card, marginBottom: 0 }}>
          <Line data={responseChartData} options={{
            ...commonOptions('Response Time Over Searches (ms)'),
            scales: {
              x: { ticks: { color: '#94a3b8', font: chartFont }, grid: { color: 'rgba(255,255,255,0.03)' } },
              y: { ticks: { color: '#94a3b8', font: chartFont, callback: (v) => `${v}ms` }, grid: { color: 'rgba(255,255,255,0.05)' } },
            },
          }} />
        </motion.div>
      </div>

      {/* HashMap Table */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={S.sectionTitle}>HashMap Frequency Table</span>
          <ComplexityBadge type="time" value="O(1) lookup" color="purple" />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#475569', fontWeight: 500 }}>Key</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: '#475569', fontWeight: 500, width: '80px' }}>Count</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#475569', fontWeight: 500 }}>Distribution</th>
              </tr>
            </thead>
            <tbody>
              {frequencyData.slice(0, 15).map((item, i) => {
                const maxVal = frequencyData[0]?.value || 1;
                const barWidth = (item.value / maxVal) * 100;
                return (
                  <tr key={item.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 12px', color: '#f1f5f9', fontWeight: 500 }}>{item.key}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', color: C.blue }}>{item.value}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ delay: 0.1 * i, duration: 0.5 }}
                          style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, rgba(79,142,247,0.8), rgba(0,212,170,0.6))' }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {frequencyData.length === 0 && (
            <p style={{ textAlign: 'center', color: '#475569', padding: '24px 0', fontSize: '13px' }}>
              Start searching on the Home or Autocomplete page to populate analytics data
            </p>
          )}
        </div>
      </motion.div>

      {/* HashMap Stats */}
      {hashMap?.current && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={S.card}>
          <div style={S.cardTitle}>HashMap Internal Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
            {(() => {
              const stats = hashMap.current.getStats();
              return [
                { label: 'Buckets', value: stats.totalBuckets, color: C.blue },
                { label: 'Filled', value: stats.filledBuckets, color: C.cyan },
                { label: 'Entries', value: stats.count, color: C.purple },
                { label: 'Collisions', value: stats.collisions, color: C.amber },
                { label: 'Max Chain', value: stats.maxChainLength, color: C.red },
                { label: 'Load Factor', value: stats.loadFactor, color: '#06b6d4' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center', padding: '12px', borderRadius: '12px', background: `${s.color}08`, border: `1px solid ${s.color}15` }}>
                  <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{s.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: s.color }}>{s.value}</div>
                </div>
              ));
            })()}
          </div>
        </motion.div>
      )}

      {/* About */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={S.infoBox}>
        <div style={S.cardTitle}><BookOpen size={14} /> 📚 About This Feature</div>
        <p style={S.cardText}>
          This dashboard tracks all search activity using a <strong style={{ color: C.white }}>custom HashMap</strong> with
          separate chaining collision resolution. The HashMap uses a djb2 hash function with a prime-sized bucket array (53 buckets)
          to minimize collisions while maintaining O(1) average lookup time.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <ComplexityBadge type="time" value="O(1) avg get/set" color="blue" />
          <ComplexityBadge type="space" value="O(N) storage" color="purple" />
        </div>
        <p style={{ ...S.muted, marginTop: '8px' }}>Real-world use: Frequency counters, caching, database indexing, load balancers</p>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
