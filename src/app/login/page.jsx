"use client";

import { useState } from "react";
import api from "../../utils/api";

export default function AccountLogin() {
  const [viewMode, setViewMode] = useState("login"); // 'login' | 'forgot_request' | 'forgot_otp' | 'forgot_reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password specific states
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [devOtpInfo, setDevOtpInfo] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login-customer", {
        email: email.trim().toLowerCase(),
        password
      });

      setSuccess("Login successful! Redirecting...");
      
      localStorage.setItem("customerToken", res.data.token);
      localStorage.setItem("customerUser", JSON.stringify(res.data.user));

      // Notify other components of authentication state change
      window.dispatchEvent(new Event("customerAuthChange"));

      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get("redirect") || "/";

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDevOtpInfo("");

    if (!resetEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", {
        email: resetEmail.trim().toLowerCase()
      });

      if (res.data.devOtp) {
        setDevOtpInfo(res.data.devOtp);
        setSuccess(`OTP generated for testing: ${res.data.devOtp}`);
      } else {
        setSuccess("A verification OTP code has been sent to your email!");
      }
      
      setTimeout(() => {
        setSuccess("");
        setViewMode("forgot_otp");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP. Please check the email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the 6-digit verification OTP code.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/verify-otp", {
        email: resetEmail.trim().toLowerCase(),
        otp: otp.trim()
      });

      setSuccess("OTP verified successfully! Please choose a new password.");
      
      setTimeout(() => {
        setSuccess("");
        setViewMode("forgot_reset");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP code or it has expired.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email: resetEmail.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword
      });

      setSuccess("Password reset successfully! You can now log in.");
      
      setTimeout(() => {
        setSuccess("");
        setError("");
        setViewMode("login");
        setEmail(resetEmail);
        setPassword("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setDevOtpInfo("");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Password reset failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-sans">
      {/* Page Title */}
      <h1 className="text-xl text-gray-700 font-normal mb-8">
        {viewMode === "login" && "Account Login"}
        {viewMode === "forgot_request" && "Forgot Password Request"}
        {viewMode === "forgot_otp" && "Verify OTP Code"}
        {viewMode === "forgot_reset" && "Set New Password"}
      </h1>

      {/* Feedback Alert Banners */}
      <div className="max-w-5xl mb-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-sm">
            {success}
          </div>
        )}
        {devOtpInfo && (
          <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-sm font-semibold">
            [Dev Sandbox Tool] SMTP is not set. Use code: <span className="underline decoration-2 text-base font-bold text-amber-900 select-all tracking-wider">{devOtpInfo}</span> to proceed.
          </div>
        )}
      </div>

      {/* Two Cards Row */}
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl">

        {/* Dynamic Auth Card Left */}
        <div className="flex-1 border border-gray-200 shadow-lg shadow-gray-300 rounded-sm p-8 bg-white">
          
          {viewMode === "login" && (
            <form onSubmit={handleLoginSubmit}>
              <h2 className="text-base font-bold text-gray-900 mb-6">
                Returning Customer
              </h2>

              {/* Email Field */}
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-gray-700 w-32 shrink-0">
                  E-Mail Address
                </label>
                <input
                  type="email"
                  placeholder="E-Mail Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex items-center gap-4 mb-5">
                <label className="text-sm text-gray-700 w-32 shrink-0">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

              {/* Forgotten Password Link */}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setDevOtpInfo("");
                  setViewMode("forgot_request");
                }}
                className="text-sm text-gray-700 hover:text-primary underline-offset-2 hover:underline ml-0 bg-transparent border-0 p-0 cursor-pointer"
              >
                Forgotten Password
              </button>

              {/* Login Button */}
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors duration-150 disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          )}

          {viewMode === "forgot_request" && (
            <form onSubmit={handleForgotRequest}>
              <h2 className="text-base font-bold text-gray-900 mb-2">
                Forgotten Password Request
              </h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Enter the e-mail address associated with your account. We will send you an OTP verification code.
              </p>

              {/* Email Input */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm text-gray-700 w-32 shrink-0">
                  E-Mail Address
                </label>
                <input
                  type="email"
                  placeholder="E-Mail Address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

              {/* Actions Row */}
              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setDevOtpInfo("");
                    setViewMode("login");
                  }}
                  className="text-sm text-gray-700 hover:text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors duration-150 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          {viewMode === "forgot_otp" && (
            <form onSubmit={handleVerifyOTP}>
              <h2 className="text-base font-bold text-gray-900 mb-2">
                Verify OTP Code
              </h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Please enter the 6-digit OTP verification code sent to your email.
              </p>

              {/* Read-only Email Field */}
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-gray-500 w-32 shrink-0">
                  E-Mail Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  disabled
                  className="flex-1 border border-gray-200 rounded-sm px-3 py-2 text-sm text-gray-400 bg-gray-50 outline-none cursor-not-allowed"
                />
              </div>

              {/* OTP Field */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm text-gray-700 w-32 shrink-0 font-semibold">
                  OTP Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 bg-white"
                  maxLength={6}
                  required
                />
              </div>

              {/* Actions Row */}
              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setViewMode("forgot_request");
                  }}
                  className="text-sm text-gray-700 hover:text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Back to Email
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors duration-150 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          )}

          {viewMode === "forgot_reset" && (
            <form onSubmit={handleResetPassword}>
              <h2 className="text-base font-bold text-gray-900 mb-2">
                Set New Password
              </h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Enter your new password to secure your account.
              </p>

              {/* Read-only Email Field */}
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-gray-500 w-32 shrink-0">
                  E-Mail Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  disabled
                  className="flex-1 border border-gray-200 rounded-sm px-3 py-2 text-sm text-gray-400 bg-gray-50 outline-none cursor-not-allowed"
                />
              </div>

              {/* New Password Field */}
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-gray-700 w-32 shrink-0">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New Password (min 8 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm text-gray-700 w-32 shrink-0">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 bg-white"
                  required
                />
              </div>

              {/* Actions Row */}
              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccess("");
                    setViewMode("login");
                  }}
                  className="text-sm text-gray-700 hover:text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors duration-150 disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* New Customer Card Right */}
        <div className="flex-1 border border-gray-200 shadow-lg shadow-gray-300 rounded-sm p-8 bg-white flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-5">
              New Customer
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              By creating an account you will be able to shop faster, be up to
              date on an order's status, and keep track of the orders you have
              previously made.
            </p>
          </div>

          {/* Continue Button */}
          <div className="flex justify-end mt-10">
            <a href="/register" className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors duration-150 inline-block text-center cursor-pointer">
              Continue
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}