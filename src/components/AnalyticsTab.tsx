import { useMemo } from 'react';
import { useEcoStore } from '../store/useEcoStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TreePine, Wind, Droplet, Fuel, Calendar, Compass, BarChart3 } from 'lucide-react';

export default function AnalyticsTab() {
  const { logs, currentUser } = useEcoStore();

  const user = currentUser;

  // Filter logs for the active user session
  const userLogs = useMemo(() => {
    if (!user) return [];
    return logs.filter(l => l.userId === user.id);
  }, [logs, user]);

  // 1. Group logs by date to compute daily totals for trend chart
  const trendData = useMemo(() => {
    const grouped: Record<string, number> = {};
    const target = user?.targetDaily ?? 12.0;
    
    // Seed last 7 days with 0 to make sure chart looks filled even with few logs
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      grouped[dStr] = 0;
    }

    userLogs.forEach(log => {
      if (grouped[log.date] !== undefined) {
        grouped[log.date] = Number((grouped[log.date] + log.emissions).toFixed(2));
      } else {
        grouped[log.date] = Number(log.emissions.toFixed(2));
      }
    });

    return Object.keys(grouped).map(date => ({
      date: date.substring(5), // Shorten date format (MM-DD)
      emissions: grouped[date],
      target: target
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [userLogs, user]);

  // 2. Compute emissions by category
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {
      transportation: 0,
      food: 0,
      energy: 0,
      shopping_waste: 0,
    };

    userLogs.forEach(log => {
      if (categories[log.category] !== undefined) {
        categories[log.category] += log.emissions;
      }
    });

    return [
      { name: 'Transportation', value: Number(categories.transportation.toFixed(2)), color: '#10b981' },
      { name: 'Food & Diet', value: Number(categories.food.toFixed(2)), color: '#34d399' },
      { name: 'Home Energy', value: Number(categories.energy.toFixed(2)), color: '#0d9488' },
      { name: 'Shopping & Waste', value: Number(categories.shopping_waste.toFixed(2)), color: '#6366f1' },
    ].filter(item => item.value > 0);
  }, [userLogs]);

  // 3. Compute Savings & Equivalencies
  const stats = useMemo(() => {
    const INDUSTRIAL_BENCHMARK = 16.0;
    const uniqueDays = Array.from(new Set(userLogs.map(log => log.date)));
    const totalDaysCount = Math.max(uniqueDays.length, 1);
    
    // Total emissions logged
    const totalEmissions = userLogs.reduce((sum, log) => sum + log.emissions, 0);
    
    // Benchmark emissions for the same duration
    const benchmarkEmissions = totalDaysCount * INDUSTRIAL_BENCHMARK;
    
    // Net CO2 saved
    const co2Saved = Math.max(0, Number((benchmarkEmissions - totalEmissions).toFixed(1)));
    
    const treesSaved = Number((co2Saved / 10).toFixed(1));
    const waterSaved = Number((co2Saved * 5.0).toFixed(0));
    const fuelSaved = Number((co2Saved / 8.9).toFixed(1));

    return {
      totalEmissions: Number(totalEmissions.toFixed(1)),
      co2Saved,
      treesSaved,
      waterSaved,
      fuelSaved,
      average: totalDaysCount > 0 ? Number((totalEmissions / totalDaysCount).toFixed(1)) : 0
    };
  }, [userLogs]);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in" role="tabpanel" aria-label="Analytics Panel">
      
      {/* Title */}
      <div className="text-left">
        <h2 className="font-display font-extrabold text-2xl text-text-main flex items-center gap-2">
          <BarChart3 className="text-brand-emerald h-6 w-6" /> Analytics & Impact Visualization
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Detailed breakdowns of your ecological footprints and calculation equivalents.
        </p>
      </div>

      {/* Impact Equivalent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* CO2 Saved */}
        <div className="glass-panel p-6 rounded-3xl text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-brand-mint/10 blur-xl group-hover:bg-brand-mint/20 transition-all duration-300"></div>
          <div className="h-12 w-12 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
            <Wind className="h-6 w-6" />
          </div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block mt-4">Net CO₂ Reduced</span>
          <p className="font-display font-black text-3xl text-text-main mt-1">{stats.co2Saved} kg</p>
          <span className="text-xs text-text-muted mt-2 block">Saved vs. national averages</span>
        </div>

        {/* Trees Saved */}
        <div className="glass-panel p-6 rounded-3xl text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/20 transition-all duration-300"></div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <TreePine className="h-6 w-6" />
          </div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block mt-4">Equivalent Trees</span>
          <p className="font-display font-black text-3xl text-text-main mt-1">🌳 {stats.treesSaved}</p>
          <span className="text-xs text-text-muted mt-2 block">Absorbed tree carbon equivalents</span>
        </div>

        {/* Water Conserved */}
        <div className="glass-panel p-6 rounded-3xl text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-teal-500/10 blur-xl group-hover:bg-teal-500/20 transition-all duration-300"></div>
          <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500">
            <Droplet className="h-6 w-6" />
          </div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block mt-4">Water Saved</span>
          <p className="font-display font-black text-3xl text-text-main mt-1">💧 {stats.waterSaved} gal</p>
          <span className="text-xs text-text-muted mt-2 block">Offset power water usage</span>
        </div>

        {/* Fuel Saved */}
        <div className="glass-panel p-6 rounded-3xl text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all duration-300"></div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-brand-indigo">
            <Fuel className="h-6 w-6" />
          </div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold block mt-4">Fuel Conserved</span>
          <p className="font-display font-black text-3xl text-text-main mt-1">⛽ {stats.fuelSaved} gal</p>
          <span className="text-xs text-text-muted mt-2 block">Unburned gasoline equivalent</span>
        </div>

      </div>

      {/* Recharts Displays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend line Chart */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg text-text-main text-left flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-emerald" /> 7-Day Carbon Emission Trend
            </h3>
            <p className="text-xs text-text-muted text-left mt-1">Visualize how daily logged metrics align with target carbon goals.</p>
          </div>

          <div className="h-72 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-main)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border-main)', 
                    borderRadius: '16px',
                    fontSize: '12px' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorEmissions)" 
                  name="Emissions (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-lg text-text-main text-left flex items-center gap-2">
              <Compass className="h-5 w-5 text-brand-emerald" /> Category Share
            </h3>
            <p className="text-xs text-text-muted text-left mt-1">Proportional split of emissions over all lifetime logs.</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center mt-4">
            {categoryData.length === 0 ? (
              <p className="text-sm text-text-muted">No data logs yet. Log actions to populate breakdown.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: 'var(--bg-card)', 
                      border: '1px solid var(--border-main)', 
                      borderRadius: '16px',
                      fontSize: '11px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 space-y-1 text-left">
            {categoryData.map((entry, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-text-main">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  {entry.name}
                </span>
                <span className="font-bold text-text-main">{entry.value} kg CO₂</span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
