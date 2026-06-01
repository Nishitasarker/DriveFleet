'use client';

import React, { useState, useEffect } from 'react';
import ExploreCarCard from '../../components/ExploreCarCard';

const ExploreCar = () => {
    const [cars, setCars] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortByPrice, setSortByPrice] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchName) params.append('search', searchName);
                if (selectedType) params.append('carType', selectedType);

                const res = await fetch(`http://localhost:5000/destination?${params.toString()}`, { cache: 'no-store' });
                const data = await res.json();
                setCars(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching cars:", error);
                setCars([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [searchName, selectedType]);

    const sortedCars = [...cars].sort((a, b) => {
        if (sortByPrice === 'lowToHigh') return a.dailyPrice - b.dailyPrice;
        if (sortByPrice === 'highToLow') return b.dailyPrice - a.dailyPrice;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Explore Cars</h1>

            <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Search by Car Name */}
                <div className="flex flex-col">
                    <label className="mb-4 text-xl font-medium text-gray-500 ml-3">Search by Car Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Tesla, BMW, Toyota..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    />
                </div>

                {/* Filter by Car Type */}
                <div className="flex flex-col">
                    <label className="mb-4 text-xl font-medium text-gray-500 ml-3">Filter by Car Type</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm cursor-pointer"
                    >
                        <option value="">All Types</option>
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Luxury">Luxury</option>
                       
                    </select>
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

            {loading ? (
                <div className="text-center p-10 font-semibold text-lg">Loading Cars...</div>
            ) : sortedCars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {sortedCars.map(car => (
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