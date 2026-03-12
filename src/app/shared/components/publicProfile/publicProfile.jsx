import Image from 'next/image';

const PublicProfile = ({ user, isVerified }) => {
  // Mock data for activities (You can fetch this from DB)
  const stats = [
    {
      label: 'Courses Completed',
      value: user?.completedCourses || 0,
      icon: '🎓',
    },
    { label: 'Certificates', value: user?.certificates || 0, icon: '📜' },
    { label: 'Exam Average', value: `${user?.avgScore || 0}%`, icon: '📈' },
    { label: 'Projects', value: user?.projectsCount || 0, icon: '💻' },
  ];

  return (
    <div className="min-h-screen bg-base-200/50 pb-20">
      {/* Profile Header & Banner */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/20 to-primary/5 w-full">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-base-100">
              <Image
                src={user?.image || 'https://ibb.co.com/WW2RJLhF'}
                alt={user?.name}
                width={160}
                height={160}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            {isVerified && (
              <div
                className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-lg"
                title="Verified Account"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#3b82f6"
                  className="w-6 h-6 md:w-8 md:h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.491 4.491 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-base-100 p-6 rounded-[2.5rem] shadow-sm text-center md:text-left">
              <h1 className="text-3xl font-black text-base-content flex items-center justify-center md:justify-start gap-2">
                {user?.name}
              </h1>
              <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">
                {user?.role || 'Student'} | Computer Science
              </p>
              <p className="text-base-content/60 mt-4 leading-relaxed italic">
                {user?.bio ||
                  'Passionate learner and tech enthusiast. Dedicated to mastering new skills and contributing to the community.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                <button className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20">
                  Follow
                </button>
                <button className="btn btn-outline rounded-2xl border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/20">
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Activity */}
          <div className="lg:col-span-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-base-100 p-5 rounded-[2rem] shadow-sm border border-primary/5 flex flex-col items-center text-center group hover:bg-primary/5 transition-all duration-300"
                >
                  <span className="text-2xl mb-2 group-hover:scale-125 transition-transform">
                    {stat.icon}
                  </span>
                  <p className="text-2xl font-black text-base-content">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-base-100 p-8 rounded-[2.5rem] shadow-sm border border-primary/5">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Recent Activity
              </h3>

              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-base-200/50 transition-all group cursor-pointer border border-transparent hover:border-primary/10"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-all">
                      📝
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base-content">
                        Completed Quiz: JavaScript Fundamentals
                      </p>
                      <p className="text-xs text-base-content/40 font-medium">
                        March {i + 5}, 2026
                      </p>
                    </div>
                    <div className="text-primary font-black">95%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
