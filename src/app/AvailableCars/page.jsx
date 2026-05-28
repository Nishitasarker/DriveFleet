'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ১. হোমপেজের জন্য একটি সংক্ষিপ্ত এবং মিনিমালিস্টিক কার্ড কম্পোনেন্ট
const AvailableCarCard = ({ car }) => {
    const { _id, carName, dailyPrice, carType, imageUrl, availability } = car;

    return (
        <div className="w-full overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between">
            
            {/* ইমেজ সেকশন */}
            <div className="relative h-40 w-full bg-slate-50/50 p-4 flex items-center justify-center">
                <img 
                    src={imageUrl} 
                    alt={carName} 
                    className="w-full h-full object-contain" 
                />
                
                {/* মিনি এভেইলেবিলিটি ডট */}
                <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-600 border border-green-200 shadow-sm">
                    ● {availability}
                </span>
            </div>

            {/* সংক্ষিপ্ত কন্টেন্ট সেকশন */}
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                    {/* কার টাইপ ও প্রাইস রো */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                            {carType}
                        </span>
                        <div className="flex items-baseline">
                            <span className="text-lg font-extrabold text-gray-900">${dailyPrice}</span>
                            <span className="text-xs text-gray-400">/day</span>
                        </div>
                    </div>

                    {/* গাড়ির নাম */}
                    <h3 className="mt-2 text-base font-bold text-gray-800 truncate capitalize">
                        {carName}
                    </h3>
                </div>

                {/* নিট অ্যান্ড ক্লিন ভিউ ডিটেইলস বাটন */}
                <div className="mt-4">
                    <Link href={`/explore-cars/${_id}`} className="block w-full text-center rounded-xl bg-sky-500 hover:bg-sky-600 py-2 text-sm font-semibold text-white transition duration-150 ease-in-out shadow-sm cursor-pointer">
                        View Details
                    </Link>
                </div>
            </div>

        </div>
    );
};

// ২. মেইন এভেইলেবল কার সেকশন কম্পোনেন্ট
const AvailableCars = () => {
    const [availableCars, setAvailableCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvailableCars = async () => {
            try {
                const res = await fetch('http://localhost:5000/destination', { cache: 'no-store' });
                const data = await res.json();
                
                // শুধুমাত্র 'Available' গাড়ি ফিল্টার করা হচ্ছে
                const filtered = data.filter(car => car.availability === 'Available');
                setAvailableCars(filtered);
            } catch (error) {
                console.error("Error fetching available cars:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableCars();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                <span className="ml-3 text-gray-500 text-sm font-medium">Loading available vehicles...</span>
            </div>
        );
    }

    return (
        <section className=" py-16 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Section Header */}
                <div className="text-center mb-10">
                    <span className="text-sky-600 text-xs font-bold uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full">
                        Rent Today
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
                        Available Cars for Rent
                    </h2>
                    <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                        Explore our top-rated fleets waiting for you. Swift booking, pristine condition, and ready to roll.
                    </p>
                </div>

                         {availableCars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                              {availableCars.slice(0, availableCars.length >= 6 ? 6 : availableCars.length).map((car) => (
                            <AvailableCarCard key={car._id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 shadow-sm max-w-md mx-auto">
                        <p className="text-gray-400 text-base font-medium">
                            Sorry, no cars are available at this moment!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AvailableCars;