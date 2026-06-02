import Link from 'next/link';
import React from 'react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-300 px-6 py-12">
            <div className="text-center max-w-lg bg-base-100 pt-20 pb-5 px-10 rounded-3xl shadow-2xl border border-gray-300 relative overflow-hidden">
                
                {/* Top Accent Bar */}
               

                {/* 404 & Car Animation Area */}
                <div className="flex flex-col items-center justify-center mb-6">     
                    
                    {/* Car and Road Track (Fixed Position) */}
                    <div className="w-full max-w-[200px] relative h-8 flex flex-col justify-end items-center">
                        {/* Car Moving/Pulsing on its spot */}
                        <div className="text-5xl animate-pulse transform -translate-y-1">
                            🚗💨
                        </div>
                        {/* Road Line */}
                        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-base-content/30 to-transparent rounded-full"></div>
                    </div>
                </div>
                
                {/* Professional Error Message */}
                <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
                    Route Not Found
                </h2>
                <p className="text-base-content/70 text-gray-700 mb-8 leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get your journey back on track.
                </p>

                {/* Highly Visible Back to Home Button */}
                <div className="flex justify-center">
                    <Link href="/" className="inline-block w-full sm:w-auto">
                        <button className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 w-full sm:w-64 border-none">
                            {/* Home Icon */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={2} 
                                stroke="currentColor" 
                                className="w-5 h-5 animate-pulse"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            Back to Home
                        </button>
                    </Link>
                </div>

                {/* Decorative Professional Footer */}
                <div className="mt-10 pt-6 border-t border-gray-400 text-sm text-base-content/40 tracking-widest font-mono">
                    DRIVEFLEET • GPS SIGNAL LOST
                </div>
            </div>
        </div>
    );
};

export default NotFound;