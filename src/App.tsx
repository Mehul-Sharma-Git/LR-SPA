import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Login } from "./pages/Login";
import { MFA } from "./pages/MFA";
import { OTP } from "./pages/OTP";
import { VerifyOTP } from "./pages/VerifyOTP";
import { Dashboard } from "./pages/Dashboard";
import AddMFA from "./pages/AddMFA";
import MfaSelector from "./pages/MfaSelector";
import { VerifySMSOTP } from "./pages/VerifyPhoneOTP";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/mfa" element={<MFA />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/verify-sms-otp" element={<VerifySMSOTP />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-mfa" element={<AddMFA />} />
          <Route path="/mfa-selector" element={<MfaSelector />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff"
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff"
            }
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff"
            }
          }
        }}
      />
    </>
  );
}
