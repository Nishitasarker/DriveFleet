'use client';

import React, { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function MyAddedCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Active Car States
  const [selectedCar, setSelectedCar] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    dailyPrice: '',
    description: '',
    availability: '',
    imageUrl: '',
    carType: '',
    pickupLocation: '',
  });

  // ১. ইউজারের অ্যাড করা গাড়িগুলো সার্ভার থেকে ফেচ করা
  const fetchMyCars = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      // আপনার ব্যাকএন্ড রাউট অনুযায়ী URL পরিবর্তন করে নিতে পারেন (যেমন: /my-cars)
      const response = await fetch("http://localhost:5000/my-cars", {
        headers: {
          authorization: `Bearer ${tokenData?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCars(data);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCars();
  }, []);

  // ২. আপডেট মোডাল ওপেন এবং ডাটা সেট করার ফাংশন
  const handleUpdateClick = (car) => {
    setSelectedCar(car);
    setUpdateFormData({
      dailyPrice: car.dailyPrice,
      description: car.description,
      availability: car.availability,
      imageUrl: car.imageUrl,
      carType: car.carType,
      pickupLocation: car.pickupLocation,
    });
    setIsUpdateModalOpen(true);
  };

  // ৩. আপডেট ফর্ম সাবমিট হ্যান্ডলার
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: tokenData } = await authClient.token();
      const updatedData = {
        ...updateFormData,
        dailyPrice: parseFloat(updateFormData.dailyPrice),
      };

      const response = await fetch(`http://localhost:5000/cars/${selectedCar._id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Car updated successfully!');
        setIsUpdateModalOpen(false);
        fetchMyCars(); // লিস্ট রিফ্রেশ করার জন্য
      } else {
        alert('Failed to update car.');
      }
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  // ৪. ডিলিট কনফার্মেশন হ্যান্ডলার
  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      const response = await fetch(`http://localhost:5000/cars/${selectedCar._id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${tokenData?.token}`,
        },
      });

      if (response.ok) {
        alert('Car deleted successfully!');
        setIsDeleteModalOpen(false);
        fetchMyCars(); // লিস্ট রিফ্রেশ করার জন্য
      } else {
        alert('Failed to delete car.');
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Loading your cars...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-20 pt-5 md:pt-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 pb-1">My Added Cars</h1>
          <p className="text-base text-gray-500">Manage and update your listed vehicles on DriveFleet.</p>
        </div>

        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-16 text-center shadow-sm border border-gray-100">
  {/* মডার্ন কার ইমোজি অ্যানিমেশন ইফেক্ট সহ */}
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
  {/* মডার্ন হেডিং */}
  <h3 className="mb-2 text-xl font-bold text-gray-800">No Cars Found</h3>
  
  {/* সাব-টেক্সট */}
  <p className="max-w-xs text-sm text-gray-500">
    You haven't listed any fleet yet with this account. Add your first car to get started!
  </p>
  
  {/* অ্যাকশন বাটন (অপশনাল: ইউজারকে সরাসরি কার অ্যাড করার পেজে নিয়ে যাওয়ার জন্য) */}
  <a 
    href="/AddCarForm" // আপনার প্রজেক্টের অ্যাড কার পেজের পাথ এখানে দিন
    className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
  >
    + Add New Car
  </a>
</div>
        ) : (
          /* Car Grid Layout */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div key={car._id} className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg">
                <img
                  src={car.imageUrl || 'https://via.placeholder.com/400x250'}
                  alt={car.carName}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">{car.carName}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      car.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {car.availability}
                    </span>
                  </div>
                  
                  {/* Car Details Info */}
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-semibold">Type:</span> {car.carType}</p>
                    <p><span className="font-semibold">Capacity:</span> {car.seatCapacity} Seats</p>
                    <p><span className="font-semibold">Price:</span> ${car.dailyPrice}/day</p>
                    <p><span className="font-semibold">Location:</span> {car.pickupLocation}</p>
                    <p className="line-clamp-2 mt-2 text-xs text-gray-500">{car.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => handleUpdateClick(car)}
                      className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteClick(car)}
                      className="flex-1 rounded-lg bg-red-50 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- UPDATE MODAL --- */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Update Car: {selectedCar?.carName}</h2>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Daily Rent Price ($)</label>
                <input
                  type="number"
                  value={updateFormData.dailyPrice}
                  onChange={(e) => setUpdateFormData({...updateFormData, dailyPrice: e.target.value})}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Car Type</label>
                <select
                  value={updateFormData.carType}
                  onChange={(e) => setUpdateFormData({...updateFormData, carType: e.target.value})}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                >
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Availability Status</label>
                <select
                  value={updateFormData.availability}
                  onChange={(e) => setUpdateFormData({...updateFormData, availability: e.target.value})}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={updateFormData.imageUrl}
                  onChange={(e) => setUpdateFormData({...updateFormData, imageUrl: e.target.value})}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                <input
                  type="text"
                  value={updateFormData.pickupLocation}
                  onChange={(e) => setUpdateFormData({...updateFormData, pickupLocation: e.target.value})}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows="3"
                  value={updateFormData.description}
                  onChange={(e) => setUpdateFormData({...updateFormData, description: e.target.value})}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800">Are you absolutely sure?</h2>
            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone. This will permanently delete <strong>{selectedCar?.carName}</strong> from DriveFleet.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              >
                Yes, Delete Car
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}