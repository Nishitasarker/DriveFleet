import React from 'react';
import ExploreCarCard from '../../components/ExploreCarCard'; // আপনার সঠিক পাথ অনুযায়ী ইম্পোর্ট করুন

const ExploreCar = async () => {
    // Next.js সার্ভার কম্পোনেন্টে সরাসরি ফেচ করা হচ্ছে
    const res = await fetch('http://localhost:5000/destination', { cache: 'no-store' });
    const cars = await res.json();

    console.log(cars);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Explore Cars</h1>

            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {
                    cars.map(car => (
                        <ExploreCarCard key={car._id} car={car} /> // key ফিক্স করা হয়েছে
                    ))
                }
            </div>
        </div>
    );
};

export default ExploreCar;