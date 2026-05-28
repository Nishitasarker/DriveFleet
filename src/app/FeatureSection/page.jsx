import React from 'react';
import { BsPatchCheckFill } from "react-icons/bs";

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-sky-50 via-slate-50 to-white text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* হেডার অংশ */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E43] mb-4">
            Our Features
          </h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg sm:text-base">
            Discover a world of convenience, safety, and customization, paving the 
            way for unforgettable adventures and seamless mobility solutions.
          </p>
        </div>

        {/* মেইন কন্টেন্ট গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* বাম পাশের ফিচারসমূহ */}
          <div className="space-y-10 order-2 lg:order-1 text-left">
            {/* ফিচার ১ */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-blue-600 p-3 rounded-xl shadow-md text-white">
                {/* Trophy Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1E43] mb-1">First class services</h3>
                <p className="text-gray-500 font-medium text-base leading-relaxed">
                  Where luxury meets exceptional care, creating unforgettable moments and exceeding your every expectation.
                </p>
              </div>
            </div>

            {/* ফিচার ২ */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-blue-600 p-3 rounded-xl shadow-md text-white">
                {/* Road/Assistance Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1E43] mb-1">24/7 road assistance</h3>
                <p className="text-gray-500 font-medium text-base leading-relaxed">
                  Reliable support when you need it most, keeping you on the move with confidence and peace of mind.
                </p>
              </div>
            </div>
          </div>

          {/* মাঝখানের গাড়ির ছবি */}
          <div className="order-1 lg:order-2 flex justify-center py-6 lg:py-0">
            <img 
              src="/black-car.png" 
              alt="Toyota Corolla Altis Black" 
              className="max-w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* ডান পাশের ফিচারসমূহ */}
          <div className="space-y-10 order-3 text-left lg:text-left">
            {/* ফিচার ৩ */}
            <div className="flex items-start gap-4 lg:flex-row-reverse">
              <div className="flex-shrink-0 bg-blue-600 p-3 rounded-xl shadow-md text-white">
                {/* Price Tag Icon */}
               <BsPatchCheckFill className='h-5 w-5'/>
              </div>
              <div className="lg:text-right">
                <h3 className="text-xl font-bold text-[#0B1E43] mb-1">Quality at Minimum Expense</h3>
                <p className="text-gray-500 text-base font-medium leading-relaxed">
               Where value meets affordable rates, delivering premium features and matching your every financial plan.                 </p>
              </div>
            </div>

            {/* ফিচার ৪ */}
            <div className="flex items-start gap-4 lg:flex-row-reverse">
              <div className="flex-shrink-0 bg-blue-600 p-3 rounded-xl shadow-md text-white">
                {/* Location/Key Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="lg:text-right">
                <h3 className="text-xl font-bold text-[#0B1E43] mb-1">Free Pick-Up & Drop-Off</h3>
                <p className="text-gray-500 text-base font-medium leading-relaxed">
                Where comfort meets doorstep delivery, providing effortless rides and ensuring your absolute peace mind. 
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;