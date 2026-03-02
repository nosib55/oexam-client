import React from 'react';

import {
  FaUserShield,
  FaClipboardList,
  FaDatabase,
  FaLaptopCode,
  FaChartLine,
  FaCogs,
  FaAward,
} from 'react-icons/fa';

const services = [
  {
    title: 'User Management',
    icon: <FaUserShield />,
    features: [
      'Student registration and login',
      'Teacher/Examiner creation',
      'Admin panel user management',
      'Role-based access (Student, Teacher, Admin)',
    ],
  },
  {
    title: 'Exam Management',
    icon: <FaClipboardList />,
    features: [
      'Create, schedule, and assign exams',
      'Support for multiple question sets',
      'MCQ, short answer, and written Qs',
      'Course/Subject specific assignment',
    ],
  },
  {
    title: 'Question Bank System',
    icon: <FaDatabase />,
    features: [
      'Subject & difficulty categorization',
      'Random question generation',
      'Bulk upload (CSV/Excel)',
      'AI-Based Question Generator',
      'Question Shuffling for fairness',
    ],
  },
  {
    title: 'Online Exam Interface',
    icon: <FaLaptopCode />,
    features: [
      'Timer-based with auto-submit',
      'Fullscreen mode security',
      'Tab-Switch Detection & Warning',
      'Basic Webcam Proctoring',
      'Smooth navigation (Next/Prev)',
    ],
  },
  {
    title: 'Result & Evaluation',
    icon: <FaAward />,
    features: [
      'Instant auto-marking for MCQs',
      'Manual evaluation for written Qs',
      'Grade & marksheet generation',
      'Downloadable PDF results',
    ],
  },
  {
    title: 'Dashboard & Analytics',
    icon: <FaChartLine />,
    features: [
      'Student performance charts',
      'Subject-wise analysis',
      'Attendance & participation reports',
      'Real-time Leaderboard',
    ],
  },
  {
    title: 'Technical Features',
    icon: <FaCogs />,
    features: [
      'Responsive (Mobile/Desktop)',
      'Database backup system',
      'English & Bangla support',
      'Exam Resume Logic',
      'Fast & scalable architecture',
    ],
  },
];

export default function Services() {
  return (
    <section
      className="bg-base-100 relative"
      id="services"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -ml-64 -mb-64"></div>

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-20 overflow-hidden relative z-10 md:py-24 py-10">
        <div className="text-center mb-24">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-extrabold tracking-[0.2em] uppercase bg-primary/10 text-primary rounded-full">
            Services
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tight mb-8">
            Everything You Need for <br />
            <span className="text-primary">Smart Examinations</span>
          </h2>
          <p className="max-w-2xl mx-auto text-xl opacity-60 leading-relaxed font-medium">
            A complete suite of tools designed to streamline the assessment
            process, ensure integrity, and provide actionable insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-base-200 to-transparent hover:from-primary/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="relative h-full bg-base-100 rounded-[2.4rem] p-10 overflow-hidden flex flex-col">
                {/* Icon Box */}
                <div className="mb-8 relative">
                  <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary/10 text-primary text-3xl group-hover:bg-primary group-hover:text-white transition-all duration-500 z-10 relative">
                    {service.icon}
                  </div>
                  <div className="absolute top-0 left-0 w-16 h-16 bg-primary/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black mb-6 text-base-content group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <ul className="space-y-4 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-4 text-base-content/70"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary group-hover:scale-125 transition-all duration-300"></div>
                      <span className="text-[15px] font-bold tracking-tight leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Background Decor for Card */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
