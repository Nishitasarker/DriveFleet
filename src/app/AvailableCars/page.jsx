'use client';

import React, { useState, useEffect } from 'react';
import ExploreCarCard from '../../components/ExploreCarCard';
const AvailableCars = () => {
    const [availableCars, setAvailableCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAvailableCars = async () => {
            try {
                const res = await fetch('http://localhost:5000/destination', { cache: 'no-store' });
                const data = await res.json();
                
                // শুধুমাত্র যে গাড়িগুলো 'Available' সেগুলো ফিল্টার করা হচ্ছে
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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 font-medium">Loading available cars...</span>
            </div>
        );
    }

    return (
        <section className="bg-gray-50 py-16 px-4 sm:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-blue-600 text-sm font-bold uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                        Rent Today
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                        Available Cars for Rent
                    </h2>
                    <p className="text-gray-600 mt-3 max-w-xl mx-auto">
                        Choose from our top-rated fleets that are fully prepared and ready for your next journey right away.
                    </p>
                </div>

                {/* Grid Layout - Minimum 6 cards or message if less */}
                {availableCars.length >= 6 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {availableCars.slice(0, 6).map((car) => (
                            <ExploreCarCard key={car._id} car={car} />
                        ))}
                    </div>
                ) : availableCars.length > 0 ? (
                    <div>
                        {/* যদি ডাটাবেজে ৬টার কম এভেইলেবল গাড়ি থাকে, তবে যেগুলো আছে সব দেখাবে */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {availableCars.map((car) => (
                                <ExploreCarCard key={car._id} car={car} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center bg-white border border-gray-100 rounded-2xl p-12 shadow-sm">
                        <p className="text-gray-500 text-lg font-medium">
                            Sorry, no cars are available at this moment!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AvailableCars;