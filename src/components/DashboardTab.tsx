import { useEcoStore } from '../store/useEcoStore';
import { Award, Flame, Leaf, HelpCircle, Activity } from 'lucide-react';

export default function DashboardTab() {
  const { logs, currentUser } = useEcoStore();

  const user = currentUser;
  if (!user) return null;

  // Filter logs for the active user only
  const userLogs = logs.filter(log => log.userId === user.id);

  // Get current date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Sum today's emissions
  const todayLogs = userLogs.filter(log => log.date === todayStr);
  const todayEmissions = Number(todayLogs.reduce((sum, log) => sum + log.emissions, 0).toFixed(2));
  
  // Target
  const target = user.targetDaily;
  
  // Percent of target
  const percentOfTarget = target > 0 ? Math.min(Math.round((todayEmissions / target) * 100), 200) : 0;
  
  // Global Average Benchmarks
  const GLOBAL_AVERAGE = 16.0; // kg CO2 per day per capita (USA/EU typical)
  const SUSTAINABLE_THRESHOLD = 5.0; // target sustainable daily limit (IPCC goal)

  // Determine Sustainability Tier based on average emissions
  // Calculate average daily emissions over all unique logged days, or fallback to today
  const uniqueDays = Array.from(new Set(userLogs.map(log => log.date)));
  const totalAllEmissions = userLogs.reduce((sum, log) => sum + log.emissions, 0);
  const averageEmissions = uniqueDays.length > 0 
    ? Number((totalAllEmissions / uniqueDays.length).toFixed(2))
    : todayEmissions;

  let tierName = "Bronze Consumer";
  let tierColor = "text-amber-700 bg-amber-500/10 border-amber-500/20";
  let tierDesc = "High carbon presence. Add logs to find reductions.";
  
  if (averageEmissions > 0 && averageEmissions < 6.0) {
    tierName = "Emerald Eco-Guardian";
    tierColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    tierDesc = "Superb! Your lifestyle matches sustainable planet limits.";
  } else if (averageEmissions >= 6.0 && averageEmissions < 10.0) {
    tierName = "Gold Leaf Defender";
    tierColor = "text-teal-400 bg-teal-500/10 border-teal-500/20";
    tierDesc = "Great carbon control! You are on track to a clean footprint.";
  } else if (averageEmissions >= 10.0 && averageEmissions < 15.0) {
    tierName = "Silver Seedling";
    tierColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
    tierDesc = "Moderate footprint. Try commuting with public transport.";
  }

  // Radial Gauge Calculations
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // If user emissions exceeds target, wrap circle but max out visual representation
  const strokeDashoffset = circumference - (Math.min(percentOfTarget, 100) / 100) * circumference;

  return (
    <div className="space-y-8 animate-fade-in" role="tabpanel" aria-label="Dashboard Panel">
      
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-brand-mint/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 w-36 h-36 rounded-full bg-brand-emerald/10 blur-2xl"></div>
        
        <div>
          <h2 className="font-display font-bold text-3xl tracking-tight text-text-main md:text-4xl">
            Welcome back, <span className="text-eco-gradient">{user.name}</span>!
          </h2>
          <p className="text-text-muted mt-2 max-w-xl">
            Track your carbon budget in real-time. Keep daily emissions below your <strong className="text-brand-emerald">{user.targetDaily} kg</strong> limit to earn XP points and level up!
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-3 glass-panel px-5 py-3 rounded-2xl">
            <Flame className="h-6 w-6 text-orange-500 fill-orange-500/20" />
            <div className="text-left">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">Active Streak</span>
              <span className="font-display font-extrabold text-text-main text-lg">{user.streak} Days</span>
            </div>
          </div>
          <div className="flex items-center gap-3 glass-panel px-5 py-3 rounded-2xl">
            <Award className="h-6 w-6 text-brand-emerald" />
            <div className="text-left">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block font-semibold">Player Level</span>
              <span className="font-display font-extrabold text-text-main text-lg">Lvl {user.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Analytics & Radial Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radial Carbon Progress Gauge */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center relative">
          <h3 className="font-display font-semibold text-lg text-text-main self-start mb-4">Daily Carbon Budget</h3>
          
          <div className="relative flex items-center justify-center my-4">
            {/* SVG Circle */}
            <svg className="w-52 h-52 transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="104"
                cy="104"
                r={radius}
                className="stroke-border-main"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="104"
                cy="104"
                r={radius}
                className="stroke-brand-emerald transition-all duration-1000 ease-out"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Gauge Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display font-black text-4xl text-text-main tracking-tight">
                {todayEmissions}
              </span>
              <span className="text-xs text-text-muted font-medium mt-1">kg CO₂ logged</span>
              <span className="mt-2 text-xs px-2.5 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald font-semibold">
                {percentOfTarget}% of Target
              </span>
            </div>
          </div>

          <p className="text-xs text-text-muted max-w-[240px] mt-2">
            Target budget is <strong className="text-text-main">{target} kg</strong>. Keep this ring from closing to maintain target limits.
          </p>
        </div>

        {/* Global Averages Comparison */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-semibold text-lg text-text-main">Global Benchmark Analytics</h3>
                <p className="text-xs text-text-muted mt-1">How your current footprint compares against sustainability standards.</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${tierColor}`}>
                {tierName}
              </span>
            </div>

            {/* Benchmarks Bars */}
            <div className="space-y-5 mt-6">
              
              {/* User Average */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-text-main">Your Logging Average</span>
                  <span className="font-bold text-brand-emerald">{averageEmissions} kg CO₂/day</span>
                </div>
                <div className="w-full bg-border-main rounded-full h-3.5 overflow-hidden relative">
                  <div 
                    className="bg-eco-gradient h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min((averageEmissions / GLOBAL_AVERAGE) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Sustainable Earth Limit */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-text-main">UN Climate Goal Target</span>
                  <span className="font-bold text-teal-500">{SUSTAINABLE_THRESHOLD} kg CO₂/day</span>
                </div>
                <div className="w-full bg-border-main rounded-full h-3.5 overflow-hidden">
                  <div 
                    className="bg-teal-500 h-full rounded-full" 
                    style={{ width: `${(SUSTAINABLE_THRESHOLD / GLOBAL_AVERAGE) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Developed Nation Average */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-text-main">Industrialized Nations Average</span>
                  <span className="font-bold text-red-500">{GLOBAL_AVERAGE} kg CO₂/day</span>
                </div>
                <div className="w-full bg-border-main rounded-full h-3.5 overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-brand-emerald/5 border border-brand-emerald/10 p-4 rounded-2xl text-xs text-left">
            <Activity className="h-8 w-8 text-brand-emerald shrink-0" />
            <div>
              <span className="font-semibold text-text-main block">Tier Insight: {tierName}</span>
              <span className="text-text-muted">{tierDesc}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Metrics Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl text-left glass-panel-hover">
          <div className="flex justify-between items-center text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Logged</span>
            <Activity className="h-4 w-4 text-brand-emerald" />
          </div>
          <p className="font-display font-extrabold text-2xl text-text-main mt-2">{todayLogs.length} entries</p>
          <span className="text-[10px] text-text-muted">Logged today</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl text-left glass-panel-hover">
          <div className="flex justify-between items-center text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Streak status</span>
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <p className="font-display font-extrabold text-2xl text-text-main mt-2">{user.streak} Days</p>
          <span className="text-[10px] text-text-muted">Consecutive logs</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl text-left glass-panel-hover">
          <div className="flex justify-between items-center text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Unlocks</span>
            <Award className="h-4 w-4 text-brand-mint" />
          </div>
          <p className="font-display font-extrabold text-2xl text-text-main mt-2">{user.badges.length} Badges</p>
          <span className="text-[10px] text-text-muted">Total achievements</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl text-left glass-panel-hover">
          <div className="flex justify-between items-center text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">All-Time logs</span>
            <Leaf className="h-4 w-4 text-brand-teal" />
          </div>
          <p className="font-display font-extrabold text-2xl text-text-main mt-2">{userLogs.length} Total</p>
          <span className="text-[10px] text-text-muted">User logged size</span>
        </div>

      </div>

      {/* Recent Activity List */}
      <div className="glass-panel rounded-3xl p-6 text-left">
        <h3 className="font-display font-semibold text-lg text-text-main mb-4">Today's Detailed Track Logs</h3>
        {todayLogs.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-text-muted/40 mx-auto mb-2" />
            <p className="text-sm text-text-muted">You haven't logged any activities today. Use the <strong>Track</strong> tab to record transportation, food, energy, or waste!</p>
          </div>
        ) : (
          <div className="divide-y divide-border-main">
            {todayLogs.map((log) => (
              <div key={log.id} className="py-4 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald font-semibold capitalize">
                    {log.category.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-main capitalize text-sm">{log.category.replace('_', ' ')}</h4>
                    <span className="text-xs text-text-muted">
                      {log.category === 'transportation' && `${(log.details as any).distance} km ride via ${(log.details as any).vehicleType.replace('_', ' ')}`}
                      {log.category === 'food' && `Diet entry: ${(log.details as any).dietType}`}
                      {log.category === 'energy' && `Energy: ${(log.details as any).electricityKwh} kWh, ${(log.details as any).acHours} AC hours`}
                      {log.category === 'shopping_waste' && `Shopping waste logged`}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-sm text-text-main block">+{log.emissions} kg CO₂</span>
                  <span className="text-[10px] text-text-muted">logged</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
