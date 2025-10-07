import React from "react";
import { assets } from "../../assets/assets";

const AddDoctor = () => {
  return (
    <form
      className="bg-gray-100 shadow-md rounded-lg p-6 w-full max-w-6xl mx-auto space-y-8"
      onSubmit={(e) => e.preventDefault()}
    >
      <p className="text-3xl font-semibold text-gray-700 text-center">
        Add Doctor
      </p>
      <div className="flex flex-col items-center">
        <label htmlFor="doc-img" className="cursor-pointer">
          <img
            src={assets.upload_area}
            alt="Upload area"
            className="w-32 h-32 object-cover rounded-full border border-gray-300 hover:opacity-80 transition"
          />
        </label>
        <input type="file" id="doc-img" hidden className="cursor-pointer" />
        <p className="text-gray-500 text-sm mt-2">Upload picture</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-medium text-gray-600">Doctor Name</p>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Name"
            required
          />
        </div>
        <div>
          <p className="font-medium text-gray-600">Doctor Email</p>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <p className="font-medium text-gray-600">Doctor Password</p>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Password"
            required
          />
        </div>
        <div>
          <p className="font-medium text-gray-600">Doctor Experience (in years)</p>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Experience"
            required
          />
        </div>
        <div>
          <p className="font-medium text-gray-600">Consultation Fee (₹)</p>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Fee"
            required
          />
        </div>
        <div>
          <p className="font-medium text-gray-600">Doctor Speciality</p>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          >
            <option value="">Select Speciality</option>
            <option value="General Physician">General Physician</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="ENT Specialist">ENT Specialist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Psychiatrist">Psychiatrist</option>
          </select>
        </div>
        <div>
          <p className="font-medium text-gray-600">Doctor Education</p>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Education"
            required
          />
        </div>
        <div>
          <p className="font-medium text-gray-600">Doctor Address</p>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Address Line 1"
            required
          />
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Address Line 2"
            required
          />
        </div>
        <div className="md:col-span-2">
          <p className="font-medium text-gray-600">Doctor About</p>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="About the doctor..."
            required
          ></textarea>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-[rgb(95,111,255)] text-white font-medium px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};
export default AddDoctor;
