import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import PremiumConfirmModal from "../../components/PremiumConfirmModal";

const DoctorAppointments = () => {
  const { dToken, appointments, getDoctorAppointments, cancelAppointment, completeAppointment } =
    useContext(DoctorContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);
  const [sortOrder, setSortOrder] = useState("latest");
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (dToken) {
      getDoctorAppointments();
    }
  }, [dToken]);

  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 0;
    const parts = dateStr.split(/[-_/]/);
    const [day, month, year] = parts;
    const [hour, minute] = timeStr.split(":");
    return new Date(year, month - 1, day, hour, minute);
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = parseDateTime(a.slotDate, a.slotTime);
    const dateB = parseDateTime(b.slotDate, b.slotTime);
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  const formatTime = (time) => {
    if (!time) return "—";
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const display = hour % 12 || 12;
    return `${display}:${m} ${suffix}`;
  };

  const openActionConfirm = (appointment, action) => {
    setPendingAction({ appointment, action });
  };

  const closeActionConfirm = () => {
    setPendingAction(null);
  };

  const confirmAppointmentAction = async () => {
    if (!pendingAction?.appointment) return;

    setActionLoading(true);
    const success =
      pendingAction.action === "complete"
        ? await completeAppointment(pendingAction.appointment._id)
        : await cancelAppointment(pendingAction.appointment._id);
    setActionLoading(false);

    if (success) {
      closeActionConfirm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Your Appointments
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track your upcoming appointments
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                setSortOrder(sortOrder === "latest" ? "oldest" : "latest")
              }
              className="px-5 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-xl shadow hover:bg-indigo-50 font-medium transition"
            >
              Sort: {sortOrder === "latest" ? "Latest First" : "Oldest First"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div
            className="
              hidden sm:grid
              grid-cols-[60px_1.7fr_2.8fr_2fr_1.2fr_200px]
              py-5 px-8
              bg-gradient-to-r from-indigo-50 to-purple-50
              border-b border-indigo-100
              text-gray-600 font-semibold text-xs uppercase tracking-wider
            "
          >
            <div><p>#</p></div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11"></div>
              <p>Patient</p>
            </div>
            <div className="pl-12"><p>Date & Time</p></div>
            <div><p>Amount</p></div>
            <div><p>Status</p></div>
            <div className="pl-20"><p>Actions</p></div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            {appointments.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No appointments yet</p>
              </div>
            ) : (
              sortedAppointments.map((item, index) => (
                <div
                  key={index}
                  className="
                    sm:grid sm:grid-cols-[60px_1.7fr_2.8fr_2fr_1.2fr_200px]
                    flex flex-wrap sm:flex-nowrap gap-x-6
                    items-center py-6 px-8 border-b border-gray-100
                    hover:bg-indigo-50/40 transition-all
                  "
                >
                  <p className="text-gray-400 font-semibold text-sm sm:block hidden">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={item.userData.image}
                      className="w-11 h-11 rounded-full object-cover border"
                      alt="Patient"
                    />
                    <div>
                      <p className="font-semibold">{item.userData.name}</p>
                      <p className="text-xs text-gray-500">
                        Age: {calculateAge(item.userData.dob)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col pl-6">
                    <span className="text-sm font-medium">
                      {slotDateFormat(item.slotDate)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {formatTime(item.slotTime)}
                    </span>
                  </div>

                  <div className="text-lg font-bold text-gray-900">
                    ${item.amount}
                  </div>

                  <div>
                    {item.cancelled ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Scheduled
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pl-8">
                    {item.cancelled ? (
                      <span className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
                        Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                        Completed
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => openActionConfirm(item, "complete")}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-200 transition"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => openActionConfirm(item, "cancel")}
                          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:border-red-500 hover:bg-red-50 transition text-gray-600 hover:text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}
      </style>

      <PremiumConfirmModal
        open={Boolean(pendingAction)}
        tone={pendingAction?.action === "cancel" ? "danger" : "success"}
        title={
          pendingAction?.action === "cancel" ? "Confirm Cancellation" : "Confirm Completion"
        }
        subtitle={
          pendingAction?.action === "cancel"
            ? "Please confirm this appointment should be cancelled."
            : "Mark this appointment as completed after the consultation."
        }
        confirmLabel={
          pendingAction?.action === "cancel" ? "Cancel Appointment" : "Complete Appointment"
        }
        cancelLabel="Back"
        loading={actionLoading}
        onConfirm={confirmAppointmentAction}
        onCancel={closeActionConfirm}
        meta={
          pendingAction?.appointment ? (
            <div className="flex items-center gap-4">
              <img
                src={pendingAction.appointment.userData?.image}
                alt={pendingAction.appointment.userData?.name || "Patient"}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
              />
              <div>
                <p className="text-base font-bold">{pendingAction.appointment.userData?.name}</p>
                <p className="text-sm opacity-90">{pendingAction.appointment.userData?.email}</p>
                <p className="text-sm opacity-90">
                  {slotDateFormat(pendingAction.appointment.slotDate)} • {formatTime(pendingAction.appointment.slotTime)}
                </p>
              </div>
            </div>
          ) : null
        }
      >
        {pendingAction?.appointment && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</p>
              <p className="mt-1 text-base font-bold text-slate-900">${pendingAction.appointment.amount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
              <p className="mt-1 text-base font-bold text-slate-900">
                {pendingAction.appointment.cancelled
                  ? "Cancelled"
                  : pendingAction.appointment.isCompleted
                  ? "Completed"
                  : "Scheduled"}
              </p>
            </div>
          </div>
        )}
      </PremiumConfirmModal>
    </div>
  );
};

export default DoctorAppointments;
