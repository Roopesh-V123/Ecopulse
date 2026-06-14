import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityLog, UserProfile, CommunityChallenge, Badge, LeaderboardEntry, CategoryType } from '../types';
import { calculateLogEmissions } from '../utils/math';
import { stateRehydrationSchema } from '../utils/schemas';

interface EcoStore {
  users: UserProfile[];
  currentUser: UserProfile | null;
  logs: ActivityLog[];
  challenges: CommunityChallenge[];
  theme: 'dark' | 'light';
  leaderboard: LeaderboardEntry[];
  
  // Actions
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, targetDaily: number) => { success: boolean; error?: string };
  logout: () => void;
  addLog: (category: CategoryType, details: any, date: string) => void;
  deleteLog: (id: string) => void;
  joinChallenge: (id: string) => void;
  completeChallenge: (id: string) => void;
  updateTargetDaily: (target: number) => void;
  toggleTheme: () => void;
  resetData: () => void;
}

const DEFAULT_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'ch_1',
    title: 'Car-Free Commute',
    description: 'Use public transport, bike, or walk for all trips over 3 days.',
    category: 'transportation',
    xpReward: 150,
    joined: false,
    completed: false,
    progress: 0,
    targetDays: 3,
    currentDays: 0,
  },
  {
    id: 'ch_2',
    title: 'Veggie Week Kickstart',
    description: 'Log vegetarian or vegan meals for 5 consecutive days.',
    category: 'food',
    xpReward: 200,
    joined: false,
    completed: false,
    progress: 0,
    targetDays: 5,
    currentDays: 0,
  },
  {
    id: 'ch_3',
    title: 'Zero Waste Weekend',
    description: 'Recycle more than 5kg of waste and log zero electronic/clothing purchases.',
    category: 'shopping_waste',
    xpReward: 100,
    joined: false,
    completed: false,
    progress: 0,
    targetDays: 2,
    currentDays: 0,
  },
  {
    id: 'ch_4',
    title: 'Energy Outlaw',
    description: 'Keep home electricity usage under 5 kWh for two days.',
    category: 'energy',
    xpReward: 120,
    joined: false,
    completed: false,
    progress: 0,
    targetDays: 2,
    currentDays: 0,
  }
];

export const ALL_BADGES: Badge[] = [
  { id: 'b_commute', title: 'Eco Rider', description: 'Log a transport activity using public transit, walking, or biking.', iconName: 'Compass', xpReward: 50 },
  { id: 'b_diet', title: 'Green Gastronomy', description: 'Log a vegan or vegetarian diet meal.', iconName: 'Salad', xpReward: 50 },
  { id: 'b_energy', title: 'Power Saver', description: 'Log electricity details with zero AC hours.', iconName: 'Zap', xpReward: 50 },
  { id: 'b_waste', title: 'Recycle Royalty', description: 'Log recycling waste weight that exceeds non-recycled waste.', iconName: 'Trash2', xpReward: 50 },
  { id: 'b_streak_3', title: 'Consistently Conscious', description: 'Maintain a logging streak of 3 days.', iconName: 'Flame', xpReward: 100 },
  { id: 'b_low_carbon', title: 'Carbon Deflation', description: 'Log a day with total carbon footprint below 8.0 kg.', iconName: 'Leaf', xpReward: 150 },
];

// Seed profiles
const SEED_USERS: UserProfile[] = [
  {
    id: 'u_roopesh',
    name: 'V. Roopesh',
    email: 'roopesh@ecopulse.org',
    password: 'Password123',
    targetDaily: 12.0,
    xp: 40,
    level: 2,
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    badges: ['b_commute', 'b_streak_3'],
  },
  {
    id: 'u_sophia',
    name: 'Sophia Eco',
    email: 'sophia@ecopulse.org',
    password: 'Password123',
    targetDaily: 8.0,
    xp: 75,
    level: 4,
    streak: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    badges: ['b_commute', 'b_diet', 'b_low_carbon'],
  }
];

// Default leaderboard (dynamic list will sync dynamically from actual users!)
const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u_sophia', name: 'Sophia Eco', emissions: 5.2, level: 4, xp: 75 },
  { id: 'u_roopesh', name: 'V. Roopesh', emissions: 9.8, level: 2, xp: 40 },
  { id: 'u_liam', name: 'Liam Sterling', emissions: 7.1, level: 6, xp: 520 },
  { id: 'u_emma', name: 'Emma Vance', emissions: 8.8, level: 5, xp: 480 },
];

