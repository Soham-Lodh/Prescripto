import React,{useContext} from 'react';
import Login from "./pages/Login.jsx";
import { ToastContainer, toast } from 'react-toastify';
import {AdminContext} from "./context/AdminContext.jsx";
const App = () => {
  const {aToken}=useContext(AdminContext);
  return aToken?(
    <div className='bg-gray-100'>
      <ToastContainer/>
    </div>
  ):(
    <div className='bg-gray-100'>
      <Login/>
      <ToastContainer/>
    </div>
  );
};

export default App;