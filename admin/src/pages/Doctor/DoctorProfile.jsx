import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import PremiumConfirmModal from "../../components/PremiumConfirmModal";

const DoctorProfile = () => {
  const { dToken, doctorData, getDoctorProfile, updateDoctorProfile, changeAvailability } =
    useContext(DoctorContext);

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showAvailabilityConfirm, setShowAvailabilityConfirm] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState(null);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [saveMeta, setSaveMeta] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [formData, setFormData] = useState({
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    fees: "",
    address: {},
  });

  useEffect(() => {
    if (dToken) {
      getDoctorProfile();
    }
  }, [dToken]);

  useEffect(() => {
    if (Object.keys(doctorData).length > 0) {
      setFormData({
        speciality: doctorData.speciality || "",
        degree: doctorData.degree || "",
        experience: doctorData.experience || "",
        about: doctorData.about || "",
        fees: doctorData.fees || "",
        address: doctorData.address || {},
      });
      setProfilePreview(doctorData.image || "");
    }
  }, [doctorData]);

  useEffect(() => {
    if (!profileImage) return;

    const objectUrl = URL.createObjectURL(profileImage);
    setProfilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const openSaveConfirm = (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("speciality", formData.speciality);
    submitData.append("degree", formData.degree);
    submitData.append("experience", formData.experience);
    submitData.append("about", formData.about);
    submitData.append("fees", formData.fees);
    submitData.append("address", JSON.stringify(formData.address));

    if (profileImage) {
      submitData.append("docImg", profileImage);
    }

    const changes = [
      { label: "Speciality", before: doctorData.speciality, after: formData.speciality },
      { label: "Degree", before: doctorData.degree, after: formData.degree },
      { label: "Experience", before: doctorData.experience, after: formData.experience },
      { label: "Fees", before: `$${doctorData.fees}`, after: `$${formData.fees}` },
      { label: "About", before: doctorData.about, after: formData.about },
      {
        label: "Address",
        before: `${doctorData.address?.line1 || ""} ${doctorData.address?.line2 || ""}`.trim(),
        after: `${formData.address?.line1 || ""} ${formData.address?.line2 || ""}`.trim(),
      },
    ].filter((item) => String(item.before) !== String(item.after));

    if (profileImage) {
      changes.unshift({ label: "Photo", before: "Current photo", after: "New photo selected" });
    }

    setPendingSubmitData(submitData);
    setPendingChanges(changes);
    setSaveMeta(
      <div className="flex items-center gap-4">
        <img
          src={profilePreview || doctorData.image}
          alt={doctorData.name}
          className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
        />
        <div>
          <p className="text-base font-bold">{doctorData.name}</p>
          <p className="text-sm opacity-90">{doctorData.speciality}</p>
          <p className="text-sm opacity-90">{doctorData.email}</p>
        </div>
      </div>
    );
    setShowSaveConfirm(true);
  };

  const closeSaveConfirm = () => {
    setShowSaveConfirm(false);
    setPendingSubmitData(null);
    setPendingChanges([]);
    setSaveMeta(null);
  };

  const confirmProfileUpdate = async () => {
    if (!pendingSubmitData) return;

    setSaving(true);
    const success = await updateDoctorProfile(pendingSubmitData);
    setSaving(false);

    if (success) {
      closeSaveConfirm();
      setIsEditing(false);
      setProfileImage(null);
    }
  };

  const openAvailabilityConfirm = () => {
    setShowAvailabilityConfirm(true);
  };

  const closeAvailabilityConfirm = () => {
    setShowAvailabilityConfirm(false);
  };

  const confirmAvailabilityChange = async () => {
    setAvailabilityLoading(true);
    const success = await changeAvailability();
    setAvailabilityLoading(false);

    if (success) {
      closeAvailabilityConfirm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your professional information</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-12 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={doctorData.image}
                  alt={doctorData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg hover:shadow-xl transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </label>
                )}
              </div>

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-3xl font-bold">{doctorData.name}</h2>
                <p className="text-indigo-100 mt-1 text-lg">{doctorData.speciality}</p>
                <p className="text-indigo-100 mt-2">
                  {doctorData.experience} years of experience
                </p>
              </div>

              <div className="sm:absolute sm:top-8 sm:right-8">
                <button
                  type="button"
                  onClick={openAvailabilityConfirm}
                  className="flex items-center gap-3 cursor-pointer bg-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/30 transition"
                >
                  <div className="relative">
                    <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner peer-checked:bg-green-500 transition-all duration-300"></div>
                    <div
                      className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                        doctorData.available ? "translate-x-4" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {doctorData.available ? "Available" : "Unavailable"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            {!isEditing ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: "Email", value: doctorData.email, editable: false },
                    { label: "Degree", value: doctorData.degree, editable: true },
                    { label: "Experience", value: `${doctorData.experience} years`, editable: true },
                    { label: "Consultation Fee", value: `$${doctorData.fees}`, editable: true },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">
                        {item.label}
                      </p>
                      <p className="text-xl font-bold text-gray-900 mt-2">
                        {item.value}
                      </p>
                      {item.editable && (
                        <p className="text-xs text-indigo-600 mt-2 font-medium">
                          Editable
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-3">
                    About
                  </p>
                  <p className="text-gray-700 leading-relaxed">{doctorData.about}</p>
                </div>

                <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-3">
                    Address
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                    <p>
                      <span className="font-semibold">Line 1:</span>{" "}
                      {doctorData.address?.line1}
                    </p>
                    <p>
                      <span className="font-semibold">Line 2:</span>{" "}
                      {doctorData.address?.line2}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={openSaveConfirm} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Speciality
                    </label>
                    <input
                      type="text"
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Degree
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      name="fees"
                      value={formData.fees}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    About
                  </label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address.line1"
                      placeholder="Address Line 1"
                      value={formData.address.line1 || ""}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      name="address.line2"
                      placeholder="Address Line 2"
                      value={formData.address.line2 || ""}
                      onChange={handleInputChange}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Review Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileImage(null);
                    }}
                    className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <PremiumConfirmModal
        open={showSaveConfirm}
        tone="primary"
        title="Confirm Profile Update"
        subtitle="Review the doctor profile changes before saving."
        confirmLabel="Save Profile"
        cancelLabel="Back"
        loading={saving}
        onConfirm={confirmProfileUpdate}
        onCancel={closeSaveConfirm}
        meta={saveMeta}
      >
        <div className="space-y-3">
          {pendingChanges.length > 0 ? (
            pendingChanges.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_1.2fr_1.2fr]"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {item.label}
                </p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Before</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{item.before || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">After</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{item.after || "—"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-amber-800">
              No visible changes detected, but the profile will still be revalidated.
            </div>
          )}
        </div>
      </PremiumConfirmModal>

      <PremiumConfirmModal
        open={showAvailabilityConfirm}
        tone="success"
        title="Confirm Availability Change"
        subtitle="This will update your visible booking status."
        confirmLabel={doctorData.available ? "Make Unavailable" : "Make Available"}
        cancelLabel="Cancel"
        loading={availabilityLoading}
        onConfirm={confirmAvailabilityChange}
        onCancel={closeAvailabilityConfirm}
        meta={
          <div className="flex items-center gap-4">
            <img
              src={doctorData.image}
              alt={doctorData.name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
            />
            <div>
              <p className="text-base font-bold">{doctorData.name}</p>
              <p className="text-sm opacity-90">{doctorData.speciality}</p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Status</p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {doctorData.available ? "Available" : "Unavailable"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">New Status</p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {doctorData.available ? "Unavailable" : "Available"}
            </p>
          </div>
        </div>
      </PremiumConfirmModal>

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
    </div>
  );
};

export default DoctorProfile;
