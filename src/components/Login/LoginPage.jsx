import React, { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { useAuth } from "../../context/AuthContext"; // Import useAuth from AuthProvider
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Avatar, CircularProgress, Snackbar, Alert as MuiAlert, Slide } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailLockIcon from "@mui/icons-material/MailLock";
import "./LoginPage.css";
import { Colors } from "../../utils/Theme/Colors";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const boxstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "5px",
};

export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enterOtp, setEnterOtp] = useState(["", "", "", ""]);
  const [isLoader, setIsLoader] = useState(false);
  const [showUncheckMessage, setShowUncheckMessage] = useState(false);

  const { loginWithPassword, verifyOtp, otpSent, message, error, user } = useAuth(); // Use AuthProvider methods
  const navigate = useNavigate();
  const vertical = "top";
  const horizontal = "right";

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Redirect if authenticated
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoader(true);
    await loginWithPassword(email, password);
    setIsLoader(false);
  };

  const handleChange = (index, event) => {
    const newOTP = [...enterOtp];
    newOTP[index] = event.target.value;
    setEnterOtp(newOTP);
  };

  const submitOtp = async () => {
    setIsLoader(true);
    const otpCode = enterOtp.join("");
    await verifyOtp(email, otpCode);
    setIsLoader(false);
  };

  const handleClose = () => {
    setShowUncheckMessage(false);
  };

  return (
    <div className="login-app">
      <Snackbar
        open={error}
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert severity="error">{message}</Alert>
      </Snackbar>
      <Snackbar
        open={showUncheckMessage}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="warning">
          Uncheck "Remember me" will clear your saved credentials.
        </Alert>
      </Snackbar>
      <div className="log_container">
        <div className="log_left">
          <div  className="left-head"><span>Welcome To FLN</span></div>
          <div className="left-sub-head"> Login To Access Dashboard</div>
          <div className="log-img">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/login-illustration-download-in-svg-png-gif-file-formats--select-an-account-join-the-forum-password-digital-marketing-pack-business-illustrations-8333958.png"/>
          </div>
        </div>
        <div className="log_right">
          {otpSent ? (
            <div className="log_login-box">
              <Avatar sx={{ bgcolor: "#ffffff", width: 60, height: 60, color: "#003073" }}>
                <MailLockIcon />
              </Avatar>
              <h1>Enter OTP</h1>
              <div className="otp-input" style={{ display: "flex", gap: 10 }}>
                {enterOtp.map((digit, index) => (
                  <input
                    key={index}
                    value={digit}
                    onChange={(event) => handleChange(index, event)}
                    type="number"
                    required
                  />
                ))}
              </div>
              <button onClick={submitOtp}>Submit OTP</button>
            </div>
          ) : (
            <div className="log_login-box">
              <Avatar sx={{ bgcolor: "#a1c4fd", width: 60, height: 60, color: Colors.grey.g300 }}>
                <LockOutlinedIcon />
              </Avatar>
              <div className="log_login-title">
                
                  <h1 style={{color:"#ffffff"}}>Admin Login</h1>
                  {/* <p>Login to Explore</p> */}
                </div>
                
                <div className="log_form"  >
                  <div className="form__input-group">
                    <label className="" for="username">Username</label>
                    <input type="text" id="username" name="username" onChange={e => { setEmail(e.target.value) }} className="form__input"  value={email ? email : ""} required />
                  </div>
                  <div className="form__input-group">
                    <label className="" for="password">Password</label>
                    <input type="password" id="password" name="password" onChange={e => { setPassword(e.target.value) }} className="form__input" value={password ? password : ""} required />
                  </div>
                  {isLoader && <CircularProgress sx={{ ml: "1em",mt:'5px',color:Colors.primary.light }} variant="indeterminate" size={25} thickness={5} />}
                  {!isLoader && <button type="submit" style={{marginTop:'15px',padding:"15px 0",fontSize:"18px"}} onClick={handleSubmit}>Login</button>}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
