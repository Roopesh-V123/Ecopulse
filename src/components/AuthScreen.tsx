import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEcoStore } from '../store/useEcoStore';
import { Leaf, LogIn, UserPlus, ShieldAlert, KeyRound } from 'lucide-react';

// XSS sanitization
function sanitizeString(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z.string().nonempty("Password is required")
});

const registerSchema = z.object({
  name: z.string().nonempty("Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
  targetDaily: z.number().min(2, "Minimum carbon limit is 2 kg").max(100, "Maximum carbon limit is 100 kg")
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthScreen() {
  const { login, register: registerUser } = useEcoStore();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', targetDaily: 12.0 }
  });

  const handleLoginSubmit = (data: LoginValues) => {
    setErrorMessage(null);
    const email = sanitizeString(data.email);
    const password = sanitizeString(data.password);
    
    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  const handleRegisterSubmit = (data: RegisterValues) => {
    setErrorMessage(null);
    const name = sanitizeString(data.name);
    const email = sanitizeString(data.email);
    const password = sanitizeString(data.password);
    
    const res = registerUser(name, email, password, data.targetDaily);
    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  const handleQuickLogin = (email: string) => {
    setErrorMessage(null);
    const res = login(email, 'Password123');
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden text-left">
        
        {/* Glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-brand-mint/15 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 rounded-full bg-brand-emerald/15 blur-3xl"></div>

        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-2xl bg-eco-gradient flex items-center justify-center text-white shadow-md shadow-brand-emerald/20">
            <Leaf className="h-6.5 w-6.5" />
          </div>
          <div>
            <h2 className="font-display font-black text-2xl tracking-tight text-text-main">EcoPulse Gate</h2>
            <p className="text-xs text-text-muted mt-1">Unlock authorization and manage your personalized climate score.</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex p-1 bg-border-main/50 rounded-xl">
          <button
            onClick={() => { setAuthMode('login'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              authMode === 'login' 
                ? 'bg-brand-emerald text-white shadow' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthMode('register'); setErrorMessage(null); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              authMode === 'register' 
                ? 'bg-brand-emerald text-white shadow' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex gap-2.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="emailInput">
                Email Address
              </label>
              <input
                id="emailInput"
                type="email"
                placeholder="you@ecopulse.org"
                {...loginForm.register('email')}
                className="w-full glass-panel rounded-xl px-4 py-2.5 bg-bg-card border border-border-main text-text-main text-xs"
              />
              {loginForm.formState.errors.email && (
                <p className="text-[10px] text-red-500 font-semibold">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="pwInput">
                Password
              </label>
              <input
                id="pwInput"
                type="password"
                placeholder="••••••••"
                {...loginForm.register('password')}
                className="w-full glass-panel rounded-xl px-4 py-2.5 bg-bg-card border border-border-main text-text-main text-xs"
              />
              {loginForm.formState.errors.password && (
                <p className="text-[10px] text-red-500 font-semibold">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-eco-gradient text-white text-xs font-semibold rounded-xl py-3 cursor-pointer hover:shadow-md hover:shadow-brand-emerald/20 transition-all flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-4 w-4" /> Authenticate Session
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="nameRegInput">
                Full Name
              </label>
              <input
                id="nameRegInput"
                type="text"
                placeholder="e.g. John Doe"
                {...registerForm.register('name')}
                className="w-full glass-panel rounded-xl px-4 py-2.5 bg-bg-card border border-border-main text-text-main text-xs"
              />
              {registerForm.formState.errors.name && (
                <p className="text-[10px] text-red-500 font-semibold">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="emailRegInput">
                Email Address
              </label>
              <input
                id="emailRegInput"
                type="email"
                placeholder="john@example.com"
                {...registerForm.register('email')}
                className="w-full glass-panel rounded-xl px-4 py-2.5 bg-bg-card border border-border-main text-text-main text-xs"
              />
              {registerForm.formState.errors.email && (
                <p className="text-[10px] text-red-500 font-semibold">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="pwRegInput">
                Password (min 6 chars)
              </label>
              <input
                id="pwRegInput"
                type="password"
                placeholder="••••••••"
                {...registerForm.register('password')}
                className="w-full glass-panel rounded-xl px-4 py-2.5 bg-bg-card border border-border-main text-text-main text-xs"
              />
              {registerForm.formState.errors.password && (
                <p className="text-[10px] text-red-500 font-semibold">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block" htmlFor="targetRegInput">
                Daily Carbon Target limit (kg CO₂)
              </label>
              <input
                id="targetRegInput"
                type="number"
                step="any"
                placeholder="12.0"
                {...registerForm.register('targetDaily', { valueAsNumber: true })}
                className="w-full glass-panel rounded-xl px-4 py-2.5 bg-bg-card border border-border-main text-text-main text-xs"
              />
              {registerForm.formState.errors.targetDaily && (
                <p className="text-[10px] text-red-500 font-semibold">{registerForm.formState.errors.targetDaily.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-eco-gradient text-white text-xs font-semibold rounded-xl py-3 cursor-pointer hover:shadow-md hover:shadow-brand-emerald/20 transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus className="h-4 w-4" /> Create Profile & Session
            </button>
          </form>
        )}

        {/* QUICK DEMO ACCOUNTS HELPER */}
        <div className="pt-4 border-t border-border-main space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest flex items-center gap-1.5">
            <KeyRound className="h-3 w-3 text-brand-mint" /> Evaluator Quick-Login (Password: Password123)
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickLogin('roopesh@ecopulse.org')}
              className="glass-panel p-2.5 rounded-xl text-[11px] font-semibold text-text-main hover:border-brand-emerald transition-colors text-left flex justify-between items-center cursor-pointer"
            >
              <span>V. Roopesh (Admin)</span>
              <span className="text-[9px] text-brand-emerald">roopesh@ecopulse.org</span>
            </button>
            <button
              onClick={() => handleQuickLogin('sophia@ecopulse.org')}
              className="glass-panel p-2.5 rounded-xl text-[11px] font-semibold text-text-main hover:border-brand-emerald transition-colors text-left flex justify-between items-center cursor-pointer"
            >
              <span>Sophia Eco (Sample user)</span>
              <span className="text-[9px] text-brand-emerald">sophia@ecopulse.org</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
