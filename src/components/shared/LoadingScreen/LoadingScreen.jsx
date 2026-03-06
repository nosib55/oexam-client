'use client';

import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [scrambledText, setScrambledText] = useState('EXAMINERLY');
  const [statusIndex, setStatusIndex] = useState(0);
  const [fadeStatus, setFadeStatus] = useState(false);

  const finalText = 'EXAMINERLY';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%';
  const steps = [
    'Initializing System Modules...',
    'Authenticating Candidate...',
    'Loading Question Database...',
    'Applying Security Checks...',
    'Preparing Interface...',
  ];

  useEffect(() => {
    const scramble = () => {
      let iteration = 0;
      const interval = setInterval(() => {
        setScrambledText(
          finalText
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return finalText[index];
              }
              return letters[Math.floor(Math.random() * letters.length)];
            })
            .join(''),
        );

        if (iteration >= finalText.length) {
          clearInterval(interval);
        }
        iteration += 0.5;
      }, 40);
    };

    scramble();
    const scrambleInterval = setInterval(scramble, 3500);

    const statusInterval = setInterval(() => {
      setFadeStatus(true);
      setTimeout(() => {
        setStatusIndex(prev => (prev + 1) % steps.length);
        setFadeStatus(false);
      }, 300);
    }, 1200);

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#010205] text-primary overflow-hidden font-mono select-none">
      {/* --- Crisp & Sharp Scanlines (No Dirty Shadow) --- */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-60"
        style={{
          // আপনার প্রাইমারি কালার #004aad কে rgba(0, 74, 173) এ কনভার্ট করে সাবটল গ্রিড তৈরি করেছি
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0, 74, 173, 0.05) 0px, rgba(0, 74, 173, 0.05) 1px, transparent 1px, transparent 4px)`,
        }}
      ></div>

      <div className="text-center relative z-20 px-4">
        {/* Scramble Heading in Primary Color with Subtle Glow */}
        <h1
          className="text-5xl md:text-7xl font-black tracking-[0.2em] mb-8 min-h-[1.2em] transition-all"
          style={{
            color: '#004aad', // সরাসরি প্রাইমারি কালার
            textShadow:
              '0 0 15px rgba(0, 74, 173, 0.5), 0 0 30px rgba(0, 74, 173, 0.15)',
          }}
        >
          {scrambledText}
        </h1>

        {/* Status Message in Primary Color (Hiding on Mobile for Cleaner Look) */}
        <div
          className={`hidden md:block text-xs font-bold uppercase tracking-[0.3em] mb-12 h-6 transition-all duration-300 ${
            fadeStatus ? 'opacity-0 -translate-y-2' : 'opacity-80 translate-y-0'
          }`}
          style={{ color: '#004aad' }}
        >
          {steps[statusIndex]}
        </div>

        {/* Optimized Digital Dot Progress Indicator */}
        <div className="flex justify-center gap-6 pt-4 md:pt-0">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full animate-terminal-bounce"
              style={{
                backgroundColor: '#004aad',
                boxShadow: '0 0 10px rgba(0, 74, 173, 0.7)', // কালার সিনকড শ্যাডো
                animationDelay: `${i * 0.15}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Deep Monitor Vignette for Authenticity */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.95)] z-30"></div>

      {/* Floating Cyber Glow from Bottom */}
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#004aad]/15 blur-[120px] rounded-full pointer-events-none z-20"></div>
    </div>
  );
};

export default LoadingScreen;
