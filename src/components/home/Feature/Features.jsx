import React from "react";

const Features = () => {
  const features = [
    {
      title: "AI Eye Tracking",
      desc: "Real-time gaze detection and environment analysis to prevent academic dishonesty automatically.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      iconBg: "bg-[#FF4D6D]", // Pinkish Red
    },
    {
      title: "Question Randomization",
      desc: "Dynamic shuffle logic ensures no two students receive the same question order or options.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>
      ),
      iconBg: "bg-[#00C896]", // Teal Green
    },
    {
      title: "Instant Evaluation",
      desc: "Auto-grade objective questions and get immediate performance reports for students and faculty.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      ),
      iconBg: "bg-[#FFB72B]", // Orange/Yellow
    },
    {
      title: "Lockdown Browser",
      desc: "Prevent switching tabs, opening new windows, or accessing external tools during active sessions.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
      iconBg: "bg-[#5D5FEF]", // Blue/Indigo
    },
    {
      title: "Multi-device Ready",
      desc: "Conduct exams seamlessly on tablets, laptops, or desktops with fully responsive layouts.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
          />
        </svg>
      ),
      iconBg: "bg-[#2D60FF]", // Bright Blue
    },
    {
      title: "Rich Media Support",
      desc: "Embed high-definition videos, interactive charts, and complex math equations into any question.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
          />
        </svg>
      ),
      iconBg: "bg-[#9277FF]",
    },
  ];

  return (
    <section className="py-20">
      {" "}
      {/* Light gray/white background as per image */}
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-[#1E293B] tracking-tight">
            Built for Serious Institutions
          </h2>
          <p className="text-base-content/60 italic font-medium max-w-2xl mx-auto">
            &quot;The most robust examination framework we have ever
            deployed.&quot; — Global Edu Tech Review
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col items-start"
            >
              {/* Icon Box */}
              <div
                className={`${feature.iconBg} p-3 rounded-xl text-white mb-8 shadow-lg shadow-current/20`}
              >
                {feature.icon}
              </div>

              {/* Text */}
              <h3 className="text-2xl font-black text-[#1E293B] mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[#64748B] font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
