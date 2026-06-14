import * as z from 'zod';

// -----------------------------------------------------------------------------
// Authentication Schemas
// -----------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z.string().nonempty("Password is required")
});

export const registerSchema = z.object({
  name: z.string().nonempty("Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
  targetDaily: z.number().min(2, "Minimum carbon limit is 2 kg").max(100, "Maximum carbon limit is 100 kg")
});

// -----------------------------------------------------------------------------
// Carbon Logging Form Schemas
// -----------------------------------------------------------------------------
export const transportSchema = z.object({
  vehicleType: z.enum(['car_petrol', 'car_diesel', 'car_electric', 'bus', 'train', 'bike_walking']),
  distance: z.number().min(0, "Distance cannot be negative").max(1000, "Distance maximum is 1000 km per single log"),
  date: z.string().nonempty("Date is required")
});

export const foodSchema = z.object({
  dietType: z.enum(['meat_heavy', 'mixed', 'vegetarian', 'vegan']),
  servings: z.number().min(1, "Must log at least 1 serving").max(10, "Servings maximum is 10"),
  date: z.string().nonempty("Date is required")
});

export const energySchema = z.object({
  electricityKwh: z.number().min(0, "Electricity usage cannot be negative").max(200, "Maximum is 200 kWh per log"),
  acHours: z.number().min(0, "AC hours cannot be negative").max(24, "AC hours cannot exceed 24 hours in a day"),
  appliancesCount: z.number().min(0, "Appliances count cannot be negative").max(50, "Maximum limit of 50 active devices"),
  date: z.string().nonempty("Date is required")
});

export const wasteSchema = z.object({
  clothingItems: z.number().min(0, "Clothing items cannot be negative").max(20, "Maximum limit of 20 clothing items per log"),
  electronicsCount: z.number().min(0, "Electronics count cannot be negative").max(10, "Maximum limit of 10 electronic items per log"),
  recycledWeight: z.number().min(0, "Recycled weight cannot be negative").max(100, "Maximum limit of 100 kg"),
  nonRecycledWeight: z.number().min(0, "Non-recycled weight cannot be negative").max(100, "Maximum limit of 100 kg"),
  date: z.string().nonempty("Date is required")
});

// -----------------------------------------------------------------------------
// Local Storage Rehydration Security Validation Schemas
// -----------------------------------------------------------------------------
export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  targetDaily: z.number().min(2).max(100),
  xp: z.number().min(0),
  level: z.number().min(1),
  streak: z.number().min(0),
  lastActiveDate: z.string().nullable(),
  badges: z.array(z.string())
});

export const activityLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  category: z.enum(['transportation', 'food', 'energy', 'shopping_waste']),
  emissions: z.number(),
  details: z.any()
});

export const stateRehydrationSchema = z.object({
  users: z.array(userProfileSchema).optional(),
  currentUser: userProfileSchema.nullable().optional(),
  logs: z.array(activityLogSchema).optional(),
  theme: z.enum(['dark', 'light']).optional()
});
