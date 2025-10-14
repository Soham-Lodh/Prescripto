import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, getAllDoctors, aToken, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      const fetchDoctors = async () => {
        await getAllDoctors();
      };
      fetchDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] w-full overflow-y-scroll">
      <p className="text-center text-3xl font-bold text-gray-600 mb-12">
        ALL <span className="text-[rgb(95,111,255)]">DOCTORS</span>
      </p>

      <div className="flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="border-2 border-[rgb(95,111,255)] w-56 rounded-md p-2 overflow-hidden cursor-pointer group"
            key={index}
          >
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-40 object-cover transition-all duration-500 rounded-xl
                ${
                  item.available
                    ? "bg-indigo-50 hover:bg-[rgb(95,111,255)]"
                    : "bg-red-50 hover:bg-red-600"
                }
              `}
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-md">{item.speciality}</p>

              <div className="mt-2 flex items-center gap-1 text-md">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => changeAvailability(item._id)}
                  className="accent-[rgb(95,111,255)] w-4 h-4"
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
