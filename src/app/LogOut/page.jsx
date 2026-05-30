"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LogOutPage() {
  const router = useRouter();
  const hasShownToast = useRef(false); // দুইবার টোস্ট রেন্ডার হওয়া আটকানোর জন্য

  useEffect(() => {
    // Next.js StrictMode-এ যাতে ডাবল টোস্ট বা গ্লিচ না হয়
    if (!hasShownToast.current) {
      toast.success("Successfully logged out! See you again.", {
        toastId: "logout-success", // ইউনিক আইডি যাতে বারবার ফায়ার না হয়
      });
      hasShownToast.current = true;
    }
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      {/* কন্টেইনারটি এখানে একদম টপে রাখা হয়েছে */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Card className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-red-500 tracking-tight">You are Logged Out!</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            You’ve logged out successfully. Don't forget to check back later for new
            listings and the best deals on our marketplace. Have a wonderful day!
          </p>
        </div>

        <div className="pt-2">
          <Button 
            onPress={() => router.push("/")}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-center text-white bg-green-500 hover:bg-green-600 transition-all duration-150 active:scale-[0.99] shadow-sm"
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}