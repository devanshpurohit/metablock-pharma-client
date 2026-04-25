"use client";

import { useState } from "react";

export default function AccountLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-white px-6 py-10 font-sans">
      {/* Page Title */}
      <h1 className="text-xl text-gray-700 font-normal mb-8">Account Login</h1>

      {/* Two Cards Row */}
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl">

        {/* Returning Customer Card */}
        <div className="flex-1 border border-gray-200 shadow-lg shadow-gray-300 rounded-sm p-8 bg-white">
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
              className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400"
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
              className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400"
            />
          </div>

          {/* Forgotten Password */}
          <a
            href="#"
            className="text-sm text-gray-700 hover:text-primary underline-offset-2 hover:underline ml-0"
          >
            Forgotten Password
          </a>

          {/* Login Button */}
          <div className="flex justify-end mt-8">
            <button className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors duration-150">
              Login
            </button>
          </div>
        </div>

        {/* New Customer Card */}
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
            <a href="/register" className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors duration-150 inline-block text-center">
              Continue
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}