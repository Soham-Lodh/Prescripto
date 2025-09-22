import React from 'react';
import {assets} from "../assets/assets_frontend/assets";
import {useNavigate} from "react-router-dom";
const Footer = () => {
    const navigate=useNavigate();
  return (
    <div className="md:mx-10">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
            <div className="">
                <img onClick={()=>{navigate("/");scrollTo(0,0);}} src={assets.logo} alt="Logo" className="mb-5 w-40 cursor-pointer" />
                <p className="w-full md:w-2/3 text-gray-600 leading-6 text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel consequat metus, in accumsan felis. Fusce a neque leo. Suspendisse pharetra felis nisl, nec molestie lorem tempor non. Mauris nec velit at turpis egestas semper nec nec leo. Vivamus vel turpis et ipsum dictum laoreet in mollis nunc. Nam nibh enim, tempus non sodales a, rhoncus ut mi. Aliquam dolor ligula, commodo at nunc nec, vehicula consectetur lectus. Etiam sed fringilla tortor.
                </p>
            </div>
            <div className="">
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li onClick={()=>{navigate("/");scrollTo(0,0);}} className='cursor-pointer'>Home</li>
                    <li onClick={()=>{navigate("/about");scrollTo(0,0);}} className='cursor-pointer'>About Us</li>
                    <li onClick={()=>{navigate("/contact");scrollTo(0,0);}} className='cursor-pointer'>Contact Us</li>
                    <li onClick={()=>{navigate("/");scrollTo(0,0);}} className='cursor-pointer'>Privacy Policy</li>
                </ul>
            </div>
            <div className="">
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91 0123456789</li>
                    <li>test@gmail.com</li>
                </ul>
            </div>
        </div>
        <div className="">
            <hr className="h-2"/>
            <p className="py-5 text-sm text-center">© 2025 Prescripto. All rights reserved.</p>
        </div>
    </div>
  );
};

export default Footer;