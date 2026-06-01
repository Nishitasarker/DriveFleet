import { BookingCanceler } from '@/components/BookingCanceler';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';

export const dynamic = 'force-dynamic';

const MyBookings = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const user = session?.user;

    if (!user || !user.email) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-red-500 font-semibold">Please log in to see your bookings.</p>
                </div>
            </div>
        );
    }

    const currentUserEmail = user.email.trim().toLowerCase();

    // ✅ token নেওয়া হচ্ছে
    const tokenRes = await auth.api.getToken({
        headers: await headers()
    });
    const token = tokenRes?.token;

    // ✅ token সহ fetch করা হচ্ছে
    const res = await fetch(`http://localhost:5000/booking/${encodeURIComponent(currentUserEmail)}`, {
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    let bookings = [];
    if (res.ok) {
        bookings = await res.json();
    }

    const bookingList = Array.isArray(bookings) ? bookings : (bookings ? [bookings] : []);

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-12">
            <div className="max-w-5xl mx-auto">

                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Bookings</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Logged in as: <span className="font-semibold text-blue-600 break-all">{currentUserEmail}</span>
                    </p>
                </div>

                {bookingList.length === 0 ? (
                    /* Modern Moving Car Empty State */
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm px-4 overflow-hidden">
                        
                        {/* রোডের ড্যাশড বর্ডার এবং কার কন্টেইনার */}
                        <div className="relative mb-6 w-48 h-12 border-b-2 border-dashed border-gray-200 flex items-end justify-center">
                            <div 
                                className="text-5xl pb-1"
                                style={{ animation: 'drive 2s linear infinite' }}
                            >
                                🚗
                            </div>
                        </div>

                        {/* কাস্টম কার ড্রাইভিং অ্যানিমেশন স্টাইল */}
                        <style>{`
                            @keyframes drive {
                                0% { transform:scaleX(-1) translateX(70px); }
                                100% { transform: scaleX(-1) translateX(-70px); }
                            }
                        `}</style>

                        <h3 className="text-lg font-semibold text-gray-900">No Bookings Found</h3>
                        <p className="text-gray-500 text-sm mt-1 text-center max-w-xs">
                            You haven't reserved any fleet yet with this email.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop/Tablet Table */}
                        <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <th className="py-4 px-6">Car Details</th>
                                            <th className="py-4 px-6">Type</th>
                                            <th className="py-4 px-6">Booking Date</th>
                                            <th className="py-4 px-6">Total Price</th>
                                            <th className="py-4 px-6">Status</th>
                                            <th className="py-4 px-6 text-right">Cancel</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {bookingList.map((booking) => {
                                            const bookingDate = booking.bookedAt
                                                ? new Date(booking.bookedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })
                                                : "N/A";

                                            return (
                                                <tr key={String(booking._id)} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-4">
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
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                            {booking.carType || "Sedan"}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-600 font-medium">{bookingDate}</td>
                                                    <td className="py-4 px-6">
                                                        <span className="text-base font-bold text-gray-900">${booking.carPrice}</span>
                                                        <span className="text-xs text-gray-400">/ Day</span>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                            Confirmed
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex justify-end">
                                                            <BookingCanceler bookingId={booking._id} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden flex flex-col gap-4">
                            {bookingList.map((booking) => {
                                const bookingDate = booking.bookedAt
                                    ? new Date(booking.bookedAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })
                                    : "N/A";

                                return (
                                    <div key={String(booking._id)} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                <img
                                                    src={booking.carImage || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=200"}
                                                    alt={booking.carName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="font-semibold text-gray-900 block truncate">{booking.carName}</span>
                                                <span className="text-xs text-gray-400 font-mono">
                                                    ID: #{booking._id ? String(booking._id).slice(-6).toUpperCase() : "UNKNOWN"}
                                                </span>
                                            </div>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Confirmed
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-50 rounded-xl p-3">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">Type</p>
                                                <p className="text-xs font-semibold text-gray-700">{booking.carType || "Sedan"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">Date</p>
                                                <p className="text-xs font-semibold text-gray-700">{bookingDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">Price</p>
                                                <p className="text-xs font-bold text-gray-900">${booking.carPrice}<span className="font-normal text-gray-400">/day</span></p>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <BookingCanceler bookingId={booking._id} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyBookings;