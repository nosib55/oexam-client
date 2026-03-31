import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      id: "01",
      title: "Quick Registration",
      desc: "Join our ecosystem as a learner or mentor in seconds.",
      icon: "🚀",
      color: "#3b82f6",
      pos: "md:mt-0",
    },
    {
      id: "02",
      title: "Deep Discovery",
      desc: "Explore or curate advanced question banks with AI precision.",
      icon: "🧠",
      color: "#a855f7",
      pos: "md:mt-12",
    },
    {
      id: "03",
      title: "Live Assessment",
      desc: "Engage in a distraction-free, high-integrity exam environment.",
      icon: "🎯",
      color: "#f59e0b",
      pos: "md:mt-0",
    },
    {
      id: "04",
      title: "Smart Analytics",
      desc: "Unlock deep insights and global rankings instantly.",
      icon: "📊",
      color: "#10b981",
      pos: "md:mt-12",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-[#f8fafc] overflow-hidden relative"
    >
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full translate-x-1/2"></div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20">
        {/* Header with Glass Tag */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-[0.3em] border border-primary/20 mb-6">
            The Protocol
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter leading-tight">
            How we redefine <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Examination
            </span>
          </h2>
        </div>

        {/* Unique Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`relative group ${step.pos} transition-all duration-500`}
            >
              {/* Card Container */}
              <div className="h-full bg-base-50 border border-base-400 group-hover:border-primary/50 p-8 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.03)] group-hover:shadow-primary/10 transition-all duration-500 relative overflow-hidden">
                {/* Step Number Background */}
                <span className="absolute right-3 -top-1 text-9xl font-black text-base-content/[0.03] group-hover:text-primary transition-colors duration-500">
                  {step.id}
                </span>

                {/* Animated Icon Circle */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 relative transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110"
                  style={{
                    backgroundColor: `${step.color}15`,
                    color: step.color,
                  }}
                >
                  {step.icon}
                  <div className="absolute inset-0 rounded-2xl border-2 border-current opacity-20 animate-ping"></div>
                </div>

                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-base-content mb-4 tracking-tight group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-base-content/60 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Progress Indicator (Bottom Line) */}
                <div className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent w-0 group-hover:w-full transition-all duration-700"></div>
              </div>

              {/* Connector Arrow (Desktop Only) */}
              {idx !== steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 z-20 opacity-20 group-hover:opacity-100 transition-opacity">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-primary animate-bounce-x"
                  >
                    <path
                      d="M13 7l5 5-5 5M6 7l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Global Footer Note */}
        <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-4 border-base-100 bg-base-300 overflow-hidden shadow-xl"
              >
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-base-100 bg-primary text-white flex items-center justify-center text-xs font-bold shadow-xl">
              +2k
            </div>
          </div>
          <p className="text-base-content/50 font-bold text-sm text-center md:text-left">
            Join <span className="text-base-content">2,000+</span> students
            already <br className="hidden md:block" /> improving their grades
            with EXAMINERLY.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
