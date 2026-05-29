'use client';
import Link from 'next/link';
import React from 'react';

const ExploreCarCard = ({ car }) => {
  const { 
    _id, 
    carName, 
    dailyPrice, 
    carType, 
    seatCapacity, 
    imageUrl, 
    pickupLocation, 
    availability, 
    description 
  } = car;

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      
      {/* Image Section */}
      <div className="relative h-48 w-full bg-sky-50 py-2 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={carName} 
          className="w-full h-full object-contain" 
        />
        
        {/* Availability Badge */}
        <span className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
          availability === 'Available' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          ● {availability}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Type & Price Row */}
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            {carType}
          </span>
          <div className="flex items-baseline">
            <span className="text-xl font-extrabold text-gray-900">${dailyPrice}</span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
        </div>

        {/* Car Name */}
        <h3 className="mt-3 text-lg font-bold text-gray-800 capitalize">
          {carName}
        </h3>

        {/* Description */}
        {/* <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {description}
        </p> */}

        {/* Features Grid */}
        <div className="my-4 grid grid-cols-2 gap-3 border-t border-b border-gray-100 py-3 text-sm text-gray-600">
          {/* Seats */}
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{seatCapacity} Seats</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="capitalize">{pickupLocation}</span>
          </div>
        </div>

        {/* Action Button */}
       <Link href={`/ExploreCar/${_id}`}>
       <button className="w-full rounded-xl bg-blue-600 py-2.5 text-center text-base font-semibold text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 cursor-pointer">
         Car Details
        </button></Link> 
      </div>

    </div>
  );
};

export default ExploreCarCard;