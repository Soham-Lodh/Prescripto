import React, { useState, useContext } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [fee, setFee] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [education, setEducation] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!docImg) return toast.error("Please upload doctor's image");

    const formData = new FormData();
    formData.append("docImg", docImg);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("experience", experience);
    formData.append("fees", Number(fee));
    formData.append("speciality", speciality);
    formData.append("degree", education);
    formData.append(
      "address",
      JSON.stringify({ line1: address1, line2: address2 })
    );
    formData.append("about", about);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            atoken: aToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("");
        setFee("");
        setSpeciality("General Physician");
        setEducation("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-gray-100 shadow-md rounded-lg p-6 w-full max-w-6xl mx-auto space-y-8"
      onSubmit={onSubmitHandler}
    >
      <p className="text-3xl font-semibold text-gray-700 text-center">
        Add Doctor
      </p>

      <div className="flex flex-col items-center">
        <label htmlFor="doc-img" className="cursor-pointer">
          <img
            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
            alt="Upload area"
            className="w-32 h-32 object-cover rounded-full border border-gray-300 hover:opacity-80 transition"
          />
        </label>
        <input
          type="file"
          id="doc-img"
          hidden
          onChange={(e) => setDocImg(e.target.files[0])}
        />
        <p className="text-gray-500 text-sm mt-2">Upload picture</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-medium text-gray-600">Doctor Name</p>
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="font-medium text-gray-600">Doctor Email</p>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="font-medium text-gray-600">Doctor Password</p>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="font-medium text-gray-600">Experience (in years)</p>
          <input
            type="number"
            placeholder="Experience"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="font-medium text-gray-600">Consultation Fee ($)</p>
          <input
            type="number"
            placeholder="Fee"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="font-medium text-gray-600">Doctor Speciality</p>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            required
          >
            <option value="">Select Speciality</option>
            <option value="General Physician">General Physician</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="ENT Specialist">ENT Specialist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Psychiatrist">Psychiatrist</option>
          </select>
        </div>

        <div>
          <p className="font-medium text-gray-600">Doctor Education</p>
          <input
            type="text"
            placeholder="Education"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="font-medium text-gray-600">Doctor Address</p>
          <input
            type="text"
            placeholder="Address Line 1"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address Line 2"
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            required
          />
        </div>

        <div className="md:col-span-2">
          <p className="font-medium text-gray-600">Doctor About</p>
          <textarea
            placeholder="About the doctor..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className={`bg-[rgb(95,111,255)] text-white font-medium px-6 py-2 rounded-md hover:bg-blue-600 transition flex items-center justify-center`}
          disabled={loading} // prevent double submission
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            "Add Doctor"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
