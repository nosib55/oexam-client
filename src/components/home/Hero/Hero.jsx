const Hero = () => {
  return (
    <div>
      <section className="relative flex items-center bg-base-100 md:my-40 my-20">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full"></div>

        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="badge badge-outline badge-primary font-bold py-4 px-6 rounded-full animate-bounce">
              🚀 SMART EXAM SOLUTION
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-base-content uppercase tracking-tighter">
             <span className="text-primary">EXAMINERLY</span> : The Smartest{' '}
              <span className="">Evaluation</span> Tool
            </h1>
            <p className="text-sm md:text-lg opacity-70 max-w-lg leading-relaxed">
              Join thousands of students and prepare for your dreams with
              real-time tracking, instant results, and expert-curated questions.
            </p>
            <div className="flex gap-4">
              <button className="btn btn-primary md:btn-lg rounded-2xl shadow-xl shadow-primary/20 px-8 font-black uppercase">
                Get Started
              </button>
              <button className="btn btn-outline btn-primary md:btn-lg rounded-2xl px-8 font-black uppercase italic">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right Content - Image with Floating Cards */}
          <div className="relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700">
              <img
                src="https://i.ibb.co.com/S4Bw6CNW/3718985.jpg"
                alt="kids studying"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Floating Info Card */}
            <div className="absolute -bottom-6 md:-left-6 z-20 bg-base-100 p-2 lg:p-6 rounded-xl lg:rounded-[2rem] shadow-2xl border border-base-100 animate-floating">
              <div className="flex items-center gap-2">
                <div className="p-3 px-4 bg-green-500/10 text-green-500 rounded-2xl font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-black text-md lg:text-xl leading-none">
                    98.5%
                  </p>
                  <p className="text-xs opacity-50 uppercase font-bold tracking-widest mt-1">
                    Success Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;