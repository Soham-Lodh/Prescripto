import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import PremiumConfirmModal from "../../components/PremiumConfirmModal";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  experience: "",
  fees: "",
  speciality: "General Physician",
  degree: "",
  address1: "",
  address2: "",
  about: "",
  available: true,
  docImg: null,
};

const specialityOptions = [
  "General Physician",
  "Neurologist",
  "Gynecologist",
  "Gastroenterologist",
  "Cardiologist",
  "Dermatologist",
  "Orthopedic",
  "ENT Specialist",
  "Pediatrician",
  "Psychiatrist",
];

const DoctorsList = () => {
  const {
    doctors,
    getAllDoctors,
    aToken,
    changeAvailability,
    updateDoctor,
    deleteDoctor,
  } = useContext(AdminContext);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [availabilityTarget, setAvailabilityTarget] = useState(null);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [pendingEditData, setPendingEditData] = useState(null);
  const [editConfirmDetails, setEditConfirmDetails] = useState([]);
  const [editConfirmMeta, setEditConfirmMeta] = useState(null);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  useEffect(() => {
    if (!isEditOpen) {
      setImagePreview("");
      return;
    }

    if (form.docImg) {
      const objectUrl = URL.createObjectURL(form.docImg);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setImagePreview(editingDoctor?.image || "");
  }, [editingDoctor, form.docImg, isEditOpen]);

  const openEditModal = (doctor) => {
    const address = doctor.address || {};

    setEditingDoctor(doctor);
    setForm({
      name: doctor.name || "",
      email: doctor.email || "",
      password: "",
      experience: doctor.experience || "",
      fees: doctor.fees ?? "",
      speciality: doctor.speciality || "General Physician",
      degree: doctor.degree || "",
      address1: address.line1 || "",
      address2: address.line2 || "",
      about: doctor.about || "",
      available: doctor.available ?? true,
      docImg: null,
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingDoctor(null);
    setForm(initialFormState);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
  };

  const closeAvailabilityModal = () => {
    setAvailabilityTarget(null);
  };

  const closeEditConfirm = () => {
    setEditConfirmOpen(false);
    setPendingEditData(null);
    setEditConfirmDetails([]);
    setEditConfirmMeta(null);
  };

  const onFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmitEdit = async (event) => {
    event.preventDefault();

    if (!editingDoctor?._id) {
      return;
    }

    const formData = new FormData();
    formData.append("docId", editingDoctor._id);
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("experience", form.experience);
    formData.append("fees", form.fees);
    formData.append("speciality", form.speciality);
    formData.append("degree", form.degree);
    formData.append("address", JSON.stringify({
      line1: form.address1,
      line2: form.address2,
    }));
    formData.append("about", form.about);
    formData.append("available", String(form.available));

    if (form.password.trim()) {
      formData.append("password", form.password.trim());
    }

    if (form.docImg) {
      formData.append("docImg", form.docImg);
    }

    const changes = [
      { label: "Name", before: editingDoctor.name, after: form.name },
      { label: "Email", before: editingDoctor.email, after: form.email },
      { label: "Speciality", before: editingDoctor.speciality, after: form.speciality },
      { label: "Degree", before: editingDoctor.degree, after: form.degree },
      { label: "Experience", before: editingDoctor.experience, after: form.experience },
      { label: "Fee", before: `$${editingDoctor.fees}`, after: `$${form.fees}` },
      {
        label: "Address",
        before: `${editingDoctor.address?.line1 || ""} ${editingDoctor.address?.line2 || ""}`.trim(),
        after: `${form.address1} ${form.address2}`.trim(),
      },
      { label: "Availability", before: editingDoctor.available ? "Available" : "Unavailable", after: form.available ? "Available" : "Unavailable" },
    ].filter((item) => String(item.before) !== String(item.after));

    const hasImageChange = Boolean(form.docImg);
    const hasPasswordChange = Boolean(form.password.trim());
    if (hasImageChange) {
      changes.unshift({ label: "Photo", before: "Current photo", after: "New photo selected" });
    }
    if (hasPasswordChange) {
      changes.push({ label: "Password", before: "Existing password", after: "Password reset" });
    }

    setPendingEditData(formData);
    setEditConfirmDetails(changes);
    setEditConfirmMeta(
      <div className="flex items-center gap-4">
        <img
          src={imagePreview || editingDoctor.image}
          alt={editingDoctor.name}
          className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
        />
        <div>
          <p className="text-base font-bold">{editingDoctor.name}</p>
          <p className="text-sm opacity-90">{editingDoctor.speciality}</p>
          <p className="text-sm opacity-90">{editingDoctor.email}</p>
        </div>
      </div>
    );
    setEditConfirmOpen(true);
  };

  const onDeleteDoctor = async (doctor) => {
    setDeleteTarget(doctor);
  };

  const onAvailabilityToggle = (doctor) => {
    setAvailabilityTarget(doctor);
  };

  const confirmAvailabilityChange = async () => {
    if (!availabilityTarget?._id) return;

    setAvailabilitySaving(true);
    const success = await changeAvailability(availabilityTarget._id);
    setAvailabilitySaving(false);

    if (success !== false) {
      closeAvailabilityModal();
    }
  };

  const confirmEditUpdate = async () => {
    if (!pendingEditData) return;

    setSaving(true);
    const success = await updateDoctor(pendingEditData);
    setSaving(false);

    if (success) {
      closeEditConfirm();
      closeEditModal();
    }
  };

  const confirmDeleteDoctor = async () => {
    if (!deleteTarget?._id) {
      return;
    }

    setDeletingId(deleteTarget._id);
    const success = await deleteDoctor(deleteTarget._id);
    setDeletingId("");

    if (success && editingDoctor?._id === deleteTarget._id) {
      closeEditModal();
    }

    if (success) {
      closeDeleteModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto mb-14">
        <div className="text-center space-y-3 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">
            Medical Team
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage and monitor your healthcare professionals
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-slideInLeft"></div>

            <div className="px-4 py-1.5 bg-indigo-100 rounded-full shadow-sm backdrop-blur">
              <span className="text-sm font-semibold text-indigo-700 tracking-wide">
                {doctors.length} Doctors
              </span>
            </div>

            <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-slideInRight"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {doctors.map((item, idx) => (
            <div
              key={item._id || idx}
              className="
                group relative bg-white rounded-2xl overflow-hidden border border-gray-100
                shadow-md hover:shadow-2xl transition-all duration-500
                hover:-translate-y-2 hover:scale-[1.02]
                animate-fadeUp opacity-0 translate-y-8
              "
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="absolute top-4 right-4 z-10">
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-lg transition-all duration-300 shadow-md ${
                    item.available
                      ? "bg-green-500/90 text-white shadow-green-500/30"
                      : "bg-red-500/90 text-white shadow-red-500/30"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.available ? "bg-white animate-pulse" : "bg-white"
                      }`}
                    ></span>
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    w-full h-full object-cover
                    transition-all duration-[1200ms]
                    group-hover:scale-110 group-hover:rotate-[1.5deg]
                  "
                />

                <div className="
                  absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500
                "></div>
              </div>

              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <h3 className="
                    text-xl font-bold text-gray-800
                    group-hover:text-indigo-600 transition-colors duration-300
                  ">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <p className="text-sm font-medium text-gray-600">{item.speciality}</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700 hover:shadow-lg"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteDoctor(item)}
                    disabled={deletingId === item._id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {deletingId === item._id ? "Deleting..." : "Delete"}
                  </button>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group/toggle">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={item.available}
                        onChange={() => onAvailabilityToggle(item)}
                        className="sr-only peer"
                      />

                      <div className="
                        w-11 h-6 bg-gray-300 rounded-full shadow-inner
                        peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-purple-600
                        transition-all duration-300
                      "></div>

                      <div className="
                        absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md
                        peer-checked:translate-x-5 transition-all duration-300
                      "></div>
                    </div>

                    <span className="
                      text-sm font-medium text-gray-700
                      group-hover/toggle:text-indigo-600 transition-colors duration-200
                    ">
                      Availability
                    </span>
                  </label>
                </div>
              </div>

              <div className="
                absolute inset-0 rounded-2xl
                border-2 border-transparent
                group-hover:border-indigo-500/50
                transition-all duration-500 pointer-events-none
              "></div>
            </div>
          ))}
        </div>

        {doctors.length === 0 && (
          <div className="text-center py-24 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4 shadow-inner">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No doctors found
            </h3>

            <p className="text-gray-500">
              Start by adding doctors to your team.
            </p>
          </div>
        )}
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-white/20">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-6 sm:px-8 py-5 backdrop-blur">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Doctor</h2>
                <p className="text-sm text-gray-500">
                  Update profile details, availability, and login credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close edit modal"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={onSubmitEdit} className="px-6 sm:px-8 py-6 space-y-8">
              <div className="flex flex-col items-center">
                <label htmlFor="edit-doc-img" className="group cursor-pointer">
                  <div className="relative">
                    <img
                      src={imagePreview || editingDoctor?.image}
                      alt={editingDoctor?.name || "Doctor"}
                      className="h-36 w-36 rounded-2xl border-4 border-gray-200 object-cover shadow-lg transition-all duration-300 group-hover:border-indigo-400 group-hover:shadow-xl group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end justify-center rounded-2xl bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pb-3">
                      <span className="text-sm font-medium text-white">Change Photo</span>
                    </div>
                  </div>
                </label>

                <input
                  id="edit-doc-img"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, docImg: e.target.files?.[0] || null }))
                  }
                />

                <p className="mt-3 text-sm text-gray-500">
                  Leave blank to keep the current photo.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Doctor Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => onFieldChange("name", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => onFieldChange("email", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => onFieldChange("password", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Optional password reset"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={(e) => onFieldChange("experience", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Consultation Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.fees}
                    onChange={(e) => onFieldChange("fees", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Speciality</label>
                  <select
                    value={form.speciality}
                    onChange={(e) => onFieldChange("speciality", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                  >
                    {specialityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Education</label>
                  <input
                    type="text"
                    value={form.degree}
                    onChange={(e) => onFieldChange("degree", e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Address</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={form.address1}
                      onChange={(e) => onFieldChange("address1", e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      required
                    />
                    <input
                      type="text"
                      value={form.address2}
                      onChange={(e) => onFieldChange("address2", e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">About Doctor</label>
                  <textarea
                    value={form.about}
                    onChange={(e) => onFieldChange("about", e.target.value)}
                    className="h-36 w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(e) => onFieldChange("available", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      Available for bookings
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-indigo-50/40 px-0 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Review Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PremiumConfirmModal
        open={editConfirmOpen}
        title="Confirm Doctor Update"
        subtitle="Review the current and updated information before saving."
        tone="primary"
        confirmLabel="Save Updates"
        cancelLabel="Back"
        loading={saving}
        onConfirm={confirmEditUpdate}
        onCancel={closeEditConfirm}
        meta={editConfirmMeta}
      >
        <div className="space-y-3">
          {editConfirmDetails.length > 0 ? (
            editConfirmDetails.map((item) => (
              <div key={item.label} className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_1.2fr_1.2fr]">
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
              No visible changes detected, but the doctor profile will still be revalidated.
            </div>
          )}
        </div>
      </PremiumConfirmModal>

      <PremiumConfirmModal
        open={Boolean(availabilityTarget)}
        title="Confirm Availability Change"
        subtitle="This change will update the doctor status immediately after confirmation."
        tone="success"
        confirmLabel={availabilityTarget?.available ? "Make Unavailable" : "Make Available"}
        cancelLabel="Cancel"
        loading={availabilitySaving}
        onConfirm={confirmAvailabilityChange}
        onCancel={closeAvailabilityModal}
        meta={
          <div className="flex items-center gap-4">
            <img
              src={availabilityTarget?.image}
              alt={availabilityTarget?.name || "Doctor"}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
            />
            <div>
              <p className="text-base font-bold">{availabilityTarget?.name}</p>
              <p className="text-sm opacity-90">{availabilityTarget?.speciality}</p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Status</p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {availabilityTarget?.available ? "Available" : "Unavailable"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">New Status</p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {availabilityTarget?.available ? "Unavailable" : "Available"}
            </p>
          </div>
        </div>
      </PremiumConfirmModal>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-rose-600 to-red-600 px-6 py-5 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86l-7.42 12.8A2 2 0 004.6 20h14.8a2 2 0 001.73-3.34l-7.42-12.8a2 2 0 00-3.46 0z"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold">Delete Doctor</h3>
                  <p className="mt-1 text-sm text-white/90">
                    This action permanently removes the doctor and all of their appointments.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4">
                <p className="text-sm font-semibold text-rose-700">Doctor to be deleted</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  Dr. {deleteTarget.name}
                </p>
                <p className="text-sm text-gray-600">{deleteTarget.speciality}</p>
                <p className="mt-2 text-sm text-gray-600">
                  Email: <span className="font-medium text-gray-800">{deleteTarget.email}</span>
                </p>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                  All appointment records for this doctor will be removed.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                  The doctor will not be able to log in again after deletion.
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                  This cannot be undone from the admin panel.
                </li>
              </ul>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteDoctor}
                disabled={deletingId === deleteTarget._id}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingId === deleteTarget._id ? "Deleting..." : "Yes, Delete Doctor"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }

        @keyframes slideInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
        }

        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
        }
      `}
      </style>
    </div>
  );
};

export default DoctorsList;
