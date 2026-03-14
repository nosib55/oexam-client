'use client';
import Logo from '@/components/shared/Logo/Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LuBookOpen,
  LuTrophy,
  LuCalendar,
  LuSettings,
  LuLayoutDashboard,
  LuChevronRight,
} from 'react-icons/lu';

export default function StudentLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LuLayoutDashboard size={20} />,
      href: '/dashboard/student',
    },
    {
      name: 'My Exams',
      icon: <LuBookOpen size={20} />,
      href: '/dashboard/student/my_exam',
    },
    {
      name: 'Results',
      icon: <LuTrophy size={20} />,
      href: '/dashboard/student/my_result',
    },
    {
      name: 'Schedule',
      icon: <LuCalendar size={20} />,
      href: '/dashboard/student/my_schedule',
    },
    {
      name: 'Settings',
      icon: <LuSettings size={20} />,
      href: '/dashboard/student/settings',
    },
  ];

  return (
    <div className="flex min-h-screen transition-colors duration-300 bg-slate-50">
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
                className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive
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

        <div className="p-5 border mx-4 mb-4 bg-slate-50 rounded-3xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center font-bold shadow-md">
              ST
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">
                MRB RAFI
              </p>
              <p className="text-[10px] text-slate-500 truncate italic">
                Active Learner
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= TABLET/MOBILE BOTTOM NAV (Fixed at Bottom) ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {menuItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${
                  isActive
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
                  className={`text-[10px] font-bold tracking-tighter ${isActive ? 'opacity-100' : 'opacity-70'}`}
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
        {/* Added padding bottom on mobile so content isn't hidden by the nav */}
        <div className="p-4 md:p-8 lg:p-12 pb-24 lg:pb-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}