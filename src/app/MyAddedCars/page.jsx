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

    const fetchMyCars = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/my-cars`, {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cars/${selectedCar._id}`, {
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
        fetchMyCars();
      } else {
        alert('Failed to update car.');
      }
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  
  const handleDeleteClick = (car) => {
    setSelectedCar(car);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data: tokenData } = await authClient.token();
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/cars/${selectedCar._id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${tokenData?.token}`,
        },
      });

      if (response.ok) {
        alert('Car deleted successfully!');
        setIsDeleteModalOpen(false);
        fetchMyCars();
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 pb-1">My Added Cars</h1>
            <p className="text-base text-gray-500">Manage and update your listed vehicles on DriveFleet.</p>
          </div>
         <a href="/AddCarForm" 
         className="rounded-lg bg-blue-500 border border-blue-300 px-5 py-2 text-base font-bold text-white shadow-sm transition hover:bg-blue-600 self-end sm:self-auto">
         Add Car</a>
        </div>

        {cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-16 text-center shadow-sm border border-gray-100">
            <div className="relative mb-6 w-48 h-12 border-b-2 border-dashed border-gray-200 flex items-end justify-center">
              <div 
                className="text-5xl pb-1"
                style={{ animation: 'drive 2s linear infinite' }}
              >
                🚗
              </div>
            </div>

            <style>{`
              @keyframes drive {
                0% { transform:scaleX(-1) translateX(70px); }
                100% { transform: scaleX(-1) translateX(-70px); }
              }
            `}</style>  
            <h3 className="mb-2 text-xl font-bold text-gray-800">No Cars Found</h3>
            <p className="max-w-xs text-sm text-gray-500">
              You haven't listed any fleet yet with this account. Add your first car to get started!
            </p>
            <a 
              href="/AddCarForm" 
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              + Add New Car
            </a>
          </div>
        ) : (
          
          <div className="flex flex-col gap-4">
            {cars.map((car) => (
              <div 
                key={car._id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl bg-white p-4 shadow-sm border border-gray-100/80 transition hover:shadow-md gap-4"
              >
                <div className="flex items-center gap-5">
                  <div className="h-24 w-36 md:w-40 shrink-0 overflow-hidden rounded-2xl bg-gray-50">
                    <img
                      src={car.imageUrl || 'https://via.placeholder.com/400x250'}
                      alt={car.carName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">{car.carName}</h3>
                    
                    <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-gray-500">
                      <span>{car.carType}</span>
                      <span>•</span>
                      <span className="truncate max-w-[150px] md:max-w-[250px]">{car.pickupLocation}</span>
                      <span>•</span>
                      <span className="text-gray-800 text-sm font-bold">${car.dailyPrice}/day</span>
                    </div>

                    <p className={`text-sm font-bold ${
                      car.availability === 'Available' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {car.availability}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:self-center self-end shrink-0">
                  <button
                    onClick={() => handleUpdateClick(car)}
                    className="rounded-full bg-gray-200 border-2 border-gray-200 px-4 py-1.5 text-base font-bold text-gray-700 transition hover:bg-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(car)}
                    className="rounded-full bg-rose-500 border-2 border-rose-100 px-4 py-1.5 text-base font-bold text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

          {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
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

           {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-md">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Are you absolutely sure?</h2>
            <p className="mt-2 text-base text-gray-500">
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
                Delete Car
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}