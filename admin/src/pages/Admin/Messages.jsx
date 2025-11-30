import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const Messages = () => {
  const { aToken, allMessages, messages, setMessages } = useContext(AdminContext);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest

  useEffect(() => {
    if (aToken) {
      allMessages();
    }
  }, [aToken]);

  /* ---- FORMAT DATE ---- */
  const formatDateTime = (isoDate) => {
    if (!isoDate) return "";

    const date = new Date(isoDate);

    const optionsDate = { day: "2-digit", month: "short", year: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };

    return {
      date: date.toLocaleDateString("en-US", optionsDate),
      time: date.toLocaleTimeString("en-US", optionsTime),
    };
  };

  /* ---- SORT LOGIC ---- */
  const sortedMessages = [...(messages || [])].sort((a, b) => {
    if (sortOrder === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  /* ---- SORT BUTTON UI ---- */
  const sortLabel = sortOrder === "latest" ? "Latest First" : "Oldest First";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Messages
          </h1>
          <p className="text-gray-600">View and manage all customer messages</p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>

            <div className="px-4 py-1.5 bg-indigo-100 rounded-full">
              <span className="text-sm font-semibold text-indigo-700">
                {messages?.length || 0} Messages
              </span>
            </div>

            <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"></div>
          </div>

          {/* SORT BUTTON */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setSortOrder(sortOrder === "latest" ? "oldest" : "latest")}
              className="px-5 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-xl shadow hover:bg-indigo-50 font-medium transition"
            >
              Sort: {sortLabel}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[0.5fr_2fr_2fr_2fr_1fr] py-5 px-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">#</p>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-12">Name</p>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-20">Email</p>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider pl-9">Date & Time</p>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Action</p>
          </div>

          {/* Table Body */}
          <div className="max-h-[70vh] overflow-y-auto">
            {!messages || messages.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages found</h3>
                <p className="text-gray-500">New messages will appear here</p>
              </div>
            ) : (
              sortedMessages.map((msg, index) => {
                const dt = formatDateTime(msg.createdAt);

                return (
                  <div
                    key={index}
                    className="group flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2fr_2fr_2fr_1fr] items-center py-5 px-8 border-b border-gray-100 hover:bg-indigo-50/40 transition"
                  >

                    {/* Index */}
                    <p className="max-sm:hidden text-sm font-medium text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {msg.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800">{msg.name}</p>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-700 truncate">{msg.email}</p>
                    </div>

                    {/* CreatedAt Date + Time */}
                    <div className="flex flex-col pl-8">
                      <p className="text-sm font-medium text-gray-800">{dt.date}</p>
                      <p className="text-xs text-gray-500">{dt.time}</p>
                    </div>

                    {/* View Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:scale-105 hover:shadow transition flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Stats */}
        {messages && messages.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-800">{messages.length}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(messages.map(m => m.email)).size}
              </p>
            </div>

          </div>
        )}
      </div>

      {/* Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedMessage.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{selectedMessage.name}</h2>
                  <p className="text-indigo-100">{selectedMessage.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-8 overflow-y-auto" style={{ maxHeight: "60vh" }}>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Message Content</h3>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-5 flex justify-end border-t border-gray-200">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Messages;
