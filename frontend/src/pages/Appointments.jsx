import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointments = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, currency, backendURL, token, getDoctorsData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const fetchDocInfo = () => {
    const info = doctors.find((doc) => String(doc._id) === String(docId));
    setDocInfo(info || null);
  };

  const generateSlots = () => {
    const customNow = new Date();
    const allSlots = [];
    const startHour = 10;
    const endHour = 16;

    for (let i = 0; i < 7; i++) {
      const curDate = new Date(customNow);
      curDate.setDate(customNow.getDate() + i);
      const slots = [];

      if (i === 0) {
        let startHours, startMinutes;

        if (customNow.getHours() < startHour) {
          startHours = startHour;
          startMinutes = 0;
        } else if (customNow.getHours() >= endHour) {
          allSlots.push([]);
          continue;
        } else {
          startMinutes = customNow.getMinutes() < 30 ? 30 : 0;
          startHours = startMinutes === 0 ? customNow.getHours() + 1 : customNow.getHours();
          if (startHours >= endHour) {
            allSlots.push([]);
            continue;
          }
        }

        curDate.setHours(startHours, startMinutes, 0, 0);
      } else {
        curDate.setHours(startHour, 0, 0, 0);
      }

      let slotTime = new Date(curDate);
      const day = slotTime.getDate().toString().padStart(2, "0");
      const month = (slotTime.getMonth() + 1).toString().padStart(2, "0");
      const year = slotTime.getFullYear();
      const slotDateStr = `${day}-${month}-${year}`;
      const bookedSlots = docInfo.slots_booked?.[slotDateStr] || [];

      while (slotTime.getHours() < endHour) {
        const timeStr = slotTime.toLocaleTimeString([], {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!bookedSlots.includes(timeStr)) {
          slots.push({
            dateTime: new Date(slotTime),
            time: timeStr,
          });
        }

        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }

      allSlots.push(slots);
    }

    setDocSlots(allSlots);
    const firstAvailableDay = allSlots.findIndex((day) => day.length > 0);
    setSlotIndex(firstAvailableDay >= 0 ? firstAvailableDay : 0);
  };




  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!selectedTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      setLoading(true);
      const slotObj = docSlots[slotIndex].find((slot) => slot.time === selectedTime);
      if (!slotObj) {
        toast.error("Selected slot not found");
        return;
      }

      const date = slotObj.dateTime;
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const slotDate = `${day}-${month}-${year}`;

      const { data } = await axios.post(
        `${backendURL}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime: selectedTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error booking appointment");
      }
    } finally {
      setLoading(false);
    }
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
              {docInfo.experience} Year
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
      <div className="mt-8 font-medium text-gray-700">
        <p className="text-lg font-semibold mb-2">Booking Slots</p>
        <div className="flex gap-3 items-center time-slots-scroll overflow-x-auto py-2">
          {docSlots.map((daySlots, index) =>
            daySlots.length > 0 ? (
              <div
                key={index}
                className={`text-center py-4 min-w-[4rem] rounded-full cursor-pointer ${slotIndex === index ? "bg-[rgb(95,111,255)] text-white" : "border border-gray-400"
                  }`}
                onClick={() => setSlotIndex(index)}
              >
                <p className="font-semibold">{daysOfWeek[daySlots[0].dateTime.getDay()]}</p>
                <p>{daySlots[0].dateTime.getDate()}</p>
              </div>
            ) : null
          )}
        </div>
        <div className="overflow-x-auto flex gap-3 time-slots-scroll mt-4 pb-2">
          {docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? (
            docSlots[slotIndex].map((item, index) => (
              <div
                key={index}
                className={`flex-shrink-0 text-sm font-light px-5 py-2 rounded-full cursor-pointer ${selectedTime === item.time
                  ? "bg-[rgb(95,111,255)] text-white"
                  : "border border-gray-300 hover:bg-gray-200"
                  }`}
                onClick={() => setSelectedTime(item.time)}
              >
                {item.time}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No slots available</p>
          )}
        </div>
        <button
          className="bg-[rgb(95,111,255)] text-white text-sm font-light px-14 py-3 rounded-full my-6 w-full sm:w-auto flex items-center justify-center"
          onClick={bookAppointment}
          disabled={loading}
        >
          {loading ? "Booking..." : "Book an Appointment"}
        </button>
      </div>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointments;
