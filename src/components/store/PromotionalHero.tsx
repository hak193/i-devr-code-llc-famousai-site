
import { ArrowRight, Check, Rocket, Sparkles } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const FEATURED_PRODUCT_ID = 'saas_starter_pro'; // Ideally fetched dynamically

export const PromotionalHero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0
  });

  // Simple countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden py-16 mb-12">
      {/* Background with abstract shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-black pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold mb-6 border border-yellow-500/30">
                <Sparkles className="w-4 h-4" />
                LIMITED TIME OFFER
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-6 leading-tight">
                Launch Your SaaS <br className="hidden lg:block" />
                <span className="text-white">In Days, Not Months</span>
              </h1>
              <p className="text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Get the Ultimate SaaS Founder Bundle. Includes our production-ready Next.js boilerplate, 50+ premium UI components, and the "Growth Hacker" prompt library.
              </p>
            </div>

            {/* Timer & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <div className="flex gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Hrs</div>
                </div>
                <div className="text-2xl font-bold text-zinc-600">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Mins</div>
                </div>
                <div className="text-2xl font-bold text-zinc-600">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white font-mono">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">Secs</div>
                </div>
              </div>

              <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300">
                <span className="flex items-center gap-2">
                  Get The Bundle - $199 <span className="line-through text-purple-200 text-sm font-normal">$399</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
              </button>
            </div>

            {/* Social Proof / Trust */}
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-4 text-sm text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span>Lifetime Updates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span>Commercial License</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Visual (3D-ish Card Stack) */}
          <div className="hidden lg:block relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/30 to-blue-500/30 rounded-full blur-[100px]" />
             
             {/* Main Card */}
             <div className="relative z-20 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                   <Rocket className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h3 className="font-bold text-white">SaaS Starter Pro</h3>
                   <p className="text-xs text-zinc-400">Production Ready</p>
                 </div>
               </div>
               <div className="space-y-3">
                 <div className="h-2 w-3/4 bg-zinc-800 rounded animate-pulse" />
                 <div className="h-2 w-full bg-zinc-800 rounded animate-pulse delay-75" />
                 <div className="h-2 w-5/6 bg-zinc-800 rounded animate-pulse delay-150" />
               </div>
               <div className="mt-6 flex justify-between items-center text-sm">
                 <span className="text-zinc-500">v2.4.0</span>
                 <span className="text-purple-400 font-medium">React + Node</span>
               </div>
             </div>

             {/* Secondary Card (Behind) */}
             <div className="absolute top-12 left-12 z-10 w-full bg-zinc-800/80 border border-zinc-700/50 rounded-2xl p-6 shadow-xl rotate-[6deg] scale-95 blur-[1px]">
               <div className="h-full w-full opacity-50">
                 {/* Decorative content */}
               </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};
