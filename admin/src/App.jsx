import React,{useContext} from 'react';
import Login from "./pages/Login.jsx";
import { ToastContainer, toast } from 'react-toastify';
import {AdminContext} from "./context/AdminContext.jsx";
import NavBar from './components/NavBar.jsx';
import SideBar from "./components/SideBar.jsx";
const App = () => {
  const {aToken}=useContext(AdminContext);
  return aToken?(
    <div className='mx-4 bg-gray-100 sm:mx-[10%]'>
      <NavBar/>
      <ToastContainer/>
      <div className="flex items-start">
        <SideBar/>
      </div>
    </div>
  ):(
    <div className='mx-4 bg-gray-100 sm:mx-[10%]'>
      <Login/>
      <ToastContainer/>
    </div>
  );
};

export default App;