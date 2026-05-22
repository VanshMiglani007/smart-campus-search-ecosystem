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

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Filler, Title, Tooltip, Legend
);

const chartFont = { family: "'JetBrains Mono', monospace", size: 10 };

const AnalyticsDashboard = () => {
  const { analytics, frequencyData, hashMap } = useSearch();

  // ── Dashboard cards data ──
  const avgResponse = useMemo(() => {
    if (analytics.responseTimes.length === 0) return '—';
    const avg = analytics.responseTimes.reduce((a, b) => a + b, 0) / analytics.responseTimes.length;
    return `${avg.toFixed(2)}ms`;
  }, [analytics.responseTimes]);

  const uniqueTerms = useMemo(() => {
    return hashMap?.current ? hashMap.current.getCount() : 0;
  }, [hashMap, analytics.totalSearches]);

  const topCategory = useMemo(() => {
    if (frequencyData.length === 0) return '—';
    return frequencyData[0]?.key?.split(' ').pop() || '—';
  }, [frequencyData]);

  // ── Bar Chart: Top 10 most searched keywords ──
  const barChartData = useMemo(() => ({
    labels: frequencyData.slice(0, 10).map(d => d.key.length > 15 ? d.key.slice(0, 15) + '…' : d.key),
    datasets: [{
      label: 'Search Count',
      data: frequencyData.slice(0, 10).map(d => d.value),
      backgroundColor: frequencyData.slice(0, 10).map((_, i) =>
        `rgba(79, 142, 247, ${0.9 - i * 0.06})`
      ),
      borderColor: 'rgba(79, 142, 247, 1)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  }), [frequencyData]);

  // ── Line Chart: Searches per session timeline ──
  const lineChartData = useMemo(() => {
    const timeline = analytics.searchTimeline;
    if (timeline.length === 0) {
      return {
        labels: ['Start'],
        datasets: [{
          label: 'Total Searches',
          data: [0],
          borderColor: '#00d4aa',
          backgroundColor: 'rgba(0, 212, 170, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: '#00d4aa',
        }],
      };
    }
    const labels = timeline.map((_, i) => `#${i + 1}`);
    return {
      labels,
      datasets: [{
        label: 'Total Searches',
        data: timeline.map(t => t.count),
        borderColor: '#00d4aa',
        backgroundColor: 'rgba(0, 212, 170, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#00d4aa',
      }],
    };
  }, [analytics.searchTimeline]);

  // ── Doughnut Chart: Category distribution ──
  const doughnutData = useMemo(() => {
    const catCounts = {};
    for (const item of frequencyData) {
      // Try to guess category from the word
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
      datasets: [{
        data,
        backgroundColor: colors.map(c => c + '99'),
        borderColor: colors,
        borderWidth: 2,
        hoverOffset: 8,
      }],
    };
  }, [frequencyData]);

  // ── Area Chart: Response time over searches ──
  const responseChartData = useMemo(() => {
    const times = analytics.responseTimes;
    if (times.length === 0) {
      return {
        labels: ['—'],
        datasets: [{
          label: 'Response Time (ms)',
          data: [0],
          borderColor: '#a855f7',
          backgroundColor: 'rgba(168, 85, 247, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 2,
          pointBackgroundColor: '#a855f7',
        }],
      };
    }
    return {
      labels: times.map((_, i) => `#${i + 1}`),
      datasets: [{
        label: 'Response Time (ms)',
        data: times.map(t => parseFloat(t.toFixed(3))),
        borderColor: '#a855f7',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointBackgroundColor: '#a855f7',
      }],
    };
  }, [analytics.responseTimes]);

  const commonOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true, text: title,
        color: '#f1f5f9',
        font: { family: "'Space Grotesk', sans-serif", size: 13 },
      },
    },
    scales: {
      x: { ticks: { color: '#94a3b8', font: chartFont }, grid: { color: 'rgba(255,255,255,0.03)' } },
      y: { ticks: { color: '#94a3b8', font: chartFont }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={28} className="text-warning" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
          <p className="text-text-secondary text-sm">Real-time search analytics powered by HashMap</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { icon: Search, label: 'Total Searches', value: analytics.totalSearches, color: '#4f8ef7' },
            { icon: Clock, label: 'Avg Response', value: avgResponse, color: '#00d4aa' },
            { icon: Hash, label: 'Unique Terms', value: uniqueTerms, color: '#a855f7' },
            { icon: FolderOpen, label: 'Top Category', value: topCategory, color: '#f59e0b' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: card.color }} />
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">{card.label}</span>
                </div>
                <div className="text-2xl font-bold font-mono" style={{ color: card.color }}>
                  {card.value}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5"
          >
            <Bar data={barChartData} options={commonOptions('Top 10 Most Searched Keywords (HashMap)')} />
          </motion.div>

          {/* Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <Line data={lineChartData} options={commonOptions('Searches Per Session (Timeline)')} />
          </motion.div>

          {/* Doughnut Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 flex flex-col items-center"
          >
            <h3 className="text-sm font-medium text-text-primary mb-3">Search Distribution by Category</h3>
            <div className="w-full max-w-[280px]">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#94a3b8', font: chartFont, padding: 12, usePointStyle: true },
                    },
                  },
                  cutout: '60%',
                }}
              />
            </div>
          </motion.div>

          {/* Response Time Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5"
          >
            <Line data={responseChartData} options={{
              ...commonOptions('Response Time Over Searches (ms)'),
              scales: {
                ...commonOptions('').scales,
                y: {
                  ...commonOptions('').scales.y,
                  ticks: {
                    ...commonOptions('').scales.y.ticks,
                    callback: (v) => `${v}ms`,
                  },
                },
              },
            }} />
          </motion.div>
        </div>

        {/* HashMap Visualization Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 mb-6"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            HashMap Frequency Table
            <ComplexityBadge type="time" value="O(1) lookup" color="purple" />
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-text-muted font-medium">Key</th>
                  <th className="text-right py-2 px-3 text-text-muted font-medium w-20">Count</th>
                  <th className="text-left py-2 px-3 text-text-muted font-medium">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {frequencyData.slice(0, 15).map((item, i) => {
                  const maxVal = frequencyData[0]?.value || 1;
                  const barWidth = (item.value / maxVal) * 100;
                  return (
                    <tr key={item.key} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-2 px-3 text-text-primary font-medium">{item.key}</td>
                      <td className="py-2 px-3 text-right font-mono text-accent-blue">{item.value}</td>
                      <td className="py-2 px-3">
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ delay: 0.1 * i, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, rgba(79,142,247,0.8), rgba(0,212,170,0.6))`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {frequencyData.length === 0 && (
            <p className="text-center text-text-muted py-6 text-xs">
              Start searching on the Home or Autocomplete page to populate analytics data
            </p>
          )}
        </motion.div>

        {/* HashMap Stats */}
        {hashMap?.current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-5 mb-6"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">HashMap Internal Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(() => {
                const stats = hashMap.current.getStats();
                return [
                  { label: 'Buckets', value: stats.totalBuckets, color: '#4f8ef7' },
                  { label: 'Filled', value: stats.filledBuckets, color: '#00d4aa' },
                  { label: 'Entries', value: stats.count, color: '#a855f7' },
                  { label: 'Collisions', value: stats.collisions, color: '#f59e0b' },
                  { label: 'Max Chain', value: stats.maxChainLength, color: '#ef4444' },
                  { label: 'Load Factor', value: stats.loadFactor, color: '#06b6d4' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-[10px] text-text-muted uppercase tracking-wider">{s.label}</div>
                    <div className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                  </div>
                ));
              })()}
            </div>
          </motion.div>
        )}

        {/* Viva Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-5 mb-16"
        >
          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <BookOpen size={14} />
            📚 About This Feature
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">
            This dashboard tracks all search activity using a <strong className="text-text-primary">custom HashMap</strong> with
            separate chaining collision resolution. The HashMap uses a djb2 hash function with a prime-sized bucket array (53 buckets)
            to minimize collisions while maintaining O(1) average lookup time.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <ComplexityBadge type="time" value="O(1) avg get/set" color="blue" />
            <ComplexityBadge type="space" value="O(N) storage" color="purple" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            Real-world use: Frequency counters, caching, database indexing, load balancers
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
