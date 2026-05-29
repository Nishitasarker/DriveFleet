"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from '@heroui/react';
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const session = null; // Better Auth বন্ধ থাকায় ফেক সেশন

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = session?.user;

  const activeClass = (path) =>
    pathname === path ? "text-sky-500 font-bold" : "text-black hover:text-sky-500 transition-colors";

  const handleLogOut = async () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!mounted) {
    return <div className="w-full bg-base-100 shadow-sm h-16"></div>;
  }

  return (
    <div className="w-full bg-base-100 shadow-sm px-6 md:px-20 h-20 flex justify-between items-center border-b border-gray-100 ">
      
      {/* ১. বামে: লোগো বা ব্র্যান্ড নেম */}
     <div className="flex  items-center justify-center">
        <Image src="/sedan.png"  alt="DriveNext Logo" height={50} width={50}/>
     
      <span className="text-xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-zinc-950 via-sky-300 to-cyan-100 !bg-clip-text !text-transparent">
       DriveFleet
      </span>
    </div>

      {/* ২. মাঝখানে: মেইন নেভিগেশন মেনু (ডেস্কটপ স্ক্রিনের জন্য) */}
      <div className="hidden lg:flex items-center">
        <ul className="flex items-center gap-8 font-medium text-lg">
          <li>
            <Link href="/" className={activeClass("/")}>Home</Link>
          </li>
          <li>
            <Link href="/ExploreCar" className={activeClass("/ExploreCar")}>Explore Cars</Link>
          </li>
          <li>
            <Link href="/AddCarForm" className={activeClass("/AddCarForm")}>Add Car</Link>
          </li>
          <li>
            <Link href="/MyBookings" className={activeClass("/MyBookings")}>My Bookings</Link>
          </li>
        </ul>
      </div>

      {/* ৩. ডানে: লগইন / রেজিস্ট্রেশন অথবা ইউজার প্রোফাইল */}
      <div className="flex items-center gap-3">
        {!session ? (
          <div className="flex items-center gap-3">
            {/* HeroUI Login Button (onPress ইউজ করা হয়েছে) */}
            <Button
              onPress={() => router.push("/LogIn")}
              className={`font-semibold rounded-xl border-2 transition-all duration-200 ${
                pathname === "/LogIn"
                  ? "bg-blue-500 text-white border-blue-200 px-3 py-1 shadow-sm"
                  : "bg-white text-blue-500 border-blue-200 px-3 py-1 hover:bg-blue-50/50"
              }`}
            >
              Login
            </Button>


            <Button
              onPress={() => router.push("/RegisterPage")}
              className={`font-semibold rounded-xl border-2 transition-all duration-200 ${
                pathname === "/RegisterPage"
                  ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                  : "bg-white text-sky-500 border-sky-500 hover:bg-sky-50/50"
              }`}
            >
              Register
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <h2 className="hidden md:block font-medium">{user?.name}</h2>
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-green-500 ring-offset-base-100 ring-offset-2">
                <Image src={user?.image || "/female.png"} alt="User" width={40} height={40} />
              </div>
            </div>

            <button
              className="btn btn-sm lg:btn-md bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={handleLogOut}
            >
              LogOut
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;