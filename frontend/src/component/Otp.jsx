import React, { useState } from "react";
import axios from "axios";

const OTPForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post("/api/send-otp", { email });
      setMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("/api/verify-otp", { email, otp });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Invalid or expired OTP.");
    }
  };

  return (
    <div>
      <h2>OTP Verification</h2>

      {/* Email input */}
      <div>
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Send OTP button */}
      {!isOtpSent ? (
        <button onClick={handleSendOtp}>Send OTP</button>
      ) : (
        <div>
          <h3>OTP Sent! Please check your email.</h3>

          {/* OTP input */}
          <div>
            <label htmlFor="otp">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {/* Verify OTP button */}
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}

      {/* Message display */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default OTPForm;
