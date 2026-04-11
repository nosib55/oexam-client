"use client";

import About from "@/components/home/About/About";
import Hero from "@/components/home/Hero/Hero";
import HowItWorks from "@/components/home/HowItWorks/HowItWorks";
import Services from "@/components/home/Hero/Services";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import Features from "@/components/home/Feature/Features";
import Testimonials from "@/components/home/Testimonials/Testimonials";
import Integration from "@/components/home/Integration/Integration";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <main className="overflow-x-hidden">
        {/* banner to create first impression */}
        <Hero />

        {/* why we? */}
        <Features />
        <About />

        {/* using system & service */}
        <HowItWorks />
        <Services />

        {/* Trust */}
        <Integration />

        {/* Decision */}
        <Testimonials />

        {/* support and closing */}
      </main>
      <Footer />
    </div>
  );
}
