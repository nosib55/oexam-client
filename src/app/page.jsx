"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { LuActivity, LuFlame, LuStar, LuTrophy } from "react-icons/lu";

import About from "@/components/home/About/About";
import Hero from "@/components/home/Hero/Hero";
import HowItWorks from "@/components/home/HowItWorks/HowItWorks";
import Services from "@/components/home/Hero/Services";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import Pricing from "@/components/home/Pricing/Pricing";
import Features from "@/components/home/Feature/Features";
import Commitment from "@/components/home/Commitment/Commitment";
import FAQ from "@/components/home/FAQ/FAQ";
import Testimonials from "@/components/home/Testimonials/Testimonials";
import Integration from "@/components/home/Integration/Integration";
import StatsSection from "@/components/home/States/States";
import NewsletterCTA from "@/components/home/NewsletterCTA/NewsletterCTA";

// Dynamic Dashboard Components
import StudentDashboard from "@/app/dashboard/student/page";
import TeacherPage from "@/app/dashboard/teacher/page";
import AdminDashboard from "@/app/dashboard/admin/page";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          const res = await axios.get("/api/auth/me");
          if (res.data) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch (error) {
          console.error("Error fetching user for homepage dynamic view", error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // While checking auth, we optionally can render the hero with a loading state,
  // or just render nothing to prevent layout shift. But showing the static Home briefly is also fine.
  // We'll return just a minimal loader or keep it simple.
  if (loading) {
    return (
      <div className="">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="">
      <Navbar />
      <main className="overflow-x-hidden">
        {user ? (
          <div className="py-6 min-h-screen bg-slate-50">
            {/* Dynamic Home Page Hub */}
            <div className="max-w-[1400px] mx-auto px-4 lg:px-6 mb-10">
              {/* Personalized Homepage Welcome Component */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-[400px] h-[400px] bg-white/10 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-1000 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20 backdrop-blur-sm shadow-sm ring-1 ring-white/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>{" "}
                      Live Session
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                      Welcome to your <br /> customized hub,{" "}
                      {(user.name || "").split(" ")[0]}!
                    </h2>
                    <p className="text-white/80 font-medium text-sm md:text-base leading-relaxed">
                      {user.role === "student" &&
                        "Ready to continue your learning journey? Check your upcoming exams and latest performance metrics inside your student workspace below."}
                      {user.role === "teacher" &&
                        "Your instructor workspace is fully configured. You have new activity streams to review in your active courses."}
                      {user.role === "admin" &&
                        "System operations are stable. Use the dashboard below to review the latest institutional audits, network health, and operational logs."}
                    </p>
                  </div>

                  {/* Quick Action Navigation */}
                  <div className="flex flex-col sm:flex-row gap-3 min-w-max">
                    {user.role === "student" && (
                      <>
                        <Link
                          href="/dashboard/student/my_exam"
                          className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-blue-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-lg active:scale-95"
                        >
                          <LuTrophy size={16} /> Enter Arena
                        </Link>
                        <Link
                          href="/dashboard/student/settings"
                          className="flex items-center justify-center px-6 py-4 bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm active:scale-95"
                        >
                          Edit Profile
                        </Link>
                      </>
                    )}
                    {user.role === "teacher" && (
                      <>
                        <Link
                          href="/dashboard/teacher/exams/new"
                          className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-blue-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-lg active:scale-95"
                        >
                          <LuActivity size={16} /> New Exam
                        </Link>
                        <Link
                          href="/dashboard/teacher/results"
                          className="flex items-center justify-center px-6 py-4 bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm active:scale-95"
                        >
                          Submissions
                        </Link>
                      </>
                    )}
                    {user.role === "admin" && (
                      <>
                        <Link
                          href="/dashboard/admin/institutions"
                          className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-blue-600 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-lg active:scale-95"
                        >
                          System Config
                        </Link>
                        <Link
                          href="/dashboard/admin/settings"
                          className="flex items-center justify-center px-6 py-4 bg-white/10 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm active:scale-95"
                        >
                          Platform Health
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {user.role === "student" && <StudentDashboard />}
            {user.role === "teacher" && <TeacherPage />}
            {user.role === "admin" && <AdminDashboard />}
          </div>
        ) : (
          <>
            {/* banner to create first impression */}
            <Hero />

            {/* why we? */}
            <Features />
            <About />

            {/* useing system & service */}
            <HowItWorks />
            <Services />

            {/* Trust */}
            <Integration />

            {/* Decision */}
            <Testimonials />

            {/* support and closing */}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
