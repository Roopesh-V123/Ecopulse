import { useState, useMemo } from 'react';
import { useEcoStore } from '../store/useEcoStore';
import { Sparkles, MessageSquareCode, User } from 'lucide-react';
import type { CategoryType } from '../types';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function CoachTab() {
  const { logs, currentUser } = useEcoStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I am Aura, your AI Sustainability Coach. I have analyzed your carbon logs. Choose one of the prompts below or read your personalized tips to start optimizing your carbon budget!" }
  ]);

  const activeUser = currentUser;

  // Filter logs for this user session
  const userLogs = useMemo(() => {
    if (!activeUser) return [];
    return logs.filter(log => log.userId === activeUser.id);
  }, [logs, activeUser]);

  // Determine highest emission category
  const highestCategory = useMemo(() => {
    const categories: Record<CategoryType, number> = {
      transportation: 0,
      food: 0,
      energy: 0,
      shopping_waste: 0,
    };

    userLogs.forEach(log => {
      categories[log.category] += log.emissions;
    });

    let maxCat: CategoryType = 'transportation';
    let maxVal = -1;

    for (const cat in categories) {
      if (categories[cat as CategoryType] > maxVal) {
        maxVal = categories[cat as CategoryType];
        maxCat = cat as CategoryType;
      }
    }

    return maxVal > 0 ? maxCat : null;
  }, [userLogs]);

  // Dynamic recommendations based on highest category
  const tips = useMemo(() => {
    const allTips = {
      transportation: [
        { title: "Public Transit Shift", text: "Commuting by bus or train just twice a week instead of driving reduces travel carbon emissions by 40%.", savings: "120 kg CO₂ / yr" },
        { title: "Speed and Cruise Control", text: "Driving at 90 km/h instead of 110 km/h increases fuel efficiency by 15%. Soft braking also saves gas.", savings: "45 kg CO₂ / yr" },
        { title: "Tire Maintenance", text: "Keeping your tires properly inflated improves fuel economy by 3%. That equals 2 gallons of fuel saved monthly.", savings: "18 kg CO₂ / yr" }
      ],
      food: [
        { title: "Green Mondays", text: "Trading beef or lamb for beans or tofu just one day a week saves significant agricultural footprint.", savings: "98 kg CO₂ / yr" },
        { title: "Plant Milk Upgrades", text: "Dairy production generates 3x higher greenhouse gas emissions than almond, oat, or soy milks.", savings: "35 kg CO₂ / yr" },
        { title: "Food Waste Strategy", text: "Household food rot releases landfill methane. Purchase exactly what you need and compost peelings.", savings: "50 kg CO₂ / yr" }
      ],
      energy: [
        { title: "AC Optimization", text: "Setting your home air conditioner to 24°C instead of 18°C slashes appliance electricity load by up to 25%.", savings: "150 kg CO₂ / yr" },
        { title: "Banish Phantom Loads", text: "Unplug chargers, televisions, and game setups. Standby appliances represent 10% of electricity bills.", savings: "60 kg CO₂ / yr" },
        { title: "LED Bulb Retrofits", text: "ENERGY STAR certified LED lightbulbs use 75% less energy and last 25x longer than standard incandescent bulbs.", savings: "70 kg CO₂ / yr" }
      ],
      shopping_waste: [
        { title: "Extend Clothing Lifespans", text: "Double the duration you keep clothes before replacing them. Fast fashion produces enormous manufacturing carbon.", savings: "64 kg CO₂ / yr" },
        { title: "Electronic Repairs", text: "Fixing old phones/tablets instead of upgrading avoids carbon-heavy rare-earth mining and assembly lines.", savings: "110 kg CO₂ / yr" },
        { title: "Recycling Precision", text: "Recycle plastics, glass, and cardboards correctly. Every kg recycled saves fresh extraction emissions.", savings: "25 kg CO₂ / yr" }
      ],
      general: [
        { title: "Establish Logging Habit", text: "Log everyday activities under the Track tab to let AI build precise calculations.", savings: "Unlock Streak Badges" },
        { title: "Set Carbon Budget Limit", text: "Adjust your daily limit down in dashboard settings as you improve your score.", savings: "Earn Level Up XP" },
        { title: "Engage In Challenges", text: "Visit the Gamification page to join active community challenges and earn bonus XP.", savings: "Double XP reward" }
      ]
    };

    return highestCategory ? allTips[highestCategory] : allTips.general;
  }, [highestCategory]);

  const handleCannedQuestion = (question: string, answer: string) => {
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: question },
      { sender: 'ai', text: answer }
    ]);
  };

  const CANNED_QA = [
    {
      q: "How can I lower transport carbon?",
      a: "The most effective way is replacing single-passenger car commutes. If driving is required, maintenance (oil, clean air filters, properly inflated tires) combined with smooth speed habits can optimize mileage by 15-20%!"
    },
    {
      q: "What is the math behind recycling offsets?",
      a: "Recycling offsets represent the difference between extracting/processing virgin materials (like bauxite ore for aluminum) versus melting existing scrap. Aluminum recycling saves up to 95% of the manufacturing energy!"
    },
    {
      q: "Tell me about daily carbon score thresholds.",
      a: "The global average is 16 kg. To combat climate change, scientists target a safe threshold under 5 kg per day per person. Your dashboard gauge adjusts dynamically to guide you down toward this goal!"
    }
  ];

  if (!activeUser) return null;

  return (
    <div className="space-y-8 animate-fade-in" role="tabpanel" aria-label="AI Coach Panel">
      
      {/* Title */}
      <div className="text-left">
        <h2 className="font-display font-extrabold text-2xl text-text-main flex items-center gap-2">
          <Sparkles className="text-brand-emerald h-6 w-6" /> AI Sustainability Coach
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Aura automatically processes your logs to offer hyper-targeted advice and carbon saving hacks.
        </p>
      </div>

      {/* Highest Category Alert Indicator */}
      {highestCategory ? (
        <div className="glass-panel p-5 rounded-3xl border border-red-500/20 bg-red-500/5 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-400 block">High Footprint Category Detected</span>
            <span className="font-display font-bold text-text-main mt-1 block text-lg capitalize">
              {highestCategory.replace('_', ' ')} is driving your carbon score up
            </span>
            <span className="text-xs text-text-muted">Aura has customized your weekly targets to help you save emissions here.</span>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
            Action Recommended
          </span>
        </div>
      ) : (
        <div className="glass-panel p-5 rounded-3xl bg-brand-emerald/5 border border-brand-emerald/10 text-left">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-emerald block">No Alert Active</span>
          <span className="font-display font-bold text-text-main mt-1 block text-lg">
            Awaiting Data Log Entries
          </span>
          <span className="text-xs text-text-muted">Record transportation, diet, or home power metrics to unlock custom diagnostic alerts.</span>
        </div>
      )}

      {/* Actionable Eco-Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tips.map((tip, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-3xl text-left flex flex-col justify-between glass-panel-hover">
            <div>
              <span className="h-8 w-8 rounded-xl bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald text-xs font-bold font-display">
                0{idx + 1}
              </span>
              <h4 className="font-display font-bold text-text-main mt-4 text-base">{tip.title}</h4>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">{tip.text}</p>
            </div>
            
            <div className="mt-5 pt-3 border-t border-border-main flex justify-between items-center text-xs">
              <span className="text-text-muted">Est. Savings:</span>
              <span className="font-bold text-brand-emerald font-display">{tip.savings}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Conversational Console */}
      <div className="glass-panel rounded-3xl overflow-hidden flex flex-col border border-border-main">
        {/* Console Header */}
        <div className="px-6 py-4 bg-brand-emerald/5 border-b border-border-main flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-emerald flex items-center justify-center text-white text-xs font-bold">
              AI
            </div>
            <div className="text-left">
              <span className="font-semibold text-text-main text-sm block leading-none">Aura</span>
              <span className="text-[10px] text-text-muted">Active Platform Sustainability Expert</span>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Message Log */}
        <div className="p-6 h-80 overflow-y-auto space-y-4 flex flex-col text-left">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex gap-3 max-w-[80%] ${
                msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${
                msg.sender === 'user' ? 'bg-brand-indigo' : 'bg-brand-emerald'
              }`}>
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : 'AI'}
              </div>
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-brand-indigo/10 border border-brand-indigo/20 text-text-main rounded-tr-none' 
                  : 'bg-brand-emerald/5 border border-brand-emerald/10 text-text-main rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Canned Input Prompt Choices */}
        <div className="p-4 bg-brand-emerald/5 border-t border-border-main flex flex-wrap gap-2 text-xs">
          <span className="text-text-muted flex items-center gap-1 py-1 mr-1">
            <MessageSquareCode className="h-3.5 w-3.5" /> Ask Aura:
          </span>
          {CANNED_QA.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleCannedQuestion(item.q, item.a)}
              className="bg-bg-card border border-border-main hover:border-brand-emerald hover:text-brand-emerald transition-colors rounded-xl px-3 py-2 text-text-main font-medium cursor-pointer"
            >
              {item.q}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
