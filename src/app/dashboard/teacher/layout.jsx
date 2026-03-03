'use client';

import Logo from '@/components/shared/Logo/Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LuDatabase,
  LuPlus,
  LuUsers,
  LuChartBar,
  LuSettings,
  LuLayoutDashboard,
  LuChevronRight,
} from 'react-icons/lu';

export default function TeacherLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <LuLayoutDashboard size={18} />,
      href: '/dashboard/teacher',
    },
    {
      name: 'Question Bank',
      icon: <LuDatabase size={18} />,
      href: '/dashboard/teacher/questions',
    },
    {
      name: 'Manage Exams',
      icon: <LuPlus size={18} />,
      href: '/dashboard/teacher/exams',
    },
    {
      name: 'Student List',
      icon: <LuUsers size={18} />,
      href: '/dashboard/teacher/students',
    },
    {
      name: 'Results & Grading',
      icon: <LuChartBar size={18} />,
      href: '/dashboard/teacher/results',
    },
    {
      name: 'System Settings',
      icon: <LuSettings size={18} />,
      href: '/dashboard/teacher/settings',
    },
  ];

  return (
    // "dark" class apply korle background automatic slate-950 hoye jabe
    <div className="flex min-h-screen transition-colors duration-300">
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden lg:flex w-72 flex-col shadow sticky top-0 h-screen bg-white transition-all">
        {/* Brand Logo Area */}
        <div className="p-8">
          <Logo />
        </div>

        {/* Navigation Links */}
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
                    : 'text-slate-500 dark:text-slate-400 hover:bg-primary hover:text-secondary'
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

        {/* User Profile Summary (Bottom) */}
        <div className="p-5 border mx-4 mb-4 bg-slate-50 rounded-3xl transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-secondary flex items-center justify-center font-bold shadow-md">
              TQ
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">
                Team-Examinerly
              </p>
              <p className="text-[10px] text-slate-500 truncate italic">
                examinerly@edu.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
