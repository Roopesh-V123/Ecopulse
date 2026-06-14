import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import type { UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEcoStore } from '../store/useEcoStore';
import { 
  transportSchema, foodSchema, energySchema, wasteSchema 
} from '../utils/schemas';
import type { CategoryType } from '../types';

// XSS input sanitization utility helper
function sanitizeInput<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data };
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key]
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;") as any;
    }
  }
  return sanitized;
}

type TransportFormValues = z.infer<typeof transportSchema>;
type FoodFormValues = z.infer<typeof foodSchema>;
type EnergyFormValues = z.infer<typeof energySchema>;
type WasteFormValues = z.infer<typeof wasteSchema>;

interface UseCarbonFormReturn {
  activeSubTab: CategoryType;
  setActiveSubTab: (tab: CategoryType) => void;
  successMsg: string | null;
  setSuccessMsg: (msg: string | null) => void;
  transportForm: UseFormReturn<TransportFormValues>;
  foodForm: UseFormReturn<FoodFormValues>;
  energyForm: UseFormReturn<EnergyFormValues>;
  wasteForm: UseFormReturn<WasteFormValues>;
  onTransportSubmit: (data: TransportFormValues) => void;
  onFoodSubmit: (data: FoodFormValues) => void;
  onEnergySubmit: (data: EnergyFormValues) => void;
  onWasteSubmit: (data: WasteFormValues) => void;
}

export function useCarbonForm(): UseCarbonFormReturn {
  const { addLog } = useEcoStore();
  const [activeSubTab, setActiveSubTab] = useState<CategoryType>('transportation');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Forms setup
  const transportForm = useForm<TransportFormValues>({
    resolver: zodResolver(transportSchema),
    defaultValues: { vehicleType: 'car_petrol', distance: 10, date: todayStr }
  });

  const foodForm = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema),
    defaultValues: { dietType: 'mixed', servings: 1, date: todayStr }
  });

  const energyForm = useForm<EnergyFormValues>({
    resolver: zodResolver(energySchema),
    defaultValues: { electricityKwh: 5, acHours: 0, appliancesCount: 5, date: todayStr }
  });

  const wasteForm = useForm<WasteFormValues>({
    resolver: zodResolver(wasteSchema),
    defaultValues: { clothingItems: 0, electronicsCount: 0, recycledWeight: 1, nonRecycledWeight: 1, date: todayStr }
  });

  const triggerSuccess = useCallback((msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  }, []);

  // Submit handlers
  const onTransportSubmit = useCallback((data: TransportFormValues) => {
    const cleanData = sanitizeInput(data);
    addLog('transportation', { vehicleType: cleanData.vehicleType, distance: cleanData.distance }, cleanData.date);
    triggerSuccess("Transportation activity logged successfully! +20 XP earned.");
    transportForm.reset({ vehicleType: 'car_petrol', distance: 10, date: todayStr });
  }, [addLog, transportForm, todayStr, triggerSuccess]);

  const onFoodSubmit = useCallback((data: FoodFormValues) => {
    const cleanData = sanitizeInput(data);
    addLog('food', { dietType: cleanData.dietType, servings: cleanData.servings }, cleanData.date);
    triggerSuccess("Food consumption logged successfully! +20 XP earned.");
    foodForm.reset({ dietType: 'mixed', servings: 1, date: todayStr });
  }, [addLog, foodForm, todayStr, triggerSuccess]);

  const onEnergySubmit = useCallback((data: EnergyFormValues) => {
    const cleanData = sanitizeInput(data);
    addLog('energy', { 
      electricityKwh: cleanData.electricityKwh, 
      acHours: cleanData.acHours, 
      appliancesCount: cleanData.appliancesCount 
    }, cleanData.date);
    triggerSuccess("Energy usage logged successfully! +20 XP earned.");
    energyForm.reset({ electricityKwh: 5, acHours: 0, appliancesCount: 5, date: todayStr });
  }, [addLog, energyForm, todayStr, triggerSuccess]);

  const onWasteSubmit = useCallback((data: WasteFormValues) => {
    const cleanData = sanitizeInput(data);
    addLog('shopping_waste', {
      clothingItems: cleanData.clothingItems,
      electronicsCount: cleanData.electronicsCount,
      recycledWeight: cleanData.recycledWeight,
      nonRecycledWeight: cleanData.nonRecycledWeight
    }, cleanData.date);
    triggerSuccess("Shopping & waste logged successfully! +20 XP earned.");
    wasteForm.reset({ clothingItems: 0, electronicsCount: 0, recycledWeight: 1, nonRecycledWeight: 1, date: todayStr });
  }, [addLog, wasteForm, todayStr, triggerSuccess]);

  return {
    activeSubTab,
    setActiveSubTab,
    successMsg,
    setSuccessMsg,
    transportForm,
    foodForm,
    energyForm,
    wasteForm,
    onTransportSubmit,
    onFoodSubmit,
    onEnergySubmit,
    onWasteSubmit
  };
}
