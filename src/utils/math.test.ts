import { describe, it, expect } from 'vitest';
import { 
  calculateTransportEmissions, 
  calculateFoodEmissions, 
  calculateEnergyEmissions, 
  calculateShoppingWasteEmissions,
  calculateLogEmissions
} from './math';

describe('Carbon Calculations Math Engine', () => {

  describe('Transportation Carbon Math', () => {
    it('should calculate petrol car emissions correctly', () => {
      // 0.18 kg CO2/km * 100 km = 18.0 kg CO2
      const result = calculateTransportEmissions({ vehicleType: 'car_petrol', distance: 100 });
      expect(result).toBe(18.0);
    });

    it('should calculate electric car emissions correctly', () => {
      // 0.05 kg CO2/km * 100 km = 5.0 kg CO2
      const result = calculateTransportEmissions({ vehicleType: 'car_electric', distance: 100 });
      expect(result).toBe(5.0);
    });

    it('should calculate biking and walking emissions as zero', () => {
      const result = calculateTransportEmissions({ vehicleType: 'bike_walking', distance: 50 });
      expect(result).toBe(0.0);
    });
  });

  describe('Diet Carbon Math', () => {
    it('should calculate vegan meal servings footprint correctly', () => {
      // 1.5 kg CO2 factor * 2 servings = 3.0 kg CO2
      const result = calculateFoodEmissions({ dietType: 'vegan', servings: 2 });
      expect(result).toBe(3.0);
    });

    it('should calculate meat-heavy meal servings footprint correctly', () => {
      // 3.3 kg CO2 factor * 1 serving = 3.3 kg CO2
      const result = calculateFoodEmissions({ dietType: 'meat_heavy', servings: 1 });
      expect(result).toBe(3.3);
    });
  });

  describe('Home Energy Carbon Math', () => {
    it('should calculate cumulative energy emissions from electricity, AC, and devices correctly', () => {
      // Electricity: 10 kWh * 0.85 = 8.5
      // AC: 2 hours * 1.5 = 3.0
      // Appliances: 4 devices * 0.5 = 2.0
      // Total: 13.5 kg CO2
      const result = calculateEnergyEmissions({ 
        electricityKwh: 10, 
        acHours: 2, 
        appliancesCount: 4 
      });
      expect(result).toBe(13.5);
    });
  });

  describe('Shopping & Waste Offsets Carbon Math', () => {
    it('should calculate emissions with clothing, electronics, and recycling offsets correctly', () => {
      // Clothing: 2 items * 8.0 = 16.0
      // Electronics: 0 items * 30.0 = 0.0
      // Recycled: 5 kg * -1.0 = -5.0
      // Non-Recycled: 2 kg * 1.2 = 2.4
      // Total: 13.4 kg CO2
      const result = calculateShoppingWasteEmissions({ 
        clothingItems: 2, 
        electronicsCount: 0, 
        recycledWeight: 5, 
        nonRecycledWeight: 2 
      });
      expect(result).toBe(13.4);
    });

    it('should offset emissions correctly when recycling is extremely high', () => {
      // Clothing: 0 items = 0.0
      // Electronics: 0 items = 0.0
      // Recycled: 10 kg * -1.0 = -10.0
      // Non-Recycled: 2 kg * 1.2 = 2.4
      // Total: -7.6 kg CO2 (offset savings)
      const result = calculateShoppingWasteEmissions({ 
        clothingItems: 0, 
        electronicsCount: 0, 
        recycledWeight: 10, 
        nonRecycledWeight: 2 
      });
      expect(result).toBe(-7.6);
    });
  });

  describe('Dispatcher Validation', () => {
    it('should route emissions calculations correctly based on category string dispatcher', () => {
      const transportResult = calculateLogEmissions('transportation', { vehicleType: 'car_diesel', distance: 50 });
      // 0.16 kg * 50 = 8.0
      expect(transportResult).toBe(8.0);

      const foodResult = calculateLogEmissions('food', { dietType: 'vegetarian', servings: 3 });
      // 1.7 kg * 3 = 5.1
      expect(foodResult).toBe(5.1);
    });
  });

});
