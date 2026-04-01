'use client';
import Logo from '@/components/shared/Logo/Logo';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LuDatabase,
  LuPlus,
  LuUsers,
  LuChartBar,
  LuSettings,
  LuLayoutDashboard,
  LuChevronRight,
  LuSchool,
  LuBell,
  LuLogOut,
} from 'react-icons/lu';
import { MdLeaderboard } from 'react-icons/md';

export default function TeacherLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.clear();
      router.push('/auth/login');
    } catch (err) {
      localStorage.clear();
      router.push('/auth/login');
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LuLayoutDashboard size={20} />,
      href: '/dashboard/teacher',
    },
    {
      name: 'Classes',
      icon: <LuSchool size={20} />,
      href: '/dashboard/teacher/classes',
    },
    {
      name: 'Join Requests',
      icon: <LuBell size={20} />,
      href: '/dashboard/teacher/classes/requests',
    },
    {
      name: 'Question Banks',
      icon: <LuDatabase size={20} />,
      href: '/dashboard/teacher/question-bank',
    },
    {
      name: 'Exams',
      icon: <LuPlus size={20} />,
      href: '/dashboard/teacher/exams',
    },
    {
      name: 'Students',
      icon: <LuUsers size={20} />,
      href: '/dashboard/teacher/students',
    },
    {
      name: 'Results',
      icon: <LuChartBar size={20} />,
      href: '/dashboard/teacher/results',
    },
    {
      name: 'Leaderboard',
      icon: <MdLeaderboard size={20} />,
      href: '/dashboard/teacher/leaderboard',
    },
    {
      name: 'Settings',
      icon: <LuSettings size={20} />,
      href: '/dashboard/teacher/settings',
    },
  ];

  return (
    <div className="flex min-h-screen transition-colors duration-300 bg-slate-50">

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-6 shadow-sm">
        <Logo />
        <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-50 text-red-500 border border-red-100 active:scale-90 transition-all">
          <LuLogOut size={20} />
        </button>
      </div>

      {/* ================= DESKTOP SIDEBAR (Lg screens only) ================= */}
      <aside className="hidden lg:flex w-72 flex-col shadow sticky top-0 h-screen bg-white transition-all">
        <div className="p-8">
          <Logo />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                  ? 'bg-primary text-secondary shadow-lg shadow-primary/20'
                  : 'text-slate-500 hover:bg-primary hover:text-secondary'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${isActive ? 'text-secondary' : 'group-hover:text-secondary transition-colors'}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-bold tracking-tight">
                    {item.name}
                  </span>
                </div>
                {isActive && (
                  <LuChevronRight size={14} className="opacity-50" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mb-4 space-y-2">
          <div className="p-5 border bg-slate-50 rounded-3xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center font-bold shadow-md">
                TQ
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate">
                  Teacher Portal
                </p>
                <p className="text-[10px] text-slate-500 truncate italic">
                  Manage your classes
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-white border-2 border-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 font-bold shadow-sm text-sm"
          >
            <LuLogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= TABLET/MOBILE BOTTOM NAV (Fixed at Bottom) ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2">
        <div className="flex justify-around items-center h-16 mx-auto px-4">
          {menuItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${isActive
                  ? 'text-primary'
                  : 'text-slate-400 hover:text-primary'
                  }`}
              >
                <div
                  className={`transition-transform ${isActive ? 'scale-110' : ''}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-tighter transition-all duration-300 ${isActive ? 'opacity-100 h-auto scale-100' : 'opacity-0 h-0 scale-50 hidden md:block'}`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="pt-20 px-4 md:p-8 lg:p-12 pb-24 lg:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
