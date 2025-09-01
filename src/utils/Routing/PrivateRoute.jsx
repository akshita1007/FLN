import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { MotionConfig } from "framer-motion";
import './PrivateRoute.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
    const { token,user } = useAuth();
    return token !== ""?
    <>
    <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
    <div className="app">
        
        <Sidebar/>
        <div style={{paddingLeft:"20px",paddingRight:"20px",width: "100%"}}>
        {children}
        </div>
        </div>
    </MotionConfig>
</> : <Navigate to="/login" />;
};

export default PrivateRoute;