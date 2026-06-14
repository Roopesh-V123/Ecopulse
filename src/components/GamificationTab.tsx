import { useEcoStore, ALL_BADGES } from '../store/useEcoStore';
import * as Icons from 'lucide-react';
import { Trophy, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export default function GamificationTab() {
  const { currentUser, challenges, leaderboard, joinChallenge, completeChallenge } = useEcoStore();

  const user = currentUser;
  if (!user) return null;

  // Helper to render icon by name string
  const renderBadgeIcon = (name: string, isUnlocked: boolean) => {
    const IconComponent = (Icons as any)[name] || Award;
    return (
      <IconComponent 
        className={`h-6 w-6 transition-all duration-300 ${
          isUnlocked 
            ? 'text-brand-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
            : 'text-text-muted/40'
        }`} 
      />
    );
  };

  // Compile leaderboard list and map current user highlight by ID
  const sortedLeaderboard = [...leaderboard]
    .map(entry => ({
      ...entry,
      isCurrentUser: entry.id === user.id
    }))
    .sort((a, b) => a.emissions - b.emissions);

  const userRankIndex = sortedLeaderboard.findIndex(entry => entry.id === user.id);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-';

  return (
    <div className="space-y-8 animate-fade-in" role="tabpanel" aria-label="Gamification Panel">
      
      {/* Title */}
      <div className="text-left">
        <h2 className="font-display font-extrabold text-2xl text-text-main flex items-center gap-2">
          <Trophy className="text-brand-emerald h-6 w-6" /> Gamification & Community Challenges
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Complete tasks to earn XP points, collect achievement badges, and climb the global eco leaderboards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Level Progress and Leaderboard */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Level Progress */}
          <div className="glass-panel p-6 rounded-3xl text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-brand-emerald/10 blur-2xl"></div>
            
            <span className="text-[10px] font-extrabold uppercase text-text-muted tracking-wider">Leveling Status</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-display font-black text-4xl text-text-main">Level {user.level}</span>
              <span className="text-xs text-text-muted">({user.xp} / 100 XP)</span>
            </div>

            {/* Level Bar */}
            <div className="w-full bg-border-main rounded-full h-3 mt-4 overflow-hidden">
              <div 
                className="bg-eco-gradient h-full rounded-full transition-all duration-500" 
                style={{ width: `${user.xp}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-text-muted block mt-2 text-right">
              {100 - user.xp} XP to Level {user.level + 1}
            </span>
          </div>

          {/* Leaderboard Card */}
          <div className="glass-panel p-6 rounded-3xl text-left flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-base text-text-main">Global Leaderboard</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 font-semibold">
                  Daily Emissions Rank
                </span>
              </div>

              <div className="space-y-3">
                {sortedLeaderboard.map((entry, idx) => (
                  <div 
                    key={entry.id} 
                    className={`flex justify-between items-center p-2.5 rounded-xl border transition-all ${
                      entry.isCurrentUser 
                        ? 'bg-brand-emerald/10 border-brand-emerald/30 shadow-md shadow-brand-emerald/5' 
                        : 'bg-transparent border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-display font-extrabold text-xs text-text-muted w-4">
                        {idx + 1}
                      </span>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.isCurrentUser ? 'bg-brand-emerald text-white' : 'bg-border-main text-text-muted'
                      }`}>
                        {entry.name.charAt(0)}
                      </div>
                      <div>
                        <span className={`text-xs font-semibold block ${entry.isCurrentUser ? 'text-text-main font-bold font-bold' : 'text-text-muted'}`}>
                          {entry.name}
                        </span>
                        <span className="text-[9px] text-text-muted">Level {entry.level}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-display font-bold text-xs text-text-main block">
                        {entry.emissions} kg
                      </span>
                      <span className="text-[8px] text-text-muted">CO₂ emissions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border-main flex justify-between text-xs text-text-muted">
              <span>Your Current Rank:</span>
              <span className="font-bold text-brand-emerald font-display">Rank #{userRank} of {sortedLeaderboard.length}</span>
            </div>
          </div>

        </div>

        {/* Right Side: Badges and Challenges */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Achievement Badges */}
          <div className="glass-panel p-6 rounded-3xl text-left">
            <h3 className="font-display font-bold text-base text-text-main mb-4">Earned Achievement Badges</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ALL_BADGES.map(badge => {
                const isUnlocked = user.badges.includes(badge.id);
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between h-36 ${
                      isUnlocked 
                        ? 'bg-brand-emerald/5 border-brand-emerald/20 shadow-md shadow-brand-emerald/5' 
                        : 'bg-transparent border-border-main opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                        isUnlocked 
                          ? 'bg-brand-emerald/10 border-brand-emerald/20' 
                          : 'bg-border-main/5 border-border-main'
                      }`}>
                        {renderBadgeIcon(badge.iconName, isUnlocked)}
                      </div>
                      {isUnlocked && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-text-main tracking-tight block truncate">
                        {badge.title}
                      </h4>
                      <p className="text-[10px] text-text-muted leading-tight mt-1 line-clamp-2">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Community Challenges */}
          <div className="glass-panel p-6 rounded-3xl text-left">
            <h3 className="font-display font-bold text-base text-text-main mb-4">Active Community Challenges</h3>
            
            <div className="space-y-4">
              {challenges.map(ch => (
                <div key={ch.id} className="p-4 rounded-2xl border border-border-main bg-bg-card/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-text-main">{ch.title}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo font-semibold border border-brand-indigo/25">
                        +{ch.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{ch.description}</p>
                    
                    {ch.joined && (
                      <div className="space-y-1 pt-1.5 max-w-sm">
                        <div className="flex justify-between text-[10px] text-text-muted">
                          <span>Progress</span>
                          <span>{ch.progress}% ({ch.currentDays}/{ch.targetDays} logs)</span>
                        </div>
                        <div className="w-full bg-border-main rounded-full h-1.5 overflow-hidden">
                          <div className="bg-brand-indigo h-full" style={{ width: `${ch.progress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {!ch.joined ? (
                      <button
                        onClick={() => joinChallenge(ch.id)}
                        className="bg-brand-indigo hover:shadow-md hover:shadow-brand-indigo/25 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        Join Challenge <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : ch.completed ? (
                      <span className="flex items-center gap-1.5 text-xs text-brand-emerald font-semibold bg-brand-emerald/10 border border-brand-emerald/20 px-4.5 py-2.5 rounded-xl">
                        <CheckCircle2 className="h-4 w-4" /> Challenge Done
                      </span>
                    ) : (
                      <button
                        onClick={() => completeChallenge(ch.id)}
                        className="bg-brand-emerald hover:shadow-md hover:shadow-brand-emerald/25 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        Complete <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
