import { Button } from '@heroui/react';
import React from 'react';
import { BiEdit } from 'react-icons/bi';

const CarDetails = async ({ params }) => {
  const { id } = await params;

  // ব্যাকএন্ড থেকে নির্দিষ্ট গাড়ির ডেটা ফেচ করা
  const res = await fetch(`http://localhost:5000/destination/${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-sm font-semibold bg-white px-4 py-2 rounded-lg shadow-sm">
          Car details could not be loaded!
        </p>
      </div>
    );
  }

  const car = await res.json();

  const { 
    carName, 
    dailyPrice, 
    carType, 
    seatCapacity, 
    imageUrl, 
    pickupLocation, 
    availability, 
    description 
  } = car;

  const isAvailable = availability === 'Available' || availability === true;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6">
      
      {/* পেজের মেইন টাইটেল */}
      <h2 className="text-3xl font-bold text-[#1e293b] mb-6 self-start max-w-sm mx-auto w-full flex justify-center items-center">
        {carName} - Details
      </h2>

      {/* কমপ্যাক্ট প্রফেশনাল কার্ড */}
      <div className="w-full max-w-md bg-slate-50/50 rounded-2xl shadow-[5px_5px_30px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden p-4 space-y-4">
        
        {/* ইমেজ সেকশন (ফিক্সড রেশিও ও সাইজ) */}
        <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600"} 
            alt={carName} 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* কার ইনফো (নাম ও প্রাইস এক লাইনে) */}
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              {carName}
            </h1>
            <div className="text-right shrink-0">
              <span className="text-2xl font-bold text-gray-900">${dailyPrice}</span>
              <span className="text-gray-400 text-xs block font-medium">/ Day</span>
            </div>
          </div>
          
          {/* টাইপ এবং সিট ক্যাপাসিটি */}
          <p className="text-base font-medium text-gray-600">
            {carType} / {seatCapacity}-Seater
          </p>
          <span className="text-sm block text-gray-400 font-mono -mt-0.5">
            carType / seatCapacity, 14px
          </span>
        </div>

        <div className="pt-2 border-t-2 border-gray-200 ">
          <p className="text-md text-gray-500 leading-relaxed line-clamp-2" title={description}>
            {description || "Experience the premium drive. Perfect for city driving, long trips, and business travels."}
          </p>
        </div>

        {/* পিকআপ ও স্ট্যাটাস গ্রিড */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t-2 border-gray-200">
          {/* পিকআপ লোকেশন */}
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Pickup: <span className="font-normal text-gray-600">{pickupLocation || "Downtown SF"}</span>
            </p>
            <span className="text-sm block text-gray-400 font-normal mt-0.5">
              📍 pickupLocation, 13px
            </span>
          </div>

          {/* স্ট্যাটাস */}
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Status:{' '}
              <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                {isAvailable ? 'Available' : 'Rent Out'}
              </span>
            </p>
            <span className="text-sm block text-gray-400 font-normal mt-0.5">
              🟢 availability, 13px
            </span>
          </div>
        </div>
   
   {/* edit and delete button */}

   {/* <div>
    <Button variant="outline"  className={"flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-300 text-white font-medium rounded-xl transition-all"}><BiEdit/>  Edit</Button>
   </div> */}



        {/* booking button */}


        <div className="pt-2">
          <button 
            disabled={!isAvailable}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-center text-white transition-all duration-150 ${
              isAvailable
                ? 'bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.99] shadow-sm' 
                : 'bg-gray-300 cursor-not-allowed shadow-none'
            }`}
          >
            Book Now
          </button>
        </div>

      </div>

      {/* রাইট সাইড ডেসক্রিপশন (কার্ডের নিচে বা পাশে সুন্দর টেক্সট) */}
      {/* <div className="w-full max-w-sm mt-6 text-gray-500 text-xs leading-relaxed text-center px-2">
        <p>
          {description || "Experience the premium drive. Perfect for city driving, long trips, and business travels."}
        </p>
      </div> */}

    </div>
  );
};

export default CarDetails;