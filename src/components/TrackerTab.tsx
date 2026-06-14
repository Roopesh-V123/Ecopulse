import { useCarbonForm } from '../hooks/useCarbonForm';
import { Car, Salad, Zap, Trash2, Send, CheckCircle2 } from 'lucide-react';

export default function TrackerTab() {
  const {
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
  } = useCarbonForm();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" role="tabpanel" aria-label="Tracker Panel">
      
      {/* Tab Navigation header */}
      <div className="glass-panel rounded-2xl p-2 flex justify-between items-center gap-1 overflow-x-auto">
        <button
          onClick={() => { setActiveSubTab('transportation'); setSuccessMsg(null); }}
          className={`flex items-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shrink-0 ${
            activeSubTab === 'transportation' 
              ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/20' 
              : 'text-text-muted hover:text-text-main hover:bg-brand-emerald/5'
          }`}
          aria-selected={activeSubTab === 'transportation'}
          role="tab"
        >
          <Car className="h-4 w-4" />
          <span>Transportation</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('food'); setSuccessMsg(null); }}
          className={`flex items-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shrink-0 ${
            activeSubTab === 'food' 
              ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/20' 
              : 'text-text-muted hover:text-text-main hover:bg-brand-emerald/5'
          }`}
          aria-selected={activeSubTab === 'food'}
          role="tab"
        >
          <Salad className="h-4 w-4" />
          <span>Food Diet</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('energy'); setSuccessMsg(null); }}
          className={`flex items-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shrink-0 ${
            activeSubTab === 'energy' 
              ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/20' 
              : 'text-text-muted hover:text-text-main hover:bg-brand-emerald/5'
          }`}
          aria-selected={activeSubTab === 'energy'}
          role="tab"
        >
          <Zap className="h-4 w-4" />
          <span>Home Energy</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('shopping_waste'); setSuccessMsg(null); }}
          className={`flex items-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shrink-0 ${
            activeSubTab === 'shopping_waste' 
              ? 'bg-brand-emerald text-white shadow-md shadow-brand-emerald/20' 
              : 'text-text-muted hover:text-text-main hover:bg-brand-emerald/5'
          }`}
          aria-selected={activeSubTab === 'shopping_waste'}
          role="tab"
        >
          <Trash2 className="h-4 w-4" />
          <span>Shopping & Waste</span>
        </button>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-brand-mint text-sm rounded-2xl px-5 py-3 text-left animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Inputs Form Body */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 text-left">
        
        {/* Transportation Log */}
        {activeSubTab === 'transportation' && (
          <form onSubmit={transportForm.handleSubmit(onTransportSubmit)} className="space-y-6">
            <h3 className="font-display font-bold text-xl text-text-main flex items-center gap-2">
              <Car className="text-brand-emerald h-5 w-5" /> Log Travel Distance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="vehicleType">
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  {...transportForm.register('vehicleType')}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                >
                  <option value="car_petrol">Petrol Sedan Car</option>
                  <option value="car_diesel">Diesel SUV Car</option>
                  <option value="car_electric">Electric Vehicle (EV)</option>
                  <option value="bus">Public Commuter Bus</option>
                  <option value="train">Subway or Electric Train</option>
                  <option value="bike_walking">Bicycle / Walking (Zero Emission)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="distance">
                  Distance Traveled (km)
                </label>
                <input
                  id="distance"
                  type="number"
                  step="any"
                  placeholder="e.g. 15.5"
                  {...transportForm.register('distance', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {transportForm.formState.errors.distance && (
                  <p className="text-xs text-red-500 font-semibold">{transportForm.formState.errors.distance.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="transportDate">
                  Log Date
                </label>
                <input
                  id="transportDate"
                  type="date"
                  {...transportForm.register('date')}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-eco-gradient text-white text-sm font-semibold rounded-xl px-6 py-3 cursor-pointer hover:shadow-md hover:shadow-brand-emerald/25 transition-all duration-200 flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Save Log Entry
            </button>
          </form>
        )}

        {/* Food Diet Log */}
        {activeSubTab === 'food' && (
          <form onSubmit={foodForm.handleSubmit(onFoodSubmit)} className="space-y-6">
            <h3 className="font-display font-bold text-xl text-text-main flex items-center gap-2">
              <Salad className="text-brand-emerald h-5 w-5" /> Log Daily Diet
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="dietType">
                  Diet Style
                </label>
                <select
                  id="dietType"
                  {...foodForm.register('dietType')}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                >
                  <option value="vegan">100% Plant-Based Vegan</option>
                  <option value="vegetarian">Vegetarian (Dairy/Eggs, No Meat)</option>
                  <option value="mixed">Mixed Diet (Balanced Veg & Poultry)</option>
                  <option value="meat_heavy">Meat-Heavy Diet (Daily Red Meat/Beef)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="servings">
                  Number of Meals / Servings
                </label>
                <input
                  id="servings"
                  type="number"
                  placeholder="e.g. 3"
                  {...foodForm.register('servings', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {foodForm.formState.errors.servings && (
                  <p className="text-xs text-red-500 font-semibold">{foodForm.formState.errors.servings.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="foodDate">
                  Log Date
                </label>
                <input
                  id="foodDate"
                  type="date"
                  {...foodForm.register('date')}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-eco-gradient text-white text-sm font-semibold rounded-xl px-6 py-3 cursor-pointer hover:shadow-md hover:shadow-brand-emerald/25 transition-all duration-200 flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Save Log Entry
            </button>
          </form>
        )}

        {/* Home Energy Log */}
        {activeSubTab === 'energy' && (
          <form onSubmit={energyForm.handleSubmit(onEnergySubmit)} className="space-y-6">
            <h3 className="font-display font-bold text-xl text-text-main flex items-center gap-2">
              <Zap className="text-brand-emerald h-5 w-5" /> Log Home Energy Footprint
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="electricityKwh">
                  Electricity Spent (kWh)
                </label>
                <input
                  id="electricityKwh"
                  type="number"
                  step="any"
                  placeholder="e.g. 12"
                  {...energyForm.register('electricityKwh', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {energyForm.formState.errors.electricityKwh && (
                  <p className="text-xs text-red-500 font-semibold">{energyForm.formState.errors.electricityKwh.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="acHours">
                  Air Conditioning (Hours)
                </label>
                <input
                  id="acHours"
                  type="number"
                  placeholder="e.g. 4"
                  {...energyForm.register('acHours', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {energyForm.formState.errors.acHours && (
                  <p className="text-xs text-red-500 font-semibold">{energyForm.formState.errors.acHours.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="appliancesCount">
                  Appliance Count (Active)
                </label>
                <input
                  id="appliancesCount"
                  type="number"
                  placeholder="e.g. 8"
                  {...energyForm.register('appliancesCount', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {energyForm.formState.errors.appliancesCount && (
                  <p className="text-xs text-red-500 font-semibold">{energyForm.formState.errors.appliancesCount.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="energyDate">
                  Log Date
                </label>
                <input
                  id="energyDate"
                  type="date"
                  {...energyForm.register('date')}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-eco-gradient text-white text-sm font-semibold rounded-xl px-6 py-3 cursor-pointer hover:shadow-md hover:shadow-brand-emerald/25 transition-all duration-200 flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Save Log Entry
            </button>
          </form>
        )}

        {/* Shopping & Waste Log */}
        {activeSubTab === 'shopping_waste' && (
          <form onSubmit={wasteForm.handleSubmit(onWasteSubmit)} className="space-y-6">
            <h3 className="font-display font-bold text-xl text-text-main flex items-center gap-2">
              <Trash2 className="text-brand-emerald h-5 w-5" /> Log Shopping & Waste Recycled
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="clothingItems">
                  Clothing Items Purchased
                </label>
                <input
                  id="clothingItems"
                  type="number"
                  placeholder="e.g. 1"
                  {...wasteForm.register('clothingItems', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {wasteForm.formState.errors.clothingItems && (
                  <p className="text-xs text-red-500 font-semibold">{wasteForm.formState.errors.clothingItems.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="electronicsCount">
                  Electronics Purchased
                </label>
                <input
                  id="electronicsCount"
                  type="number"
                  placeholder="e.g. 0"
                  {...wasteForm.register('electronicsCount', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {wasteForm.formState.errors.electronicsCount && (
                  <p className="text-xs text-red-500 font-semibold">{wasteForm.formState.errors.electronicsCount.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="recycledWeight">
                  Recycled Weight (kg)
                </label>
                <input
                  id="recycledWeight"
                  type="number"
                  step="any"
                  placeholder="e.g. 4.5"
                  {...wasteForm.register('recycledWeight', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {wasteForm.formState.errors.recycledWeight && (
                  <p className="text-xs text-red-500 font-semibold">{wasteForm.formState.errors.recycledWeight.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="nonRecycledWeight">
                  Non-Recycled Waste Weight (kg)
                </label>
                <input
                  id="nonRecycledWeight"
                  type="number"
                  step="any"
                  placeholder="e.g. 1.2"
                  {...wasteForm.register('nonRecycledWeight', { valueAsNumber: true })}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
                {wasteForm.formState.errors.nonRecycledWeight && (
                  <p className="text-xs text-red-500 font-semibold">{wasteForm.formState.errors.nonRecycledWeight.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="wasteDate">
                  Log Date
                </label>
                <input
                  id="wasteDate"
                  type="date"
                  {...wasteForm.register('date')}
                  className="w-full glass-panel rounded-xl px-4 py-3 bg-bg-card border border-border-main text-text-main text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-eco-gradient text-white text-sm font-semibold rounded-xl px-6 py-3 cursor-pointer hover:shadow-md hover:shadow-brand-emerald/25 transition-all duration-200 flex items-center gap-2"
            >
              <Send className="h-4 w-4" /> Save Log Entry
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
