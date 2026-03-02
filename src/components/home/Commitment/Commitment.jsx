import React from 'react';

const Commitment = () => {
  const commitments = [
    {
      title: 'Privacy First',
      desc: 'We never sell data. Your institutional information is yours alone, secured by industry-standard encryption.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
    },
    {
      title: 'Accessibility',
      desc: 'Compliant with WCAG 2.1, ensuring every student has an equal opportunity to succeed regardless of ability.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
          />
        </svg>
      ),
    },
    {
      title: 'Constant Innovation',
      desc: 'Weekly updates based directly on feedback from our network of over 20,000 educators.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 bg-[#0A1120] text-white overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-10">
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
              Empowering the Next <br /> Generation of Learners
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
              EXAMINERLY was founded with a single mission: to provide educators
              with a platform that is as reliable as it is powerful. We believe
              that technology should enable learning, not complicate it.
            </p>

            <div className="flex gap-12 pt-4">
              <div>
                <p className="text-4xl font-black text-[#2D60FF] mb-2 tracking-tighter">
                  99.9%
                </p>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Uptime SLA
                </p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#2D60FF] mb-2 tracking-tighter">
                  15M+
                </p>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Exams Taken
                </p>
              </div>
            </div>
          </div>

          {/* Right Card: Commitment */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-[#161F31] border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative">
              {/* Subtle background glow inside card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>

              <h3 className="text-2xl font-black mb-10 tracking-tight text-slate-100">
                Our Commitment
              </h3>

              <div className="space-y-10">
                {commitments.map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#1E293B] border border-slate-700 rounded-xl flex items-center justify-center text-[#2D60FF] group-hover:bg-[#2D60FF] group-hover:text-white transition-all duration-500">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-200 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
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

export default Commitment;
