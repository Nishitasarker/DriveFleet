"use client"

import Link from "next/link"
import Image from "next/image";
// import FeatureData from "../app/FeatureData/page.jsx"
// import ExtraSection from "../app/ExtraSections/page.jsx"
import { usePathname} from "next/navigation";


export default function Home() {
  const pathname = usePathname();
   const activeClass = (path) => 
    pathname === path 
      ? "text-sky-500 font-bold "
      : "text-black";
  return (
      <div className="flex justify-between flex-col md:flex-row px-6 md:px-20 bg-gradient-to-b from-slate-50 via-sky-50/40 to-white">
   
   

  <div className="hero-content text-neutral-content text-center pt-25">
    <div className="max-w-md flex flex-col items-center justify-center">
      <span className="text-sm uppercase tracking-widest text-sky-400 font-semibold mb-4">
    Welcome to DriveFleet
  </span>
  
  {/* Main Headline */}
  <h1 className="text-3xl md:text-4xl font-extrabold max-w-4xl tracking-tight leading-none mb-6">
    Find Your Perfect Ride, <br /> Wherever You Go.
  </h1>
  
  {/* Subtitle */}
  <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-8">
    Premium car rentals tailored to your lifestyle. Enjoy instant bookings, transparent pricing, and a diverse fleet built for comfort.
  </p>
  
  {/* CTA Buttons */}
  <div className="flex flex-wrap gap-4 justify-center">
    <button className="bg-sky-400 text-gray-100 hover:bg-sky-200 transition-colors duration-200 font-bold px-8 py-3 rounded-lg shadow-lg shadow-sky-500/20 text-sm md:text-base">Book A Ride</button>
    <button className="bg-sky-400 text-gray-100 hover:bg-sky-200 transition-colors duration-200 font-bold px-8 py-3 rounded-lg shadow-lg shadow-sky-500/20 text-sm md:text-base">Explore Cars</button>
  </div>      
      
    </div>
  </div>

     <Image src="/hero.webp"  alt="DriveNext Logo" height={500} width={500} priority/> 

</div>

// {/* <FeatureData/>
// <ExtraSection/> */}
//     </div>
  );
};
 