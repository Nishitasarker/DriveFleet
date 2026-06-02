"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link'; 
// মডার্ন এবং ক্লিন আইকনের জন্য lucide-react ব্যবহার করা হয়েছে
import { 
  Car, 
  Users, 
  MapPin, 
  DollarSign, 
  FileText, 
  Calendar, 
  X, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Home 
} from 'lucide-react';

const CarDetails = ({ params }) => {
  const [unwrappedParams, setUnwrappedParams] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [driverNeeded, setDriverNeeded] = useState("No");
  const [specialNote, setSpecialNote] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    Promise.resolve(params).then((res) => {
      console.log("resolved params:", res); 
      setUnwrappedParams(res);
    });
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams?.id) return;

    const fetchCar = async () => {
      try {
        console.log("Fetching token..."); 
        const tokenRes = await fetch("/api/auth/token", { credentials: "include" });
        
        // টোকেন এপিআই যদি কোনো কারণে রেসপন্স না দেয় (HTML বা ৪MD দেয়)
        if (!tokenRes.ok) {
          console.error("Token API failed with status:", tokenRes.status);
          setCar(null); // ৪MD পেজে নিয়ে যাওয়ার জন্য
          return;
        }

        const tokenContentType = tokenRes.headers.get("content-type");
        if (!tokenContentType || !tokenContentType.includes("application/json")) {
          console.error("Expected JSON token, got HTML");
          setCar(null); // ৪MD পেজে নিয়ে যাওয়ার জন্য
          return;
        }

        const { token } = await tokenRes.json();
        console.log("Token received:", !!token); 

        console.log("Fetching car id:", unwrappedParams.id); 
        const res = await fetch(`http://localhost:5000/destination/${unwrappedParams.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Car response status:", res.status); 

        // কার এপিআই রেসপন্স ঠিক না থাকলে (যেমন ভুল আইডি হলে ৫MD বা ৪MD দিলে)
        if (!res.ok) {
          setCar(null);
          return;
        }

        const carContentType = res.headers.get("content-type");
        if (!carContentType || !carContentType.includes("application/json")) {
          console.error("Expected JSON car data, got HTML");
          setCar(null);
          return;
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        
        if (data) {
          setCar(data);
        } else {
          setCar(null);
        }
      } catch (err) {
        console.error("fetchCar error:", err);
        setCar(null); // ক্যাচ ব্লকে এরর খেলেও ৪MD পেজ শো করবে
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [unwrappedParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium text-sm animate-pulse">Loading car details...</p>
      </div>
    );
  }

  // API রেসপন্স না দিলে বা ভুল আইডি হলে এই কাস্টম ৪MD পেজটি দেখাবে
  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full w-32 h-32 mx-auto"></div>
            <div className="relative bg-red-50 text-red-500 p-5 rounded-2xl border border-red-100">
              <AlertCircle className="w-14 h-14" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-300 tracking-tight">404</h1>
            <h2 className="text-xl font-bold text-slate-800">Car Not Found!</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sorry, the vehicle you are looking for doesn't exist, server is offline, or might have been removed.
            </p>
          </div>

          <div className="pt-2">
            <Link 
              href="/ExploreCar" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              Back to Showroom
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { 
    _id, carName, dailyPrice, carType, 
    seatCapacity, imageUrl, pickupLocation, 
    availability, description 
  } = car;

  const handleBookingConfirm = async () => {
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
      userId: user?.id,
      userEmail: user.email.trim().toLowerCase(),
      carId: _id,
      carName,
      carImage: imageUrl,
      carPrice: dailyPrice,
      carType,
      driverNeeded,
      specialNote,
      bookedAt: new Date().toISOString()
    };
   
    try {
      const tokenRes = await fetch("/api/auth/token", { credentials: "include" });
      if (!tokenRes.ok) throw new Error("Token generation failed");
      
      const { token } = await tokenRes.json();

      const { data: tokenData } = await authClient.token();
      console.log(tokenData);

      const res = await fetch('http://localhost:5000/booking', {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : { success: false };
      
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* হেডার সেকশন */}
      <div className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {carName}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Explore features and reserve your ride</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
          isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          {isAvailable ? 'Available Now' : 'Rented Out'}
        </span>
      </div>

      {/* মেইন কার্ড কন্টেইনার */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* বাম পাশ: ইমেজ সেকশন */}
        <div className="md:col-span-5 relative bg-slate-900 min-h-[260px] md:min-h-full">
          <img 
            src={imageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600"} 
            alt={carName} 
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105" 
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold text-slate-800">
            {carType}
          </div>
        </div>

        {/* ডান পাশ: কার ডিটেইলস */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            {/* প্রাইস এবং টাইটেল */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{carName}</h1>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{pickupLocation || "Downtown SF"}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end text-2xl font-black text-blue-600">
                  <DollarSign className="w-5 h-5 -mr-1 shrink-0" />
                  <span>{dailyPrice}</span>
                </div>
                <span className="text-slate-400 text-xs font-medium">per day</span>
              </div>
            </div>

            {/* স্পেসিফিকেশন গ্রিড */}
            <div className="grid grid-cols-2 gap-4 py-5">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Type</p>
                  <p className="text-sm font-semibold text-slate-800">{carType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Capacity</p>
                  <p className="text-sm font-semibold text-slate-800">{seatCapacity} Seats</p>
                </div>
              </div>
            </div>

            {/* ডেসক্রিপশন */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" /> Description
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">
                {description || "Experience the premium drive with maximum comfort, advanced safety features, and top-tier performance tailored for your journey."}
              </p>
            </div>
          </div>

          {/* বুকিং বাটন */}
          <div className="pt-4 border-t border-slate-100">
            <button 
              onClick={() => setIsOpen(true)} 
              disabled={!isAvailable}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide text-center text-white transition-all duration-200 shadow-md ${
                isAvailable 
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-blue-200 hover:shadow-lg' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isAvailable ? 'Book This Car Now' : 'Currently Unavailable'}
            </button>
          </div>
        </div>
      </div>

      {/* বুকিং কনফার্মেশন মোডাল */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* মোডাল হেডার */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Confirm Your Booking</h3>
                <p className="text-xs text-slate-500 mt-0.5">Please review the details below</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* কার এর সারসংক্ষেপ */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-4 rounded-2xl border border-slate-200/60 space-y-2 mb-5">
              <p className="text-base font-bold text-slate-800">{carName}</p>
              <div className="grid grid-cols-2 gap-y-2 text-xs font-semibold text-slate-600">
                <p className="flex items-center gap-1 text-slate-500">
                  <DollarSign className="w-3.5 h-3.5 text-blue-500" /> Price: <span className="font-bold text-slate-800">${dailyPrice}/day</span>
                </p>
                <p className="flex items-center gap-1 text-slate-500">
                  <Users className="w-3.5 h-3.5 text-blue-500" /> Capacity: <span className="font-bold text-slate-800">{seatCapacity} Seats</span>
                </p>
              </div>
            </div>

            {/* ইনপুট ফর্ম */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-400" /> Do you need a driver?
                </label>
                <select 
                  value={driverNeeded} 
                  onChange={(e) => setDriverNeeded(e.target.value)}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="No">No, I will drive myself</option>
                  <option value="Yes">Yes, I need a driver</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Special Instructions <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={specialNote} 
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g., Delivery time preference, child seat requirement, etc." 
                  rows={3}
                  className="w-full p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none placeholder:text-slate-400" 
                />
              </div>
            </div>

            {/* অ্যাকশন বাটনসমূহ */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setIsOpen(false)} 
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={bookingLoading} 
                onClick={handleBookingConfirm}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-100 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetails;