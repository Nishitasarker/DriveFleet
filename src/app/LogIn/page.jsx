"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

import {
  Card,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { authClient } from '@/lib/auth-client';

const LogInPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await authClient.signIn.email({
        email,
        password,
        fetchOptions: {
          // ১. রিকোয়েস্ট পাঠানো মাত্রই আমরা ইউজারকে জানাচ্ছি যে প্রসেস শুরু হয়েছে
          onRequest: () => {
            // চাইলে এখানে একটা সাইলেন্ট লোডার দিতে পারেন, অথবা ডিরেক্ট বাটন ডিজেবল থাকবে।
          },
          onSuccess: () => {
            toast.success("Logged in successfully!", { autoClose: 1000 });
            
            // ২. অপ্রয়োজনীয় setTimeout বাদ দিয়ে সরাসরি পুশ করা হলো। 
            // Next.js এর router.refresh() দিলে সেশন ক্লায়েন্টে দ্রুত আপডেট হয়।
            router.push('/');
            router.refresh(); 
          },
          onError: (ctx) => {
            setLoading(false);
            if (ctx.error.status === 401 || ctx.error.code === "USER_NOT_FOUND") {
              toast.error("No account found with this email. Please register first.");
            } else {
              toast.error(ctx.error.message || "An error occurred. Please try again.");
            }
          }
        }
      });
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        // ৩. সোশ্যাল লগইনের ক্ষেত্রে callbackURL সরাসরি দিয়ে দিলে Better-auth নিজেই রিডাইরেকশন হ্যান্ডেল করে।
        callbackURL: "/", 
      });
    } catch (err) {
      toast.error("Google authentication service failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* ৪. টোস্টের স্পীড বাড়ানোর জন্য ক্লোজ টাইম কমিয়ে ১.৫ সেকেন্ড করা হয়েছে */}
      <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} />
      
      <Card className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-6">
        
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Log In</h1>
          <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
        </div>

        <Form className="flex flex-col gap-4" onSubmit={onSubmit} autoComplete="off">

          {/* Email Field */}
          <TextField
            isRequired
            name="email"
            type="email"
            autoComplete="none"
            className="w-full"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-sm font-semibold text-gray-700">Email</Label>
            <Input 
              placeholder="john@example.com" 
              autoComplete="none"  
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
            />
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>
  
          {/* Password Field */}
          <TextField
            isRequired
            minLength={6} 
            name="password"
            type="password"
            autoComplete="new-password"
            className="w-full"
            validate={(value) => {
              if (value.length < 6) {
                return "Password must be at least 6 characters long";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[a-z]/.test(value)) {
                return "Password must contain at least one lowercase letter";
              }
              return null;
            }}
          >
            <Label className="text-sm font-semibold text-gray-700">Password</Label>
            <Input 
              placeholder="Enter your password" 
              autoComplete="new-password"
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm"
            />
            <Description className="text-[11px] text-gray-400 mt-1 block">
              Must be at least 6 characters with 1 uppercase and 1 lowercase letter
            </Description>
            <FieldError className="text-xs text-red-500 mt-1" />
          </TextField>
  
          {/* Login Button */}
          <div className="pt-2">
            <button 
              className={`w-full py-3 px-4 rounded-xl font-semibold text-base text-center text-white transition-all duration-150 active:scale-[0.99] shadow-sm ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`} 
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>

          {/* Link to Register Page */}
          <div className="text-center font-medium text-sm text-gray-600 pt-2">
            <p>
              Don't have an account?{" "}
              <Link href="/RegisterPage" className="text-red-500 hover:underline font-medium cursor-pointer">
                Register here
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 font-medium text-xs tracking-wider uppercase">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
  
          {/* Google Login Button */}
          <button
            type="button" 
            className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm text-blue-700 bg-white border-2 border-blue-200 hover:bg-gray-50 transition-all duration-150 active:scale-[0.99]" 
            onClick={handleGoogleLogin}
          >
            <svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
              </g>
            </svg>
            Login with Google
          </button>
        </Form>
      </Card>
    </div>
  );
};

export default LogInPage;