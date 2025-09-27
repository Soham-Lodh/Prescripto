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
    const info = doctors.find((doc) => String(doc._id) === String(docId));
    setDocInfo(info || null);
  };

  const generateSlots = () => {
    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      let curDate = new Date(today);
      curDate.setDate(today.getDate() + i);

      let slots = [];
      let startHour = 10;
      let endHour = 16;

      // If today, adjust starting time to next 30-min slot after current time
      if (i === 0) {
        const now = new Date();
        if (now.getHours() >= endHour) {
          slots = []; // No slots left today
        } else {
          startHour = Math.max(startHour, now.getHours());
          let minutes = now.getMinutes();
          let startMinutes = minutes < 30 ? 30 : 0;
          if (minutes >= 30) startHour += 1;
          curDate.setHours(startHour, startMinutes, 0, 0);
        }
      } else {
        curDate.setHours(startHour, 0, 0, 0);
      }

      let slotTime = new Date(curDate);

      while (slotTime.getHours() < endHour) {
        slots.push({
          dateTime: new Date(slotTime),
          time: slotTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }

      allSlots.push(slots);
    }

    setDocSlots(allSlots);

    // Set first non-empty day as default
    const firstAvailableDay = allSlots.findIndex((day) => day.length > 0);
    setSlotIndex(firstAvailableDay >= 0 ? firstAvailableDay : 0);
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) generateSlots();
  }, [docInfo]);

  if (!docInfo) return <p className="text-center mt-10">Doctor not found.</p>;

  return (
    <div className="px-4 sm:px-8 lg:px-16 mt-6 sm:mt-12">
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
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
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
              About <img src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-sm text-gray-500 mt-1 max-w-[700px]">{docInfo.about}</p>
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

      {/* Booking Slots */}
      <div className="mt-8 font-medium text-gray-700">
        <p className="text-lg font-semibold mb-2">Booking Slots</p>

        {/* Day Selector */}
        <div className="flex gap-3 items-center time-slots-scroll overflow-x-auto py-2">
          {docSlots.map((daySlots, index) =>
            daySlots.length > 0 ? (
              <div
                key={index}
                className={`text-center py-4 min-w-[4rem] rounded-full cursor-pointer ${
                  slotIndex === index ? "bg-[rgb(95,111,255)] text-white" : "border border-gray-400"
                }`}
                onClick={() => setSlotIndex(index)}
              >
                <p className="font-semibold">{daysOfWeek[daySlots[0].dateTime.getDay()]}</p>
                <p>{daySlots[0].dateTime.getDate()}</p>
              </div>
            ) : null
          )}
        </div>

        {/* Time Selector */}
        <div className="overflow-x-auto flex gap-3 time-slots-scroll mt-4 pb-2">
          {docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
            docSlots[slotIndex].map((item, index) => (
              <div
                key={index}
                className={`flex-shrink-0 text-sm font-light px-5 py-2 rounded-full cursor-pointer ${
                  selectedTime === item.time ? "bg-[rgb(95,111,255)] text-white" : "border border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTime(item.time)}
              >
                {item.time.toLowerCase()}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No slots available</p>
          )}
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
