import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctors from "../components/RelatedDoctors";
const Appointments = () => {
  const { docId } = useParams();
  const { doctors, currency } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null); // new state
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchDocInfo = async () => {
    const info = doctors.find(doc => doc._id === docId);
    setDocInfo(info);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);
    const today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let curDate = new Date(today);
      curDate.setDate(today.getDate() + i);
      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.toDateString() === curDate.toDateString()) {
        let hours = today.getHours();
        let minutes = today.getMinutes();
        if (minutes < 30) {
          curDate.setHours(hours);
          curDate.setMinutes(30);
        } else {
          curDate.setHours(hours + 1);
          curDate.setMinutes(0);
        }
        if (curDate.getHours() < 10) {
          curDate.setHours(10);
          curDate.setMinutes(0);
        }
      } else {
        curDate.setHours(10);
        curDate.setMinutes(0);
      }

      let timeSlots = [];
      while (curDate < endTime) {
        let formattedTime = curDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({
          dateTime: new Date(curDate),
          time: formattedTime
        });
        curDate.setMinutes(curDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    if (docSlots.length > 0) {
      const today = new Date();
      const todayIndex = docSlots.findIndex(slots =>
        slots[0].dateTime.toDateString() === today.toDateString()
      );
      setSlotIndex(todayIndex >= 0 ? todayIndex : 0);
    }
  }, [docSlots]);

  if (!docInfo) return null;

  return (
    <div>
      {/* Doctor Info */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className='bg-[rgb(95,111,255)] w-full sm:max-w-72 rounded-lg'
            src={docInfo.image}
            alt={`${docInfo.name} Image`}
          />
        </div>
        <div className="flex-1 border-2 border-gray-500 rounded-lg p-8 py-7 bg-gray-100 mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name} <img className='w-5' src={assets.verified_icon} alt="Verified Icon"/>
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <p className="py-0.5 px-2 border-2 border-gray-400 text-sm rounded-full">{docInfo.experience}</p>
          </div>
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img src={assets.info_icon} alt="Info Icon"/>
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className="text-gray-500 mt-4 font-medium">
            Appointment fee: <span className="text-gray-600">{currency}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>

        {/* Days */}
        <div className="flex gap-3 items-center w-full overflow-x-auto mt-4 time-slots-scroll">
          {docSlots.length > 0 && docSlots.map((daySlots, index) => (
            <div
              key={index}
              className={`text-center py-6 min-w-[4rem] rounded-full cursor-pointer ${slotIndex === index ? "bg-[rgb(95,111,255)] text-white" : "border border-gray-400"}`}
              onClick={() => setSlotIndex(index)}
            >
              <p className="font-semibold">{daySlots[0] && daysOfWeek[daySlots[0].dateTime.getDay()]}</p>
              <p>{daySlots[0] && daySlots[0].dateTime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Times */}
        <div className="time-slots-scroll mt-4">
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <p
              key={index}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer 
                ${selectedTime === item.time ? "bg-[rgb(95,111,255)] text-white" : "border border-gray-300 hover:bg-gray-200"}`}
              onClick={() => setSelectedTime(item.time)}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button className="bg-[rgb(95,111,255)] text-white text-sm font-light px-14 py-3 rounded-full my-6">
          Book an Appointment
        </button>
      </div>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
};

export default Appointments;
