'use client';

import React, { useState, useEffect } from 'react';
import ExploreCarCard from '../../components/ExploreCarCard'; // আপনার সঠিক পাথ অনুযায়ী রাখুন

const ExploreCar = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [searchType, setSearchType] = useState('');
    const [sortByPrice, setSortByPrice] = useState('');
    const [loading, setLoading] = useState(true);

    // API থেকে ডেটা ফেচ করা
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await fetch('http://localhost:5000/destination', { cache: 'no-store' });
                const data = await res.json();
                setCars(data);
                setFilteredCars(data); // শুরুতে সব গাড়ি দেখাবে
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    
    useEffect(() => {
        let updatedCars = [...cars];

      
        if (searchType.trim() !== '') {
            updatedCars = updatedCars.filter(car =>
                car.carType.toLowerCase().includes(searchType.toLowerCase())
            );
        }

        
        if (sortByPrice === 'lowToHigh') {
            updatedCars.sort((a, b) => a.dailyPrice - b.dailyPrice);
        } else if (sortByPrice === 'highToLow') {
            updatedCars.sort((a, b) => b.dailyPrice - a.dailyPrice);
        }

        setFilteredCars(updatedCars);
    }, [searchType, sortByPrice, cars]);

    if (loading) {
        return <div className="text-center p-10 font-semibold text-lg">Loading Cars...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Explore Cars</h1>

            {/* --- Search and Filter Section --- */}
            <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Search by Car Type */}
                <div className="flex flex-col">
                    <label className="mb-4 text-xl font-medium text-gray-500 ml-3">Search by Car Type</label>
                    <input
                        type="text"
                        placeholder="e.g. Suv, Hatchback, Sedan, Luxury"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    />
                </div>

                {/* Sort by Price */}
                <div className="flex flex-col">
                    <label className="mb-4 text-xl font-medium text-gray-500 ml-3">Sort by Price</label>
                    <select
                        value={sortByPrice}
                        onChange={(e) => setSortByPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm cursor-pointer"
                    >
                        <option value="">Default (No Sorting)</option>
                        <option value="lowToHigh">Price: Low to High</option>
                        <option value="highToLow">Price: High to Low</option>
                    </select>
                </div>

            </div>
            {/* ---------------------------------- */}

            {/* Responsive Grid Layout */}
            {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {filteredCars.map(car => (
                        <ExploreCarCard key={car._id} car={car} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-12 text-lg">
                    No cars found matching your criteria.
                </div>
            )}
        </div>
    );
};

export default ExploreCar;