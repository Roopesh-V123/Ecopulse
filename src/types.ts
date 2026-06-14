export type CategoryType = 'transportation' | 'food' | 'energy' | 'shopping_waste';

export interface TransportDetails {
  vehicleType: 'car_petrol' | 'car_diesel' | 'car_electric' | 'bus' | 'train' | 'bike_walking';
  distance: number; // in km
}

export interface FoodDetails {
  dietType: 'meat_heavy' | 'mixed' | 'vegetarian' | 'vegan';
  servings?: number;
}

export interface EnergyDetails {
  electricityKwh: number;
  acHours: number;
  appliancesCount: number;
}

export interface ShoppingWasteDetails {
  clothingItems: number;
  electronicsCount: number;
  recycledWeight: number; // in kg
  nonRecycledWeight: number; // in kg
}

export interface ActivityLog {
  id: string;
  userId: string; // Map log to registered user
  date: string; // YYYY-MM-DD
  category: CategoryType;
  emissions: number; // in kg CO2
  details: TransportDetails | FoodDetails | EnergyDetails | ShoppingWasteDetails;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string; // Client-side check only
  targetDaily: number; // in kg CO2 (e.g. 10 kg)
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  badges: string[]; // List of badge IDs
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  emissions: number; // average daily emissions
  level: number;
  xp: number;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  unlockedAt?: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  category: CategoryType | 'general';
  xpReward: number;
  joined: boolean;
  completed: boolean;
  progress: number; // 0 to 100
  targetDays: number;
  currentDays: number;
}
