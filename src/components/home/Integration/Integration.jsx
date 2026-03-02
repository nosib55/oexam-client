import React from 'react';

const Integration = () => {
  const tools = [
    { name: 'Question Bank', icon: '📚' },
    { name: 'Auto Grading', icon: '⚡' },
    { name: 'Proctoring', icon: '🎥' },
    { name: 'Analytics', icon: '📊' },
    { name: 'Certificates', icon: '🏆' },
    { name: 'Results', icon: '🧾' },
  ];

  return (
    <section className="py-24 bg-base-200/20 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[11px] bg-primary/10 px-5 py-2.5 rounded-full inline-block">
              Exam Platform
            </span>
            <h2 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tighter">
              Smart
              <br />
              <span className="text-primary italic">Exam System</span>
            </h2>
            <p className="text-base-content/60 text-lg max-w-lg leading-relaxed font-medium">
              A centralized platform for managing exams, monitoring students,
              and generating results with complete automation.
            </p>
            <button className="btn btn-primary btn-lg px-10 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              EXPLORE SYSTEM
            </button>
          </div>

          {/* RIGHT HUB LAYOUT (Modernized) */}
          <div className="relative py-10">
            {/* Animated Background Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 blur-[100px] rounded-full animate-pulse"></div>

            <div className="relative flex flex-col items-center gap-2">
              {/* Top Features */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 w-full relative z-10">
                {tools.slice(0, 3).map((tool, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-3xl shadow-xl shadow-slate-200/50 border flex flex-col items-center gap-3 hover:-translate-y-2 transition-all duration-500 group"
                  >
                    <div className="w-12 h-12 bg-base-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                      {tool.icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-center">
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative Connection Lines (SVG) */}
              <div className="h-24 w-full max-w-[400px] relative">
                <svg
                  className="w-full h-full text-primary/20"
                  viewBox="0 0 400 100"
                >
                  <path
                    d="M50 0 L200 100 M200 0 L200 100 M350 0 L200 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                </svg>
              </div>

              {/* Center Core - The Modern Hub */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-xl group-hover:bg-primary/30 transition-all"></div>
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 text-white flex items-center justify-center text-5xl shadow-2xl relative z-10 border-4 border-white">
                  🎓
                </div>
              </div>

              {/* Decorative Connection Lines (SVG) */}
              <div className="h-24 w-full max-w-[400px] relative">
                <svg
                  className="w-full h-full text-primary/20 rotate-180"
                  viewBox="0 0 400 100"
                >
                  <path
                    d="M50 0 L200 100 M200 0 L200 100 M350 0 L200 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                </svg>
              </div>

              {/* Bottom Features */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 w-full relative z-10">
                {tools.slice(3, 6).map((tool, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-3xl shadow-xl shadow-slate-200/50 border flex flex-col items-center gap-3 hover:translate-y-2 transition-all duration-500 group"
                  >
                    <div className="w-12 h-12 bg-base-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                      {tool.icon}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-center">
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
