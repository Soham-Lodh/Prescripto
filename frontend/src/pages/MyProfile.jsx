import React, { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: " richardjameswap@gmail.com",
    phone: "+1 123 456 7840",
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Church Road,lONDON",
    },
    gender: "Male",
    dob: "1999-01-20",
  });
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className="max-w-lg flex flex-col gap-2 text-lg">
      <img src={userData.image} alt="" className="w-36 rounded " />
      {isEdit ? (
        <input
          type="text"
          className="bg-gray-200 text-3xl font-medium max-w-60 mt-4 border border-gray-500"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
        <p className="font-medium text-[rgb(95,111,255)]">Email Id:</p>
        <p className="">{userData.email}</p>
        <p className="font-medium text-[rgb(95,111,255)]">Phone:</p>
        {isEdit ? (
          <input
            type="text"
            className="bg-gray-200 border border-gray-500"
            value={userData.phone}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        ) : (
          <p className="">{userData.phone}</p>
        )}
        <p className="font-medium text-[rgb(95,111,255)]">Address:</p>
        {isEdit ? (
          <p>
            <input
              type="text"
              placeholder="Address Line 1"
              value={userData.address.line1}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
              className="bg-gray-200 border border-gray-500"
            />
            <br />
            <input
              type="text"
              placeholder="Address Line 2"
              value={userData.address.line2}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
              className="bg-gray-200 border border-gray-500"
            />
          </p>
        ) : (
          <p>
            {userData.address.line1}
            <br />
            {userData.address.line2}
          </p>
        )}
      </div>
      <div className="">
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium text-[rgb(95,111,255)]">Gender:</p>
          {isEdit ? (
            <select
              className="bg-gray-200 border border-gray-500"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p>{userData.gender}</p>
          )}
          <p className="font-medium text-[rgb(95,111,255)]">D.O.B.:</p>
          {isEdit ? (
            <input
              className="bg-gray-200 border border-gray-500"
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
            />
          ) : (
            <p>{userData.dob}</p>
          )}
        </div>
      </div>
      <div className="">
        {isEdit ? (
          <button className="" onClick={() => setIsEdit(false)}>
            Save Information
          </button>
        ) : (
          <button
            className="bg-[rgb(95,111,255)] rounded-full text-white px-7 py-2 hover:translate-y-[-5px] transition-all duration-500"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};
export default MyProfile;
