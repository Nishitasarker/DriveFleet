"use client"

import Link from "next/link"
import Image from "next/image";
import AvailableCars from "../app/AvailableCars/page.jsx"
import FeatureSection from "../app/FeatureSection/page.jsx"
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const activeClass = (path) => 
    pathname === path 
      ? "text-sky-500 font-bold "
      : "text-black";

  return (
    // পুরো পেজকে একটি মেইন রুট div দিয়ে মোড়ানো হয়েছে
    <div className="min-h-screen bg-gray-50">
      
      {/* ১. হিরো সেকশন (ফ্লেক্স লেআউট সহ ব্যাকগ্রাউন্ড) */}
      <div className="flex justify-between flex-col md:flex-row px-6 md:px-20 items-center bg-gradient-to-b from-slate-50 via-sky-50/40 to-white py-12 md:py-20">
        
        {/* টেক্সট কন্টেন্ট */}
        <div className="hero-content text-center md:text-left pt-10 md:pt-0">
          <div className="max-w-md flex flex-col items-center md:items-start justify-center">
            <span className="text-sm uppercase tracking-widest text-sky-500 font-semibold mb-4">
              Welcome to DriveFleet
            </span>
            
            {/* Main Headline */}
            <h1 className="text-3xl md:text-5xl font-extrabold max-w-4xl tracking-tight leading-tight text-gray-900 mb-6">
              Find Your Perfect Ride, <br /> Wherever You Go.
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-gray-600 max-w-2xl mb-8">
              Premium car rentals tailored to your lifestyle. Enjoy instant bookings, transparent pricing, and a diverse fleet built for comfort.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200 font-bold px-8 py-3 rounded-lg shadow-lg shadow-sky-500/20 text-base md:text-base cursor-pointer">
                Rent a Car
              </button>
              <button className="bg-white text-sky-600 border border-sky-500 hover:bg-sky-50 transition-colors duration-200 font-bold px-8 py-3 rounded-lg shadow-md text-sm md:text-base cursor-pointer">
                Explore Cars
              </button>
            </div>      
          </div>
        </div>

        {/* হিরো ইমেজ */}
        <div className="mt-10 md:mt-0 w-full md:w-auto flex justify-center">
          <Image 
            src="/hero.webp"  
            alt="DriveNext Hero" 
            height={500} 
            width={500} 
            priority
            className="object-contain"
          /> 
        </div>
      </div>

         <main className="w-full">
        <AvailableCars />
        <FeatureSection className="py-5"/>
      </main>

    </div>
  );
}