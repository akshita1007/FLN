import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Avatar,
  CircularProgress,
  Snackbar,
  Alert as MuiAlert,
  IconButton,
} from "@mui/material";

import {
  InputLabel,
  OutlinedInput,

  InputAdornment,
  FormControl,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailLockIcon from "@mui/icons-material/MailLock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./LoginPage.css";
import { Colors } from "../../utils/Theme/Colors";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enterOtp, setEnterOtp] = useState(["", "", "", ""]);
  const [isLoader, setIsLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginWithPassword, verifyOtp, otpSent, message, error, user } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoader(true);
    await loginWithPassword(email, password);
    setIsLoader(false);
  };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOTP = [...enterOtp];
      newOTP[index] = value;
      setEnterOtp(newOTP);

      // move to next box automatically
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !enterOtp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const submitOtp = async () => {
    setIsLoader(true);
    const otpCode = enterOtp.join("");
    await verifyOtp(email, otpCode);
    setIsLoader(false);
  };

  return (
    <div className="login-app">
      {/* Snackbar Alerts */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="error">{message}</Alert>
      </Snackbar>

      <div className={`log_container ${otpSent ? "flip" : ""}`}>
        {/* Left Panel */}
        <div className="log_left">
          <div className="left-head">
            <span>Welcome To FLN</span>
          </div>
          <div className="left-sub-head">Login To Access Dashboard</div>
          <div className="log-img">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/login-illustration-download-in-svg-png-gif-file-formats--select-an-account-join-the-forum-password-digital-marketing-pack-business-illustrations-8333958.png"
              alt="login"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="log_right">
          {!otpSent ? (
            <div className="log_login-box">
              <Avatar
                sx={{
                  bgcolor: "#a1c4fd",
                  width: 60,
                  height: 60,
                  color: Colors.grey.g300,
                }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <h1 className="log_login-title">Admin Login</h1>

              <div className="log_form">
                {/* Username */}
                <div className="form__input-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className="form__input"
                    required
                  />
                </div>

                {/* Password with toggle */}
                <div className="form__input-group password-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      className="form__input"
                      required
                    />
                    <IconButton
                      className="eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                     
                    </IconButton>
                  </div>
                </div>

                {/* Loader & Button */}
                {isLoader ? (
                  <CircularProgress
                    sx={{
                      mt: "15px",
                      color: Colors.primary.light,
                    }}
                    size={25}
                  />
                ) : (
                  <button
                    type="submit"
                    className="login-btn"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="log_login-box">
              <Avatar
                sx={{
                  bgcolor: "#ffffff",
                  width: 60,
                  height: 60,
                  color: "#003073",
                }}
              >
                <MailLockIcon />
              </Avatar>
              <h1>Enter OTP</h1>

              <div className="otp-input">
                {enterOtp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    type="text"
                    maxLength="1"
                  />
                ))}
              </div>

              {isLoader ? (
                <CircularProgress
                  sx={{ mt: "15px", color: Colors.primary.light }}
                  size={25}
                />
              ) : (
                <button className="login-btn" onClick={submitOtp}>
                  Submit OTP
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
