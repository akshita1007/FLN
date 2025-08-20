import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');

  const handleError = (msg) => {
    setError(true);
    setMessage(msg);
  };

  const loginWithPassword = async (phoneNo, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/v1/user/login`, {clusterId: phoneNo,phoneNo: password });
      const { success, data, message } = response.data;

      if (success) {
        setUser(data);
        sessionStorage.setItem('userData', JSON.stringify(data));

        if (data.role === 'admin') {
          setToken(data.token);
          sessionStorage.setItem('token', data.token);
        } else {
          await sendOtp(phoneNo);
        }

        setMessage(message);
        setError(false);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError('Error occurred during login');
      console.error(err);
    }
  };

  const sendOtp = async (phoneNo) => {
    try {
      const otpResponse = await axios.post(`${process.env.REACT_APP_URL}/api/send-otp`, { phoneNo });
      if (otpResponse.data.success) {
        setOtpSent(true);
        setMessage(otpResponse.data.message);
        setError(false);
      } else {
        handleError(otpResponse.data.message);
      }
    } catch (err) {
      handleError('Failed to send OTP');
      console.error(err);
    }
  };

  const verifyOtp = async (phoneNo, otpCode) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/api/verify-otp`, { phoneNo, otp: otpCode });
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setToken(userData.token);
        setOtpSent(false);
        sessionStorage.setItem('token', userData.token);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        setMessage(response.data.message);
        setError(false);
      } else {
        handleError(response.data.message);
      }
    } catch (err) {
      handleError('Error verifying OTP');
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    setOtpSent(false);
    setOtp('');
    setToken('');
    setError(false);
    setMessage('Logged out successfully');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        otpSent,
        otp,
        message,
        error,
        loginWithPassword,
        verifyOtp,
        setOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
