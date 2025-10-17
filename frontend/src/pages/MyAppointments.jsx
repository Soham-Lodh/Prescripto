import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyAppointments = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loadingCancel, setLoadingCancel] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(null);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const [day, month, year] = slotDate.split("-");
    return `${day} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/list-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setAppointments(data.appointments);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoadingCancel(appointmentId);
      const { data } = await axios.post(
        `${backendURL}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setAppointments((prev) =>
          prev.map((item) =>
            item._id === appointmentId ? { ...item, cancelled: true } : item
          )
        );
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingCancel(null);
    }
  };

  const handlePayment = async (appointmentId) => {
  try {
    setLoadingPayment(appointmentId);
    const { data } = await axios.post(
      `${backendURL}/api/user/payment`,
      { appointmentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.success) {
      toast.success(data.message);
      setAppointments((prevAppointments) =>
        prevAppointments.map((item) =>
          item._id === appointmentId ? { ...item, payment: true } : item
        )
      );

      await getDoctorsData();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoadingPayment(null);
  }
};


  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
      <div>
        {appointments.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            <div>
              <img
                src={item.docData.image}
                alt={item.docData.name}
                className="w-32 bg-indigo-100 rounded-lg"
              />
            </div>
            <div className="flex-1 text-lg text-zinc-600">
              <p className="text-neutral font-semibold">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-sm">{item?.docData?.address?.line1 || ""}</p>
              <p className="text-sm">{item?.docData?.address?.line2 || ""}</p>

              <p className="text-sm mt-1">
                <span className="text-zinc-700 font-medium text-lg">Date & Time: </span>
                {slotDateFormat(item.slotDate)} |{" "}
                {item.slotTime
                  ? (() => {
                      const [h, m] = item.slotTime.split(":");
                      const hour = parseInt(h, 10);
                      const suffix = hour >= 12 ? "pm" : "am";
                      const displayHour = hour % 12 || 12;
                      return `${displayHour}:${m} ${suffix}`;
                    })()
                  : "—"}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-center">
  {item.cancelled ? (
    <p className="text-red-500 px-4 py-2 border-2 border-red-500">
      Appointment Cancelled
    </p>
  ) : (
    <>
      {/* Payment Status */}
      {item.payment && (
        <p className="text-green-500 px-4 py-2 border-2 border-green-500 text-center">
          Paid
        </p>
      )}

      {/* Pay Online button only if not paid */}
      {!item.payment && (
        <button
          className="text-lg text-white bg-[rgb(95,111,255)] sm:min-w-48 py-3 px-4 rounded-md shadow-md hover:bg-[rgb(49,61,151)] transition-all duration-300 flex items-center justify-center"
          onClick={() => handlePayment(item._id)}
          disabled={loadingPayment === item._id}
        >
          {loadingPayment === item._id ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
          ) : (
            "Pay Online"
          )}
        </button>
      )}

      {/* Cancel button always visible (even if paid) */}
      <button
        className="text-lg text-white bg-red-500 sm:min-w-48 py-3 px-4 rounded-md shadow-md hover:bg-red-700 transition-all duration-300 flex items-center justify-center"
        onClick={() => cancelAppointment(item._id)}
        disabled={loadingCancel === item._id}
      >
        {loadingCancel === item._id ? (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
        ) : (
          "Cancel Appointment"
        )}
      </button>
    </>
  )}
</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
