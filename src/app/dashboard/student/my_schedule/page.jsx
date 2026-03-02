"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaVideo, FaDownload, FaPrint } from "react-icons/fa";

export default function MySchedule() {
  const schedule = [
    { id: 1, title: "Mathematics", type: "Lecture", time: "09:00 AM - 11:00 AM", location: "Room 101", day: "Monday" },
    { id: 2, title: "General Science", type: "Lab", time: "01:00 PM - 03:00 PM", location: "Science Lab", day: "Monday" },
    { id: 3, title: "English Language", type: "Tutorial", time: "10:30 AM - 12:00 PM", location: "Room 302", day: "Tuesday" },
    { id: 4, title: "History & Civics", type: "Lecture", time: "02:00 PM - 04:00 PM", location: "Hall A", day: "Wednesday" },
    { id: 5, title: "Geography", type: "Seminar", time: "11:00 AM - 01:00 PM", location: "Online (Zoom)", day: "Thursday" },
    { id: 6, title: "Physical Education", type: "Practice", time: "09:00 AM - 12:00 PM", location: "Playground", day: "Friday" },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content tracking-tight">Academic Schedule</h1>
          <p className="text-base-content/60 font-medium mt-1">Your weekly classes and examination timetable overview</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline btn-primary btn-sm rounded-xl gap-2 font-black text-xs uppercase">
            <FaPrint /> Print
          </button>
          <button className="btn btn-primary btn-sm rounded-xl shadow-lg shadow-primary/20 gap-2 font-black text-xs uppercase">
            <FaDownload /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
        {days.map((day, idx) => (
          <motion.div 
            key={day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/10 text-center">
               <span className="font-black text-xs uppercase tracking-[0.2em] text-white underline decoration-white/30 underline-offset-4">{day}</span>
            </div>
            
            <div className="space-y-4">
              {schedule.filter(s => s.day === day).map((item, i) => (
                <div key={item.id} className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-sm hover:shadow-xl hover:border-primary/20 hover:scale-[1.02] transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[3rem] -mr-4 -mt-4 group-hover:bg-primary/10 transition-colors"></div>
                   
                   <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1.5">{item.type}</p>
                   <h4 className="font-extrabold text-base-content group-hover:text-primary transition-colors leading-tight mb-4">{item.title}</h4>
                   
                   <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 text-[10px] font-bold text-base-content/50 uppercase tracking-tighter">
                         <div className="p-1.5 bg-base-200 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <FaClock />
                         </div>
                         {item.time}
                      </div>
                      <div className="flex items-center gap-2.5 text-[10px] font-bold text-base-content/50 uppercase tracking-tighter">
                         <div className="p-1.5 bg-base-200 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {item.location.includes('Online') ? <FaVideo className="text-success" /> : <FaMapMarkerAlt />}
                         </div>
                         {item.location}
                      </div>
                   </div>
                </div>
              ))}
              {schedule.filter(s => s.day === day).length === 0 && (
                <div className="bg-base-200/20 border-2 border-dashed border-base-300 p-12 rounded-2xl flex flex-col items-center justify-center opacity-40">
                    <span className="text-[10px] font-black text-base-content uppercase tracking-[0.3em]">No Session</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
