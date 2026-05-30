"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// 🚀 লজিক্যাল ফিক্স: Better Auth এর অফিশিয়াল ক্লায়েন্ট মেথড (অথবা আপনার কাস্টম ক্লায়েন্ট ইমপোর্ট)
// সাধারণত Better Auth প্রজেক্টে authClient বা direct fetch দিয়ে সেশন নেওয়া হয়।
// কোনো এক্সট্রা প্যাকেজ ঝামেলা এড়াতে আমরা সরাসরি উইন্ডো বা ইউনিভার্সাল ফেচ দিয়ে সেশন রিড করবো।

const CarDetails = ({ params }) => {
  const [unwrappedParams, setUnwrappedParams] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isOpen, setIsOpen] = useState(false);
  const [driverNeeded, setDriverNeeded] = useState("No");
  const [specialNote, setSpecialNote] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // 🚀 লজিক্যাল ফিক্স: লগইন করা Better Auth ইউজারের সেশন স্টেট
  const [user, setUser] = useState(null); 

  useEffect(() => {
    Promise.resolve(params).then((res) => setUnwrappedParams(res));
    
    // 🚀 Better Auth এর ক্লায়েন্ট সেশন রিয়াল-টাইম ক্যাচ করার সেফ মেথড
    fetch('/api/auth/get-session') 
      .then(async (res) => {
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then(session => {
        // Better Auth সাধারণত session.user অথবা সরাসরি ডাটা অবজেক্টে ইউজার দেয়
        if (session?.user) {
          setUser(session.user);
        } else if (session?.data?.user) {
          setUser(session.data.user);
        }
      })
      .catch(err => {
        // ফলব্যাক ব্যাকআপ: যদি কাস্টম রাউটে সমস্যা থাকে, মূল সেশন চেক
        fetch('/api/auth/session')
          .then(async (r) => { const t = await r.text(); return t ? JSON.parse(t) : null; })
          .then(s => { if(s?.user) setUser(s.user); })
          .catch(e => console.log("Session sync silently skipped."));
      });
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams?.id) return;

    fetch(`http://localhost:5000/destination/${unwrappedParams.id}`)
      .then(async (res) => {
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then((data) => {
        if (data) {
          setCar(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [unwrappedParams]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-sm font-semibold bg-white px-4 py-2 rounded-lg shadow-sm">
          Car details could not be loaded!
        </p>
      </div>
    );
  }

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

  const handleBookingConfirm = async () => {
    // 🚀 ডেভেলপমেন্ট পিরিয়ডে সেশন লকিং আটকাতে অটো-ডিটেক্ট বা ফলব্যাক মেল প্রোটেকশন
    if (!user || !user.email) {
      toast.error("Please login first to book a car!");
      return;
    }

    if (!specialNote.trim()) {
      toast.error("Please fill up the Special Instructions / Notes field!");
      return;
    }

    setBookingLoading(true);

    const bookingData = {
       userId: user?.id || "authenticated_user", 
       userEmail: user.email.trim().toLowerCase(), // আপনার লগইন করা কন্টিনিউয়াস ইমেইল
       carId: _id,
       carName: carName,
       carImage: imageUrl,
       carPrice: dailyPrice,
       carType: carType,
       driverNeeded: driverNeeded, 
       specialNote: specialNote,   
       bookedAt: new Date().toISOString() 
    };
   
    try {
      const res = await fetch('http://localhost:5000/booking', {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : { success: false, message: "Empty server response" };
      
      if (res.status === 400 || data.success === false) {
        toast.error(data.message || "You have already booked this car!");
        setIsOpen(false);
        return;
      }

      if (data.insertedId || data.success) {
        toast.success(`Success! You have successfully booked the ${carName}.`);
        setIsOpen(false); 
        setSpecialNote(""); 
        setDriverNeeded("No");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to the server.");
    } finally {
      setBookingLoading(false);
    }
  };

  const isAvailable = availability === 'Available' || availability === true;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 relative">
      <h2 className="text-3xl font-bold text-[#1e293b] mb-6 self-start max-w-sm mx-auto w-full flex justify-center items-center">
        {carName} - Details
      </h2>

      <div className="w-full max-w-md bg-slate-50/50 rounded-2xl shadow-[5px_5px_30px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden p-4 space-y-4">
        
        <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden relative">
          <img 
            src={imageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600"} 
            alt={carName} 
            className="w-full h-full object-cover object-center"
          />
        </div>

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
          <p className="text-base font-medium text-gray-600">
            {carType} / {seatCapacity}-Seater
          </p>
        </div>

        <div className="pt-2 border-t-2 border-gray-200 ">
          <p className="text-md text-gray-500 leading-relaxed line-clamp-2" title={description}>
            {description || "Experience the premium drive."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t-2 border-gray-200">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Pickup: <span className="font-normal text-gray-600">{pickupLocation || "Downtown SF"}</span>
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Status:{' '}
              <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                {isAvailable ? 'Available' : 'Rent Out'}
              </span>
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button 
            onClick={() => setIsOpen(true)}
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 relative z-10">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800">Confirm Your Booking</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-base font-semibold text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
              <p className="col-span-2 text-lg text-slate-800 font-bold border-b border-slate-200/60 pb-1 mb-1">{carName}</p>
              <p>💰 Price: <span className="font-normal text-slate-700">${dailyPrice}/day</span></p>
              <p>👥 Capacity: <span className="font-normal text-slate-700">{seatCapacity} Seats</span></p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Do you need a driver?</label>
                <select 
                  value={driverNeeded}
                  onChange={(e) => setDriverNeeded(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm"
                >
                  <option value="No">No, I will drive myself</option>
                  <option value="Yes">Yes, I need a driver</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Special Instructions <span className="text-red-500">*</span></label>
                <textarea 
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Any specific instructions..."
                  rows={3}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-3 border-t border-slate-100">
              <button onClick={() => setIsOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl">Cancel</button>
              <button disabled={bookingLoading} onClick={handleBookingConfirm} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl disabled:bg-blue-300">
                {bookingLoading ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;