import React from 'react';


const About = () => {
  return (
    <section id="about" className="pt-44 pb-24 relative scroll-mt-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>

      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Visual Experience */}
          <div className="relative">
            {/* Main Image Frame */}
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-8 border-base-800 shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
              <img
                src="https://i.ibb.co.com/pvqQ35x5/of-online-exam-illustration-vector-Photoroom.png"
                alt="About O-Exam"
                className="w-full h-[500px] object-cover"
              />
              {/* Glass Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl">
                    ✨
                  </div>
                  <div>
                    <p className="font-black leading-none">
                      Smart AI Evaluation
                    </p>
                    <p className="text-black/70 text-xs mt-1 italic font-medium tracking-wide">
                      Next-gen exam integrity system
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Floating Stats Card */}
            <div className="absolute -top-10 -right-6 md:-right-10 z-20 bg-base-100 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-base-400 hidden md:block animate-bounce-slow">
              <div className="text-center">
                <p className="text-4xl font-black text-primary leading-none">
                  99%
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mt-2">
                  Accuracy Rate
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-xs px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                Who We Are
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tighter leading-[1.1]">
                Empowering the next <br />
                <span className="text-primary italic">Generation</span> of
                learners.
              </h2>
              <p className="text-lg text-base-content/70 font-medium leading-relaxed">
                EXAMINERLY isn&apos;t just an assessment tool; it&apos;s a
                bridge between ambition and achievement. We&apos;ve built an
                ecosystem where integrity meets innovation.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  title: 'Global Access',
                  desc: 'Join from anywhere in the world.',
                  icon: '🌍',
                },
                {
                  title: 'AI Proctoring',
                  desc: 'Secure & fair exam environment.',
                  icon: '🛡️',
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-base-200 flex items-center justify-center text-xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-base-content">
                      {item.title}
                    </h4>
                    <p className="text-xs text-base-content/50 font-bold mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button className="btn btn-primary rounded-2xl px-8 font-black text-white shadow-xl shadow-primary/20 border-none hover:translate-y-[-3px] transition-all duration-300">
                READ OUR STORY
              </button>
              <div className="flex items-center gap-3 px-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-4 border-base-100 bg-gray-300 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?u=1" alt="founder" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-black text-base-content leading-none">
                    Habiba Sultana
                  </p>
                  <p className="text-[10px] font-bold text-primary uppercase mt-1">
                    Founder & CEO
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
