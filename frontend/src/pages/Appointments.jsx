import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import {assets} from '../assets/assets_frontend/assets';

const Appointments = () => {
  const { docId } = useParams();
  const { doctors,currency } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots,setDocSlots]=useState([]);
  const [slotInfo,setSlotInfo]=useState(0);
  const [slotTime,setSlotTime]=useState('');
  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  }
  const getAvailableSlots=async()=>{

  }
  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);
  useEffect(()=>{
    getAvailableSlots();
  },[docInfo]);
  if (!docInfo) return null;

  return (
    <div className=''>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="">
          <img className='bg-[rgb(95,111,255)] w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={`${docInfo.name} Image`} />
        </div>
        <div className="flex-1 border-2 border-gray-500 rounded-lg p-8 py-7 bg-gray-100 mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className='flex items-center gap-2 text-2x1 font-medium text-gray-900'>
            {docInfo.name} <img className='w-5' src={assets.verified_icon} alt="Verified Icon"/>
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <p className="py=0.5 px-2 border-2 border-gray-400 text-sm rounded-full">{docInfo.experience}</p>
          </div>
          <div className="">
            <p className='flex itmes-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="Info Icon"/></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className="text-gray-500 mt-4 font-medium">
            Appointment fee: <span className="text-gray-600">{currency}{docInfo.fees}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
