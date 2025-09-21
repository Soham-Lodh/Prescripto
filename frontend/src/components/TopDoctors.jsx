import React from 'react';
import {doctors} from "../assets/assets_frontend/assets";
const TopDoctors = () => {
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className="text-3xl font-medium">Top Doctors</h1>
      <p className='sm:w-1/3 text-center text-sm'>Browse through our list of trusted doctors</p>
      <div>
        {doctors.slice(0,10).map((item,index)=>(
            <div key={index}>
                <img src={item.image} alt={item.name} />
                <div>
                    <div>
                        <p className="w-4 h-4 bg-green-500 rounded-full"></p><p className="">Available</p>
                    </div>
                    <p>{item.name}</p>
                    <p>{item.speciality}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TopDoctors;