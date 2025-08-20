import React from 'react'
import { toast,  Bounce } from 'react-toastify';
const Toast = (type,message) => {
 const options= {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Bounce,
    }
    switch (type) {
        case "success":
          toast.success(message, options);
          break;
        case "info":
          toast.info(message, options);
          break;
        case "error":
          toast.error(message, options);
          break;
        default:
          toast(message, options); 
      }
    
      return null; 
    
}

export default Toast;
