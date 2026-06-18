"use client";

import { useState } from "react";
import api from "../../utils/api";

export default function RegisterAccount() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    password: "",
    passwordConfirm: "",
    subscribe: "no",
    agreed: false,
    captcha: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First Name and Last Name are required.");
      return;
    }
    if (!form.email.trim()) {
      setError("E-mail address is required.");
      return;
    }
    if (!form.telephone.trim()) {
      setError("Telephone number is required.");
      return;
    }
    if (!form.password || form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.captcha) {
      setError("Please complete the captcha verification.");
      return;
    }
    if (!form.agreed) {
      setError("You must agree to the Privacy Policy.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/register-customer", {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.telephone.trim()
      });

      setSuccess("Account registered successfully! Redirecting...");
      
      // Save details to localStorage
      localStorage.setItem("customerToken", res.data.token);
      localStorage.setItem("customerUser", JSON.stringify(res.data.user));

      // Dispatch event to notify layout
      window.dispatchEvent(new Event("customerAuthChange"));

      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get("redirect") || "/";

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400 bg-white";

  const labelClass = "text-sm text-gray-800 w-full sm:w-48 shrink-0 sm:pt-2";

  return (
    <div className="min-h-screen bg-white px-8 py-8 font-sans max-w-3xl">
      {/* Page Title */}
      <h1 className="text-xl text-gray-800 font-normal mb-1 border-b-2 border-primary pb-1 inline-block">
        Register Account
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-gray-600 mt-3 mb-7">
        If you already have an account with us, please login at the{" "}
        <a href="/login" className="text-primary hover:underline">
          login page
        </a>
        .
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm mb-5">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-sm mb-5">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ── Your Personal Details ── */}
        <h2 className="text-sm font-bold text-gray-900 mb-4">Your Personal Details</h2>

      <div className="flex flex-col gap-3 mb-6">
        {/* First Name */}
        <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-4">
          <label className={labelClass}>
            First Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-4">
          <label className={labelClass}>
            Last Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* E-Mail */}
        <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-4">
          <label className={labelClass}>
            E-Mail <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Telephone */}
        <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-4">
          <label className={labelClass}>
            Telephone <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            name="telephone"
            placeholder="Telephone"
            value={form.telephone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Your Password ── */}
      <h2 className="text-sm font-bold text-gray-900 mb-4">Your Password</h2>

      <div className="flex flex-col gap-3 mb-6">
        {/* Password */}
        <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-4">
          <label className={labelClass}>
            Password <span className="text-primary">*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Password Confirm */}
        <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-4">
          <label className={labelClass}>
            Password Confirm <span className="text-primary">*</span>
          </label>
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Password Confirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* ── Newsletter ── */}
      <h2 className="text-sm font-bold text-gray-900 mb-4">Newsletter</h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mb-6">
        <label className={labelClass}>Subscribe</label>
        <div className="flex items-center gap-5">
          <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="subscribe"
              value="yes"
              checked={form.subscribe === "yes"}
              onChange={handleChange}
              className="accent-primary w-4 h-4"
            />
            Yes
          </label>
          <label className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
            <input
              type="radio"
              name="subscribe"
              value="no"
              checked={form.subscribe === "no"}
              onChange={handleChange}
              className="accent-primary w-4 h-4"
            />
            No
          </label>
        </div>
      </div>

      {/* ── Captcha ── */}
      <h2 className="text-sm font-bold text-gray-900 mb-4">Captcha</h2>

      <div className="flex flex-col sm:flex-row items-start gap-1.5 sm:gap-4 mb-10">
        <label className={`${labelClass} leading-snug`}>
          Please complete the captcha <br /> validation below
        </label>
        <div className="flex items-start gap-1">
          <span className="text-primary text-sm mt-2 mr-1">*</span>
          {/* reCAPTCHA mock box */}
          <div className="border border-gray-300 rounded bg-gray-50 w-[220px] h-[70px] flex items-center justify-between px-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="captcha"
                checked={form.captcha}
                onChange={handleChange}
                className="w-5 h-5 border-2 border-gray-400 rounded-sm accent-primary cursor-pointer"
              />
              <span className="text-sm text-gray-700">I'm not a robot</span>
            </label>
            <div className="flex flex-col items-center ml-2">
              {/* reCAPTCHA logo mock */}
              <svg className="w-8 h-8 text-gray-400" viewBox="0 0 64 64" fill="none">
                <path d="M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4z" fill="#4A90D9" opacity="0.15"/>
                <path d="M32 10C19.85 10 10 19.85 10 32s9.85 22 22 22 22-9.85 22-22S44.15 10 32 10z" stroke="#4A90D9" strokeWidth="2" fill="none"/>
                <path d="M20 32c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#4A90D9" strokeWidth="3" strokeLinecap="round" fill="none"/>
                <path d="M44 32c0 6.627-5.373 12-12 12" stroke="#34A853" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
              <span className="text-[8px] text-gray-400 tracking-tight mt-0.5">reCAPTCHA</span>
              <span className="text-[7px] text-gray-300">Privacy - Terms</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar: Privacy Policy + Continue ── */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 border-t border-gray-200 pt-5">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          I have read and agree to the{" "}
          <a href="#" className="text-gray-800 font-medium hover:underline mx-1">
            Privacy Policy
          </a>
          <input
            type="checkbox"
            name="agreed"
            checked={form.agreed}
            onChange={handleChange}
            className="w-4 h-4 border border-gray-400 rounded-sm accent-primary cursor-pointer"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-primary hover:bg-secondary text-white text-sm font-semibold px-7 py-2.5 rounded-sm transition-colors duration-150 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Continue"}
        </button>
      </div>
      </form>
    </div>
  );
}