import { BookingCanceler } from '@/components/BookingCanceler';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';

export const dynamic = 'force-dynamic';

const MyBookings = async () => {
    // 🚀 লজিক্যাল ফিক্স: রিয়াল সেশন গেট করা
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const user = session?.user;
    
    // ইউজার যদি লগইন না থাকে তবে খালি অ্যারে রেন্ডার করবে বা রিডাইরেক্ট করবে
    if (!user || !user.email) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-red-500 font-semibold">Please log in to see your bookings.</p>
                </div>
            </div>
        );
    }

    // 🚀 লজিক্যাল ফিক্স: বর্তমান লগইন করা রিয়াল ইমেইল দিয়ে এক্সপ্রেস থেকে ডাটা রিকোয়েস্ট করা হচ্ছে
    const currentUserEmail = user.email.trim().toLowerCase();

    const res = await fetch(`http://localhost:5000/booking/${encodeURIComponent(currentUserEmail)}`, {
        cache: 'no-store'
    });

    let bookings = [];
    if (res.ok) {
        bookings = await res.json();
    }

    const bookingList = Array.isArray(bookings) ? bookings : (bookings ? [bookings] : []);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-12">
            <div className="max-w-5xl mx-auto">
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Bookings</h1>
                    <p className="text-sm text-gray-500 mt-1">Logged in as: <span className="font-semibold text-blue-600">{currentUserEmail}</span></p>
                </div>

                {bookingList.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
                        <span className="text-4xl block mb-3">🚗</span>
                        <h3 className="text-lg font-semibold text-gray-900">No Bookings Found</h3>
                        <p className="text-gray-500 text-sm mt-1">You haven't reserved any fleet yet with this email.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Car Details</th>
                                        <th className="py-4 px-6">Type</th>
                                        <th className="py-4 px-6">Booking Date</th>
                                        <th className="py-4 px-6">Total Price</th>
                                        <th className="py-4 px-6 ">Status</th>
                                        <th className="py-4 px-6 text-right">Cancel Booking</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {bookingList.map((booking) => {
                                        const bookingDate = booking.bookedAt 
                                            ? new Date(booking.bookedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                              })
                                            : "N/A";

                                        return (
                                            <tr key={String(booking._id)} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-4 px-6 flex items-center gap-4">
                                                    <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                        <img 
                                                            src={booking.carImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=200"} 
                                                            alt={booking.carName} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-900 block">{booking.carName}</span>
                                                        <span className="text-xs text-gray-400 font-mono">
                                                            ID: #{booking._id ? String(booking._id).slice(-6).toUpperCase() : "UNKNOWN"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-4 px-6">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                        {booking.carType || "Sedan"}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-6 text-gray-600 font-medium">
                                                    {bookingDate}
                                                </td>

                                                <td className="py-4 px-6">
                                                    <span className="text-base font-bold text-gray-900">${booking.carPrice}</span>
                                                    <span className="text-xs text-gray-400">/ Day</span>
                                                </td>

                                                <td className="py-4 px-6 ">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        Confirmed  
                                                    </span>

                                                </td>
                                                <td className="py-4 px-6 text-right ">
                                                   <div className="flex justify-end">
                                                       <BookingCanceler bookingId={booking._id}/>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;