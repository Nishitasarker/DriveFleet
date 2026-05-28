import React, { useState } from 'react';

const QualitySection = () => {
  // একটি স্টেট দিয়ে ট্র্যাক করা হচ্ছে কোন ট্যাবটি অ্যাক্টিভ আছে
  const [activeTab, setActiveTab] = useState('luxury');

  // ট্যাবগুলোর ডাটা অবজেক্ট
  const tabData = {
    luxury: {
      text: "We offer a meticulously curated collection of the most sought-after luxury vehicles on the market. Whether you prefer the sporty allure of a high-performance sports car, the sophistication of a sleek and luxurious sedan, or the versatility of a premium SUV, we have the perfect car to match your discerning taste.",
    },
    comfort: {
      text: "We prioritize your comfort and convenience throughout your journey. We understand that a comfortable ride can make a world of difference, whether you're embarking on a business trip or enjoying a leisurely vacation. That's why we offer a wide range of well-maintained, comfortable cars that cater to your specific needs.",
    },
    prestige: {
      text: "We understand that prestige goes beyond luxury. It's about making a statement, embracing sophistication, and indulging in the finer things in life. That's why we offer an exclusive selection of prestigious cars that exude elegance, style, and status.",
    },
  };

  return (
    <section className="min-h-screen w-full bg-slate-50 flex items-center justify-center py-12 px-4 md:px-8">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-sm overflow-hidden">
        
        {/* বাম দিকের ইমেজ সেকশন */}
        <div className="relative w-full h-[350px] md:h-[500px] lg:h-[600px]">
          <img 
            src="/Quality.jpg" // আপনার ইমেজের সঠিক পাথ এখানে দিন
            alt="Clients in a car" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-6 left-6 bg-blue-600 text-white font-bold text-xl w-14 h-14 rounded-full flex items-center justify-center shadow-md">
            $25
          </div>
        </div>

        <div className="p-6 md:p-12 lg:p-16 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f172a] mb-8">
            Only Quality For Clients
          </h2>

         
          <div className="flex flex-wrap gap-3 mb-8">
            {['luxury', 'comfort', 'prestige'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-xs md:text-sm font-bold tracking-wider uppercase rounded-md transition-all duration-300 shadow-sm ${
                  activeTab === tab
                    ? 'bg-sky-500 text-white scale-105' // অ্যাক্টিভ বাটনের স্টাইল
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100' // ইন-অ্যাক্টিভ বাটনের স্টাইল
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

         
          <div className="min-h-[150px] transition-all duration-500">
            <p className="text-slate-600 text-base md:text-lg leading-relaxed antialiased">
              {tabData[activeTab].text}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default QualitySection;