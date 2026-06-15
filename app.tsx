import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Snowflake, 
  Sparkles, 
  Clock, 
  Activity, 
  FileText, 
  SlidersHorizontal, 
  RefreshCw,
  Compass,
  AlertCircle
} from 'lucide-react';
import { ParticleType } from './types';
import ParticlePresenter from './components/ParticlePresenter';

interface LogEntry {
  id: string;
  time: string;
  event: string;
  details: string;
  type: ParticleType;
}

export default function App() {
  const [activeEffect, setActiveEffect] = useState<ParticleType | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // remaining milliseconds
  const [density, setDensity] = useState<number>(1.0); // 0.6 to 1.8 spawn rates
  const [speed, setSpeed] = useState<number>(1.0); // 0.7 to 1.5 velocity factor
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'initial',
      time: new Date().toLocaleTimeString(),
      event: 'Atmosphere initialized',
      details: 'System configured with Standard Density (1.0x) and Standard Velocity (1.0x). Ready.',
      type: 'snowflake', // default color code
    }
  ]);

  // Handle countdown interval
  useEffect(() => {
    if (timeLeft <= 0) {
      if (activeEffect) {
        setActiveEffect(null);
        addLog(
          `${activeEffect === 'snowflake' ? 'Winter Snowfall' : 'Balloon Launch'} completed`,
          '5.0 second active period concluded successfully.',
          activeEffect
        );
      }
      return;
    }

    const start = Date.now();
    const interval = speed === 1.0 ? 50 : 30; // frequency adjustment

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 100);
        if (next === 0 && activeEffect) {
          setActiveEffect(null);
        }
        return next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [timeLeft, activeEffect]);

  const addLog = (event: string, details: string, type: ParticleType) => {
    const newLog: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString(),
      event,
      details,
      type,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]); // keep recent 20 events
  };

  const handleTrigger = (type: ParticleType) => {
    // Start/restart 5-second countdown
    setActiveEffect(type);
    setTimeLeft(5000); // 5000ms

    const eventName = type === 'snowflake' ? 'Snowfall Triggered' : 'Balloon Launch Triggered';
    const desc = `Requested ${density.toFixed(1)}x density at ${speed.toFixed(1)}x speed for 5 seconds.`;
    addLog(eventName, desc, type);
  };

  const handleResetLogs = () => {
    setLogs([
      {
        id: `reset-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        event: 'System Logs Cleared',
        details: 'History reset by executive operator.',
        type: 'snowflake',
      }
    ]);
  };

  // Helper values for active display
  const progressRatio = (timeLeft / 5000) * 100;

  return (
    <div id="main-application-container" className="min-h-screen bg-[#f8f8f6] text-slate-800 flex flex-col font-sans relative antialiased selection:bg-slate-200">
      
      {/* Background Subtle Watermark/Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e0_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />

      {/* Floating Particle Container Stage */}
      <ParticlePresenter
        activeEffect={activeEffect}
        onEffectEnd={() => setActiveEffect(null)}
        density={density}
        speedMultiplier={speed}
      />

      {/* Enterprise Upper Bar */}
      <header id="app-header" className="border-b border-slate-300/60 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2 rounded-lg shadow-sm">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs font-mono font-semibold text-slate-500 tracking-wider uppercase">Visual Presenter Console</p>
              <h1 className="text-xl md:text-2xl font-serif font-semibold text-slate-900 leading-tight">
                Atmosphere Orchestrator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Environment Ready
            </span>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
              UTC Local
            </span>
          </div>
        </div>
      </header>

      {/* Main Panel Content Grid */}
      <main id="app-main-content" className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* Left Side: Controller Deck (7 columns) */}
        <section id="controller-deck" className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Executive Pitch / Intro */}
          <div className="bg-white border border-slate-300/50 rounded-2xl p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)]">
            <h2 className="text-lg font-serif font-medium text-slate-900 mb-2">Architectural State Driver</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Activate physical environmental atmospheric states on-demand. Select a preset below to trigger fully configured physics vectors. Each activation persists for exactly <strong className="text-slate-800">5.0 seconds</strong> with automatic soft decay.
            </p>
          </div>

          {/* Primary Trigger Actions: TWO BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* SNOWFLAKES CARD & TRIGGER */}
            <div 
              id="card-snowflakes"
              className={`bg-white border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                activeEffect === 'snowflake' 
                  ? 'border-sky-400 ring-2 ring-sky-100 shadow-md translate-y-[-2px]' 
                  : 'border-slate-300/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:border-slate-400/80 hover:shadow-md'
              }`}
            >
              {/* Decorative Subtle Snowflake behind */}
              <div className="absolute right-[-15px] top-[-15px] opacity-[0.03] text-sky-900 group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none">
                <Snowflake className="w-36 h-36 rotate-12" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`p-2.5 rounded-xl ${
                    activeEffect === 'snowflake' ? 'bg-sky-50 text-sky-600' : 'bg-slate-50 text-slate-500'
                  } transition-colors`}>
                    <Snowflake className="w-6 h-6" />
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-widest">Atmosphere I</span>
                </div>
                
                <h3 className="text-lg font-serif font-medium text-slate-900 mb-1">Crystalline Snowfall</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Spawns crystal-form snowflakes of medium magnitude. Fall trajectories feature randomized angular rotations and light side-drift vectors.
                </p>
              </div>

              <button
                id="btn-trigger-snowflakes"
                onClick={() => handleTrigger('snowflake')}
                className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  activeEffect === 'snowflake'
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Snowflake className={`w-4 h-4 ${activeEffect === 'snowflake' ? 'animate-spin-slow' : ''}`} />
                {activeEffect === 'snowflake' ? `Snowflakes Active (${(timeLeft / 1000).toFixed(1)}s)` : 'Deploy Snowflakes'}
              </button>
            </div>

            {/* BALLOONS CARD & TRIGGER */}
            <div 
              id="card-balloons"
              className={`bg-white border rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${
                activeEffect === 'balloon' 
                  ? 'border-amber-500 ring-2 ring-amber-100 shadow-md translate-y-[-2px]' 
                  : 'border-slate-300/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:border-slate-400/80 hover:shadow-md'
              }`}
            >
              {/* Decorative design element behind */}
              <div className="absolute right-[-15px] top-[-15px] opacity-[0.03] text-amber-900 group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none">
                <Sparkles className="w-36 h-36 -rotate-12" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`p-2.5 rounded-xl ${
                    activeEffect === 'balloon' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'
                  } transition-colors`}>
                    <Sparkles className="w-6 h-6" />
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-widest">Atmosphere II</span>
                </div>
                
                <h3 className="text-lg font-serif font-medium text-slate-900 mb-1">Gilded Balloons</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  Launches premium-colored architectural display balloons. Includes micro-gloss highlighting, swaying strings, and customized ascension velocities.
                </p>
              </div>

              <button
                id="btn-trigger-balloons"
                onClick={() => handleTrigger('balloon')}
                className={`w-full py-3.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  activeEffect === 'balloon'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${activeEffect === 'balloon' ? 'animate-bounce' : ''}`} />
                {activeEffect === 'balloon' ? `Balloons Active (${(timeLeft / 1000).toFixed(1)}s)` : 'Deploy Balloons'}
              </button>
            </div>

          </div>

          {/* Environmental Controls (Tweak Parameters) */}
          <div id="physics-panel" className="bg-white border border-slate-300/60 rounded-2xl p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <h3 className="font-serif font-medium text-slate-900 text-sm">Calibration Deck</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Operational Modifiers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Density Multiplier Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-600">Atmospheric Density</label>
                  <span className="text-xs font-mono font-medium text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                    {density === 0.6 ? 'Sparse' : density === 1.0 ? 'Standard' : 'Abundant'} ({density.toFixed(1)}x)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.6"
                  step="0.5"
                  value={density}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setDensity(val);
                  }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>0.6x Sparse</span>
                  <span>1.0x Regular</span>
                  <span>1.6x Dense</span>
                </div>
              </div>

              {/* Gravity/Speed Multiplier Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-600">Velocity Factor</label>
                  <span className="text-xs font-mono font-medium text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                    {speed === 0.7 ? 'Gentle' : speed === 1.0 ? 'Standard' : 'Energetic'} ({speed.toFixed(1)}x)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.3"
                  value={speed}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSpeed(val);
                  }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>0.7x Gentle</span>
                  <span>1.0x Normal</span>
                  <span>1.3x Quick</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Right Side: Active Telemetries & Analytics Journal (5 columns) */}
        <section id="telemetries-deck" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Active Status Display Card */}
          <div className="bg-white border border-slate-300/60 rounded-2xl p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-600" />
                <h3 className="font-serif font-medium text-slate-900 text-sm">Telemetry HUD</h3>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeEffect ? 'bg-indigo-400' : 'bg-slate-300'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${activeEffect ? 'bg-indigo-500' : 'bg-slate-400'}`} />
              </span>
            </div>

            {/* Countdown / Atmosphere Gauge */}
            {activeEffect ? (
              <div className="py-2">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-slate-500 font-medium">Active Atmosphere</span>
                  <span className="text-xs font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {activeEffect === 'snowflake' ? 'Winter Snowfall' : 'Balloon Launch'}
                  </span>
                </div>
                
                {/* Numeric Countdown Display */}
                <div className="text-center py-4">
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Time Remaining</p>
                  <p className="text-4xl font-serif font-bold text-slate-900 tracking-tight">
                    {(timeLeft / 1000).toFixed(2)}s
                  </p>
                </div>

                {/* Progress Bar HUD */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full transition-all duration-100 rounded-full ${
                        activeEffect === 'snowflake' ? 'bg-sky-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressRatio}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>5.0s</span>
                    <span>Elapsed: {((5000 - timeLeft) / 1000).toFixed(1)}s</span>
                    <span>0.0s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="border border-slate-200 bg-slate-50 p-3 rounded-full text-slate-400 mb-3 block">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-medium text-slate-800 text-sm mb-1">Atmospheric State: Calm</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Await trigger from operator. Select "Snowflakes" or "Balloons" to initiate physical particles.
                </p>
              </div>
            )}
          </div>

          {/* Activity Log (Enterprise Console Register) */}
          <div className="bg-white border border-slate-300/60 rounded-2xl p-6 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-600" />
                <h3 className="font-serif font-medium text-slate-900 text-sm">System Registry</h3>
              </div>
              <button 
                onClick={handleResetLogs}
                className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors font-mono uppercase bg-slate-50 hover:bg-slate-100 py-1 px-2 rounded border border-slate-200 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Reset Log
              </button>
            </div>

            {/* Logs List SCROLLABLE */}
            <div className="flex-1 overflow-y-auto max-h-[350px] space-y-3 font-mono text-xs pr-1">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/50 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.time}
                    </span>
                    <span className={`px-1.5 rounded uppercase font-bold text-[8px] ${
                      log.type === 'snowflake' 
                        ? 'bg-sky-50 text-sky-600 border border-sky-200' 
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {log.type}
                    </span>
                  </div>
                  <h5 className="font-semibold text-slate-800 mb-0.5">{log.event}</h5>
                  <p className="text-slate-500 font-sans leading-relaxed text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Record capacity: 20 rows</span>
              <span>Online Session</span>
            </div>
          </div>

        </section>

      </main>

      {/* Elegant Footer */}
      <footer id="app-footer" className="mt-auto border-t border-slate-300/60 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-6 text-center flex flex-col md:flex-row md:justify-between items-center gap-2 text-xs text-slate-400 font-mono">
          <span>Atmosphere Orchestrator &bull; Formal Signage Protocol</span>
          <span>© {new Date().getFullYear()} Enterprise Aesthetic Solutions. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
