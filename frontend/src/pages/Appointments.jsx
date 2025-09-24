import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
const Appointments = () => {
  const { docId } = useParams();
  const { doctors, currency } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const fetchDocInfo = () => {
    const info = doctors.find((doc) => doc._id === docId);
    setDocInfo(info);
  };
  const getAvailableSlots = () => {
    setDocSlots([]);
    const today = new Date();
    const allSlots = [];
    for (let i = 0; i < 7; i++) {
      let curDate = new Date(today);
      curDate.setDate(today.getDate() + i);
      let endTime = new Date(curDate);
      endTime.setHours(21, 0, 0, 0);

      if (today.toDateString() === curDate.toDateString()) {
        let hours = today.getHours();
        let minutes = today.getMinutes();
        if (minutes < 30) {
          curDate.setHours(hours, 30, 0, 0);
        } else {
          curDate.setHours(hours + 1, 0, 0, 0);
        }
        if (curDate.getHours() < 10) {
          curDate.setHours(10, 0, 0, 0);
        }
      } else {
        curDate.setHours(10, 0, 0, 0);
      }
      const timeSlots = [];
      while (curDate < endTime) {
        timeSlots.push({
          dateTime: new Date(curDate),
          time: curDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
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
      const todayIndex = docSlots.findIndex(
        (slots) => slots[0].dateTime.toDateString() === today.toDateString()
      );
      setSlotIndex(todayIndex >= 0 ? todayIndex : 0);
    }
  }, [docSlots]);
  if (!docInfo) return null;
  return (
    <div className="px-4 sm:px-8 lg:px-16 mt-6 sm:mt-12">
      {/* Doctor Info */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            className="bg-[rgb(95,111,255)] w-full sm:max-w-72 rounded-lg shadow-md"
            src={docInfo.image}
            alt={`${docInfo.name} Image`}
          />
        </div>
        <div className="flex-1 border rounded-lg p-6 sm:p-8 bg-gray-100">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img
              className="w-5"
              src={assets.verified_icon}
              alt="Verified Icon"
            />
          </p>
          <div className="flex flex-col gap-2 text-sm text-gray-600 mt-2">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <p className="inline-block py-0.5 px-2 border text-center border-gray-400 rounded-full mt-1 sm:mt-0">
              {docInfo.experience}
            </p>
          </div>
          <div className="mt-4">
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
              About <img src={assets.info_icon} alt="Info Icon" />
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-[700px]">
              {docInfo.about}
            </p>
          </div>
          <p className="text-gray-500 mt-4 font-medium">
            Appointment fee:{" "}
            <span className="text-gray-600">
              {currency}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-8 font-medium text-gray-700">
        <p className="text-lg font-semibold mb-2">Booking Slots</p>
        <div className="flex gap-3 items-center overflow-x-auto py-2 time-slots-scroll">
          {docSlots.length > 0 &&
            docSlots.map((daySlots, index) => (
              <div
                key={index}
                className={`text-center py-4 min-w-[4rem] rounded-full cursor-pointer ${
                  slotIndex === index
                    ? "bg-[rgb(95,111,255)] text-white"
                    : "border border-gray-400"
                }`}
                onClick={() => setSlotIndex(index)}
              >
                <p className="font-semibold">
                  {daySlots[0] && daysOfWeek[daySlots[0].dateTime.getDay()]}
                </p>
                <p>{daySlots[0] && daySlots[0].dateTime.getDate()}</p>
              </div>
            ))}
        </div>
        <div className="overflow-x-auto flex gap-3 mt-4 pb-2 time-slots-scroll">
          {docSlots.length > 0 &&
            docSlots[slotIndex] &&
            docSlots[slotIndex].map((item, index) => (
              <div
                key={index}
                className={`flex-shrink-0 text-sm font-light px-5 py-2 rounded-full cursor-pointer ${
                  selectedTime === item.time
                    ? "bg-[rgb(95,111,255)] text-white"
                    : "border border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTime(item.time)}
              >
                {item.time.toLowerCase()}
              </div>
            ))}
        </div>
        <button className="bg-[rgb(95,111,255)] text-white text-sm font-light px-14 py-3 rounded-full my-6 w-full sm:w-auto">
          Book an Appointment
        </button>
      </div>

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointments;
