"use client";

import { Button } from "@heroui/react";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast"; // toast এবং Toaster ইম্পোর্ট করা হয়েছে

export function BookingCanceler({ bookingId }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancelBooking = async () => {
        setLoading(true);

        try {
            // authClient থেকে টোকেনটি সংগ্রহ করা
            const tokenRes = await authClient.token();
            const token = tokenRes?.token || tokenRes?.data?.token || tokenRes;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/booking/${bookingId}`, {
                method: "DELETE",
                headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            console.log(data);
            
            if (res.ok && data.success) {
                // সফল হলে সাকসেস টোস্ট দেখাবে
                toast.success("Booking canceled successfully!"); 
                setOpen(false);
                
                // ১ সেকেন্ড পর পেজ রিফ্রেশ হবে যাতে ইউজার টোস্টটি দেখার সময় পায়
                setTimeout(() => {
                    router.refresh();
                }, 1000);
            } else {
                // সার্ভার থেকে কোনো সমস্যা হলে এরর টোস্ট দেখাবে
                toast.error(data.message || "Something went wrong!");
            }
        } catch (err) {
            console.error("Cancel failed:", err);
            // নেটওয়ার্ক বা অন্য কোনো ফেইলুর হলে এরর টোস্ট দেখাবে
            toast.error("Failed to cancel booking. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* টোস্ট কন্টেইনার, যা স্ক্রিনে মেসেজটি রেন্ডার করবে */}
            <Toaster position="top-center" reverseOrder={false} />

            <Button
                className="rounded-lg px-3 py-2 bg-red-500 text-white font-medium flex gap-1 hover:bg-red-600"
                onClick={() => setOpen(true)}
            >
                <Trash size={16} /> Cancel
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white text-left rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Are you sure?</h2>
                        <p className="text-base font-medium text-gray-500 mb-6">
                            This action will permanently cancel your booking. This cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                className="bg-gray-500 text-base font-medium border-2 border-gray-500 px-2 py-1 rounded-2xl text-white hover:bg-gray-600"
                                variant="flat"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Go Back
                            </Button>
                            <Button
                                className="bg-red-500 text-base font-medium border-2 border-red-500 px-2 py-1 rounded-2xl text-white hover:bg-red-600"
                                onClick={handleCancelBooking}
                                disabled={loading}
                            >
                                {loading ? "Canceling..." : "Confirm Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}