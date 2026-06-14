import React, { useState, useEffect } from 'react';
import { useEcoStore } from './store/useEcoStore';
import DashboardTab from './components/DashboardTab';
import TrackerTab from './components/TrackerTab';
import AnalyticsTab from './components/AnalyticsTab';
import CoachTab from './components/CoachTab';
import GamificationTab from './components/GamificationTab';
import AuthScreen from './components/AuthScreen';
import Footer from './components/Footer';
import { 
  LayoutDashboard, PlusCircle, BarChart3, Sparkles, Trophy, 
  Sun, Moon, Leaf, Settings2, RotateCcw, AlertTriangle, LogOut, User 
} from 'lucide-react';

export default function App() {
  const { theme, toggleTheme, currentUser, logout, updateTargetDaily, resetData } = useEcoStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'track' | 'analytics' | 'reduce' | 'gamify'>('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [targetInput, setTargetInput] = useState('');

  // Sync settings input value with active target when settings opens
  useEffect(() => {
    if (currentUser) {
      setTargetInput(currentUser.targetDaily.toString());
    }
  }, [currentUser, isSettingsOpen]);

  // Apply theme class to document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val > 0) {
      updateTargetDaily(val);
      setIsSettingsOpen(false);
    }
  };

  // SESSION GUARD - Redirect to Login if no active session
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-bg-main text-text-main transition-colors duration-300">
        <header className="w-full glass-panel border-b border-border-main px-4 py-4 md:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-eco-gradient flex items-center justify-center text-white shadow-md shadow-brand-emerald/20 animate-pulse">
                <Leaf className="h-5.5 w-5.5" />
              </div>
              <div className="text-left">
                <h1 className="font-display font-black text-xl tracking-tight text-text-main m-0 leading-none">EcoPulse</h1>
                <span className="text-[10px] text-text-muted font-medium tracking-wide">Your Climate Blueprint</span>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-border-main hover:border-brand-emerald text-text-muted hover:text-brand-emerald transition-all duration-200 cursor-pointer"
              aria-label="Toggle Dark Mode Theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-brand-mint" /> : <Moon className="h-4.5 w-4.5 text-brand-teal" />}
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <AuthScreen />
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-main text-text-main transition-colors duration-300">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-border-main px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-eco-gradient flex items-center justify-center text-white shadow-md shadow-brand-emerald/20">
              <Leaf className="h-5.5 w-5.5" />
            </div>
            <div className="text-left">
              <h1 className="font-display font-black text-xl tracking-tight text-text-main m-0 leading-none">
                EcoPulse
              </h1>
              <span className="text-[10px] text-text-muted font-medium tracking-wide">
                Your Climate Blueprint
              </span>
            </div>
          </div>

          {/* User Profile & Global Controls Bar */}
          <div className="flex items-center gap-3">
            
            {/* Active User session details */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border-main bg-border-main/20 text-xs font-medium">
              <User className="h-3.5 w-3.5 text-brand-emerald" />
              <span className="text-text-main">{currentUser.name}</span>
            </div>

            {/* Settings trigger */}
            <button
              onClick={() => setIsSettingsOpen(prev => !prev)}
              className="p-2.5 rounded-xl border border-border-main hover:border-brand-emerald text-text-muted hover:text-brand-emerald transition-all duration-200 cursor-pointer"
              aria-label="Settings and Carbon Limits"
            >
              <Settings2 className="h-4.5 w-4.5" />
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-border-main hover:border-brand-emerald text-text-muted hover:text-brand-emerald transition-all duration-200 cursor-pointer"
              aria-label="Toggle Dark Mode Theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-brand-mint" /> : <Moon className="h-4.5 w-4.5 text-brand-teal" />}
            </button>

            {/* Log Out */}
            <button
              onClick={logout}
              className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all duration-200 cursor-pointer"
              aria-label="Log Out Session"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
            
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 py-8 md:px-8 flex-1 flex flex-col md:flex-row gap-8 pb-24 md:pb-8">
        
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0" role="navigation" aria-label="Desktop Sidebar navigation">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 shadow-md shadow-brand-emerald/5'
                : 'text-text-muted hover:text-text-main border border-transparent hover:bg-brand-emerald/5'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'track'
                ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 shadow-md shadow-brand-emerald/5'
                : 'text-text-muted hover:text-text-main border border-transparent hover:bg-brand-emerald/5'
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Track Activities</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 shadow-md shadow-brand-emerald/5'
                : 'text-text-muted hover:text-text-main border border-transparent hover:bg-brand-emerald/5'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Analytics & Impact</span>
          </button>

          <button
            onClick={() => setActiveTab('reduce')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'reduce'
                ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 shadow-md shadow-brand-emerald/5'
                : 'text-text-muted hover:text-text-main border border-transparent hover:bg-brand-emerald/5'
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>AI Coach Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('gamify')}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeTab === 'gamify'
                ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 shadow-md shadow-brand-emerald/5'
                : 'text-text-muted hover:text-text-main border border-transparent hover:bg-brand-emerald/5'
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span>Gamification & Streaks</span>
          </button>
        </aside>

        {/* Tab Content rendering area */}
        <main className="flex-1 min-w-0" role="main">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'track' && <TrackerTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'reduce' && <CoachTab />}
          {activeTab === 'gamify' && <GamificationTab />}
        </main>
      </div>

      {/* Sticky Bottom Navigation Bar (Mobile viewport sizes) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-panel border-t border-border-main px-2 py-3 flex justify-around items-center" 
        role="navigation" 
        aria-label="Mobile Bottom navigation bar"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center shrink-0 cursor-pointer ${
            activeTab === 'dashboard' ? 'text-brand-emerald' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center shrink-0 cursor-pointer ${
            activeTab === 'track' ? 'text-brand-emerald' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <PlusCircle className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Track</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center shrink-0 cursor-pointer ${
            activeTab === 'analytics' ? 'text-brand-emerald' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Impact</span>
        </button>

        <button
          onClick={() => setActiveTab('reduce')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center shrink-0 cursor-pointer ${
            activeTab === 'reduce' ? 'text-brand-emerald' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Coach</span>
        </button>

        <button
          onClick={() => setActiveTab('gamify')}
          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center shrink-0 cursor-pointer ${
            activeTab === 'gamify' ? 'text-brand-emerald' : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Trophy className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Rewards</span>
        </button>
      </nav>

      {/* Global Slide-Over Settings Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsSettingsOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-bg-card border-l border-border-main p-6 shadow-2xl flex flex-col justify-between h-full animate-slide-in animate-duration-200">
            <div className="space-y-6 text-left">
              <div>
                <h3 className="font-display font-bold text-xl text-text-main">Eco Settings</h3>
                <p className="text-xs text-text-muted mt-1">Configure carbon score parameters and adjust system variables.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="dailyTargetSetting">
                    Daily CO₂ Target Limit (kg)
                  </label>
                  <input
                    id="dailyTargetSetting"
                    type="number"
                    step="any"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-main border border-border-main text-text-main text-sm"
                  />
                  <span className="text-[10px] text-text-muted block">
                    Default target is 12 kg CO₂. Safe planet thresholds are around 5 kg.
                  </span>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-eco-gradient text-white text-sm font-semibold rounded-xl py-3 cursor-pointer hover:shadow-md hover:shadow-brand-emerald/20 transition-all"
                >
                  Save Configuration
                </button>
              </form>

              {/* Advanced Dev resets */}
              <div className="pt-6 border-t border-border-main space-y-4">
                <div className="flex gap-2 text-xs bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 text-amber-500">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <div>
                    <span className="font-bold block">Developer Actions</span>
                    <span>Resetting data will completely wipe logs, streak metrics, level status, and badge history.</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to restore default application data?")) {
                      resetData();
                      setIsSettingsOpen(false);
                    }
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-xl py-3 cursor-pointer transition-all"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Application Data
                </button>
              </div>

            </div>

            <div className="text-center text-[10px] text-text-muted pt-6 border-t border-border-main">
              <span>Built by V. Roopesh | ID: 252U1R1249</span>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer component */}
      <Footer />
    </div>
  );
}
