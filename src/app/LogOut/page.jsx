"use client";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";

export default function LogOutPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="p-10 border text-center shadow-lg">
        <h1 className="text-2xl font-bold text-red-600 mb-2">You are Logged Out!</h1>
        <p className="mb-6">You’ve logged out successfully.
           Don't forget to check back later for new listings and the best deals on our marketplace.
            Have a wonderful day!</p>
        
        <Button 
          color="success" 
          onPress={() => router.push("/")}
        >
          Back to Home
        </Button>
      </Card>
    </div>
  );
}