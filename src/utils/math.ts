import type { TransportDetails, FoodDetails, EnergyDetails, ShoppingWasteDetails, CategoryType } from '../types';

// Emission factors in kg CO2
export const TRANSPORT_FACTORS = {
  car_petrol: 0.18,
  car_diesel: 0.16,
  car_electric: 0.05,
  bus: 0.08,
  train: 0.04,
  bike_walking: 0.00,
};

export const FOOD_FACTORS = {
  meat_heavy: 3.3,
  mixed: 2.5,
  vegetarian: 1.7,
  vegan: 1.5,
};

export const ENERGY_FACTORS = {
  electricity_kwh: 0.85,
  ac_hour: 1.5,
  appliance_unit: 0.5,
};

export const WASTE_FACTORS = {
  clothing_item: 8.0,
  electronics_item: 30.0,
  recycled_kg: -1.0,     // negative factor acts as offset/saving points
  non_recycled_kg: 1.2,
};

/**
 * Calculates emissions for transportation in kg CO2
 */
export function calculateTransportEmissions(details: TransportDetails): number {
  const factor = TRANSPORT_FACTORS[details.vehicleType] ?? 0;
  return Number((details.distance * factor).toFixed(2));
}

/**
 * Calculates emissions for food consumption in kg CO2
 */
export function calculateFoodEmissions(details: FoodDetails): number {
  const factor = FOOD_FACTORS[details.dietType] ?? 0;
  const servings = details.servings ?? 1;
  return Number((factor * servings).toFixed(2));
}

/**
 * Calculates emissions for energy usage in kg CO2
 */
export function calculateEnergyEmissions(details: EnergyDetails): number {
  const elec = details.electricityKwh * ENERGY_FACTORS.electricity_kwh;
  const ac = details.acHours * ENERGY_FACTORS.ac_hour;
  const appliances = details.appliancesCount * ENERGY_FACTORS.appliance_unit;
  return Number((elec + ac + appliances).toFixed(2));
}

/**
 * Calculates emissions for shopping and waste in kg CO2
 */
export function calculateShoppingWasteEmissions(details: ShoppingWasteDetails): number {
  const clothing = details.clothingItems * WASTE_FACTORS.clothing_item;
  const electronics = details.electronicsCount * WASTE_FACTORS.electronics_item;
  const recycled = details.recycledWeight * WASTE_FACTORS.recycled_kg;
  const nonRecycled = details.nonRecycledWeight * WASTE_FACTORS.non_recycled_kg;
  
  // Total can be slightly negative if recycling is extremely high, but we cap lower bound for reasonable logs.
  // We allow negative logs to represent clean offsets if preferred, but for carbon tracking we let it stand.
  return Number((clothing + electronics + recycled + nonRecycled).toFixed(2));
}

/**
 * Calculate total emissions for any activity log
 */
export function calculateLogEmissions(category: CategoryType, details: any): number {
  switch (category) {
    case 'transportation':
      return calculateTransportEmissions(details as TransportDetails);
    case 'food':
      return calculateFoodEmissions(details as FoodDetails);
    case 'energy':
      return calculateEnergyEmissions(details as EnergyDetails);
    case 'shopping_waste':
      return calculateShoppingWasteEmissions(details as ShoppingWasteDetails);
    default:
      return 0;
  }
}

// ==========================================
// INLINE UNIT TESTS (console.assert)
// ==========================================
export function runMathAssertions() {
  console.log('--- RUNNING CARBON MATH ASSERTIONS ---');
  
  // Test Transport calculations
  const transportTest1 = calculateTransportEmissions({ vehicleType: 'car_petrol', distance: 100 });
  console.assert(transportTest1 === 18.0, `Expected 18.0 kg CO2 for 100km car travel, got ${transportTest1}`);

  const transportTest2 = calculateTransportEmissions({ vehicleType: 'bike_walking', distance: 50 });
  console.assert(transportTest2 === 0.0, `Expected 0.0 kg CO2 for biking, got ${transportTest2}`);

  // Test Food calculations
  const foodTest1 = calculateFoodEmissions({ dietType: 'vegan', servings: 2 });
  console.assert(foodTest1 === 3.0, `Expected 3.0 kg CO2 for 2 vegan servings, got ${foodTest1}`);

  const foodTest2 = calculateFoodEmissions({ dietType: 'meat_heavy', servings: 1 });
  console.assert(foodTest2 === 3.3, `Expected 3.3 kg CO2 for 1 meat servings, got ${foodTest2}`);

  // Test Energy calculations
  const energyTest1 = calculateEnergyEmissions({ electricityKwh: 10, acHours: 2, appliancesCount: 4 });
  // (10 * 0.85) + (2 * 1.5) + (4 * 0.5) = 8.5 + 3.0 + 2.0 = 13.5
  console.assert(energyTest1 === 13.5, `Expected 13.5 kg CO2 for energy usage, got ${energyTest1}`);

  // Test Shopping & Waste calculations
  const wasteTest1 = calculateShoppingWasteEmissions({ clothingItems: 2, electronicsCount: 0, recycledWeight: 5, nonRecycledWeight: 2 });
  // (2 * 8.0) + (0) + (5 * -1.0) + (2 * 1.2) = 16.0 - 5.0 + 2.4 = 13.4
  console.assert(wasteTest1 === 13.4, `Expected 13.4 kg CO2 for waste, got ${wasteTest1}`);

  console.log('--- ALL CARBON MATH ASSERTIONS COMPLETED ---');
}

// Run immediately on import in client environment
try {
  runMathAssertions();
} catch (error) {
  console.error('Math assertions failed to run:', error);
}