export const useEcoStore = create<EcoStore>()(
  persist(
    (set) => ({
      users: SEED_USERS,
      currentUser: null, // Starts unauthenticated
      logs: [],
      challenges: DEFAULT_CHALLENGES,
      theme: 'dark',
      leaderboard: INITIAL_LEADERBOARD,

      // Authentication logic
      login: (email, password) => {
        let result: { success: boolean; error?: string } = { success: false, error: 'User does not exist.' };
        set((state) => {
          const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (user) {
            if (user.password === password) {
              result = { success: true };
              return { currentUser: user };
            } else {
              result = { success: false, error: 'Incorrect password details.' };
            }
          }
          return {};
        });
        return result;
      },

      register: (name, email, password, targetDaily) => {
        let result: { success: boolean; error?: string } = { success: false, error: 'Email already registered.' };
        set((state) => {
          const emailExists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (emailExists) {
            return {};
          }

          const newUser: UserProfile = {
            id: 'u_' + Math.random().toString(36).substr(2, 9),
            name,
            email,
            password,
            targetDaily,
            xp: 0,
            level: 1,
            streak: 0,
            lastActiveDate: null,
            badges: []
          };

          result = { success: true };
          
          return {
            users: [...state.users, newUser],
            currentUser: newUser
          };
        });
        return result;
      },

      logout: () => {
        set({ currentUser: null });
      },

      addLog: (category, details, date) => {
        set((state) => {
          const user = state.currentUser;
          if (!user) return {};

          const id = 'log_' + Math.random().toString(36).substr(2, 9);
          const emissions = calculateLogEmissions(category, details);
          
          // Link log specifically to this user
          const newLog: ActivityLog = { id, userId: user.id, date, category, emissions, details };
          const updatedLogs = [newLog, ...state.logs];
          
          // --- STREAK & XP PROGRESSION CALCULATIONS FOR LOGGED IN USER ---
          let xpEarned = 20; // 20 XP per tracking entry
          let newStreak = user.streak;
          const todayStr = date;
          const lastActive = user.lastActiveDate;
          
          if (!lastActive) {
            newStreak = 1;
          } else {
            const lastDate = new Date(lastActive);
            const currentDate = new Date(todayStr);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak += 1;
              xpEarned += 10; // Bonus for consecutive days
            } else if (diffDays > 1) {
              newStreak = 1; // reset streak
            }
          }

          // Level calculation: 100 XP per level
          let newXp = user.xp + xpEarned;
          let newLevel = user.level;
          while (newXp >= 100) {
            newXp -= 100;
            newLevel += 1;
          }

          // --- BADGE UNLOCK CHECK SYSTEM ---
          const unlockedBadges = [...user.badges];
          
          if (!unlockedBadges.includes('b_commute') && category === 'transportation') {
            const vType = details.vehicleType;
            if (vType === 'bus' || vType === 'train' || vType === 'bike_walking') {
              unlockedBadges.push('b_commute');
              newXp += 50;
            }
          }
          
          if (!unlockedBadges.includes('b_diet') && category === 'food') {
            const diet = details.dietType;
            if (diet === 'vegan' || diet === 'vegetarian') {
              unlockedBadges.push('b_diet');
              newXp += 50;
            }
          }
          
          if (!unlockedBadges.includes('b_energy') && category === 'energy') {
            if (Number(details.acHours) === 0) {
              unlockedBadges.push('b_energy');
              newXp += 50;
            }
          }

          if (!unlockedBadges.includes('b_waste') && category === 'shopping_waste') {
            if (Number(details.recycledWeight) > Number(details.nonRecycledWeight)) {
              unlockedBadges.push('b_waste');
              newXp += 50;
            }
          }

          if (!unlockedBadges.includes('b_streak_3') && newStreak >= 3) {
            unlockedBadges.push('b_streak_3');
            newXp += 100;
          }

          if (!unlockedBadges.includes('b_low_carbon') && emissions < 8.0) {
            unlockedBadges.push('b_low_carbon');
            newXp += 150;
          }

          while (newXp >= 100) {
            newXp -= 100;
            newLevel += 1;
          }

          // Updated current user profile
          const updatedProfile = {
            ...user,
            xp: newXp,
            level: newLevel,
            streak: newStreak,
            lastActiveDate: todayStr,
            badges: unlockedBadges
          };

          // Synchronize profile inside users array database
          const updatedUsers = state.users.map(u => u.id === user.id ? updatedProfile : u);

          // Update active challenges progress
          const updatedChallenges = state.challenges.map(ch => {
            if (ch.joined && !ch.completed) {
              let increment = false;
              if (ch.category === category) {
                if (category === 'transportation' && (details.vehicleType === 'bus' || details.vehicleType === 'train' || details.vehicleType === 'bike_walking')) {
                  increment = true;
                }
                if (category === 'food' && (details.dietType === 'vegan' || details.dietType === 'vegetarian')) {
                  increment = true;
                }
                if (category === 'energy' && details.electricityKwh < 5) {
                  increment = true;
                }
                if (category === 'shopping_waste' && details.recycledWeight > 5 && details.clothingItems === 0 && details.electronicsCount === 0) {
                  increment = true;
                }
              }

              if (increment) {
                const nextDays = ch.currentDays + 1;
                const nextProgress = Math.min(Math.round((nextDays / ch.targetDays) * 100), 100);
                const isDone = nextDays >= ch.targetDays;
                
                if (isDone) {
                  let chalXp = updatedProfile.xp + ch.xpReward;
                  let chalLevel = updatedProfile.level;
                  while (chalXp >= 100) {
                    chalXp -= 100;
                    chalLevel += 1;
                  }
                  updatedProfile.xp = chalXp;
                  updatedProfile.level = chalLevel;
                }

                return {
                  ...ch,
                  currentDays: nextDays,
                  progress: nextProgress,
                  completed: isDone
                };
              }
            }
            return ch;
          });

          // Compute user average emissions from logs
          const userLogs = updatedLogs.filter(l => l.userId === user.id);
          const uniqueDays = Array.from(new Set(userLogs.map(l => l.date)));
          const userTotal = userLogs.reduce((acc, l) => acc + l.emissions, 0);
          const userAvg = uniqueDays.length > 0 ? Number((userTotal / uniqueDays.length).toFixed(1)) : 0;

          // Update Leaderboard dynamically
          let userFoundInLeaderboard = false;
          const updatedLeaderboard = state.leaderboard.map(entry => {
            if (entry.id === user.id) {
              userFoundInLeaderboard = true;
              return {
                ...entry,
                emissions: userAvg,
                level: newLevel,
                xp: newXp
              };
            }
            return entry;
          });

          if (!userFoundInLeaderboard) {
            updatedLeaderboard.push({
              id: user.id,
              name: user.name,
              emissions: userAvg,
              level: newLevel,
              xp: newXp
            });
          }

          return {
            logs: updatedLogs,
            currentUser: updatedProfile,
            users: updatedUsers,
            challenges: updatedChallenges,
            leaderboard: updatedLeaderboard.sort((a, b) => a.emissions - b.emissions)
          };
        });
      },

      deleteLog: (id) => {
        set((state) => {
          const user = state.currentUser;
          if (!user) return {};

          const updatedLogs = state.logs.filter((log) => log.id !== id);
          
          // Re-calculate user current day average on leaderboard
          const userLogs = updatedLogs.filter(l => l.userId === user.id);
          const uniqueDays = Array.from(new Set(userLogs.map(l => l.date)));
          const userTotal = userLogs.reduce((acc, l) => acc + l.emissions, 0);
          const userAvg = uniqueDays.length > 0 ? Number((userTotal / uniqueDays.length).toFixed(1)) : 0;

          const updatedLeaderboard = state.leaderboard.map(entry => {
            if (entry.id === user.id) {
              return {
                ...entry,
                emissions: userAvg,
              };
            }
            return entry;
          });

          return {
            logs: updatedLogs,
            leaderboard: updatedLeaderboard.sort((a, b) => a.emissions - b.emissions)
          };
        });
      },

      joinChallenge: (id) => {
        set((state) => ({
          challenges: state.challenges.map((ch) =>
            ch.id === id ? { ...ch, joined: true } : ch
          ),
        }));
      },

      completeChallenge: (id) => {
        set((state) => {
          const user = state.currentUser;
          if (!user) return {};

          const ch = state.challenges.find((c) => c.id === id);
          if (!ch || ch.completed) return {};

          let chalXp = user.xp + ch.xpReward;
          let chalLevel = user.level;
          while (chalXp >= 100) {
            chalXp -= 100;
            chalLevel += 1;
          }

          const updatedProfile = {
            ...user,
            xp: chalXp,
            level: chalLevel,
          };

          const updatedUsers = state.users.map(u => u.id === user.id ? updatedProfile : u);

          return {
            currentUser: updatedProfile,
            users: updatedUsers,
            challenges: state.challenges.map((c) =>
              c.id === id ? { ...c, completed: true, progress: 100 } : c
            ),
          };
        });
      },

      updateTargetDaily: (target) => {
        set((state) => {
          const user = state.currentUser;
          if (!user) return {};

          const updatedProfile = {
            ...user,
            targetDaily: target
          };

          const updatedUsers = state.users.map(u => u.id === user.id ? updatedProfile : u);

          return {
            currentUser: updatedProfile,
            users: updatedUsers
          };
        });
      },

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        }));
      },

      resetData: () => {
        set({
          users: SEED_USERS,
          currentUser: null,
          logs: [],
          challenges: DEFAULT_CHALLENGES,
          leaderboard: INITIAL_LEADERBOARD,
        });
      },
    }),
    {
      name: 'ecopulse_eco_store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          try {
            stateRehydrationSchema.parse(state);
          } catch (e) {
            console.warn('EcoPulse LocalStorage hydration schema check failed. Fallback resetting data.', e);
            state.resetData();
          }
        }
      }
    }
  )
);
