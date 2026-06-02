'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AddCarForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    carName: '',
    dailyPrice: '',
    carType: '',
    seatCapacity: '',
    imageUrl: '',
    pickupLocation: '',
    availability: 'Available',
    description: '',
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

       const carData = {
      ...formData,
      dailyPrice: parseFloat(formData.dailyPrice),
      seatCapacity: parseInt(formData.seatCapacity),
    };

    try {
      const { data: tokenData } = await authClient.token();
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/destination`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify(carData)
      });

      const data = await response.json(); 
      console.log("Server Response:", data);

      if (response.ok) {
           toast.success('Car added successfully!');
        
        
        setFormData({
          carName: '',
          dailyPrice: '',
          carType: '',
          seatCapacity: '',
          imageUrl: '',
          pickupLocation: '',
          availability: 'Available',
          description: '',
        });
      } else {
        
        toast.error('Something went wrong on the server!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
     
      toast.error('Failed to connect to the server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Car Listing Form</h2>
          <p className="text-sm text-gray-500">Fill out the details below to add a car to the DriveFleet.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Car Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Car Name</label>
              <input
                type="text"
                name="carName"
                value={formData.carName}
                onChange={handleChange}
                required
                placeholder="e.g., Tesla Model Y"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Daily Rent Price */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Daily Rent Price ($)</label>
              <input
                type="number"
                name="dailyPrice"
                value={formData.dailyPrice}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 85"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Car Type */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Car Type</label>
              <select
                name="carType"
                value={formData.carType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select type</option> 
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            {/* Seat Capacity */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Seat Capacity</label>
              <input
                type="number"
                name="seatCapacity"
                value={formData.seatCapacity}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 5"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Image URL (imgbb / postimage)</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                placeholder="https://i.ibb.co/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Pickup Location */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Pickup Location</label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                placeholder="e.g., Downtown Terminal"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Availability Status */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Availability Status</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Provide details about the car's condition, features, etc..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Car Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}