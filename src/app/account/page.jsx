"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, MapPin, Check, Edit3 } from "lucide-react";

export default function AccountPage() {
  const [customer, setCustomer] = useState(null);
  const [token, setToken] = useState(null);

  // Address editing states
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    country: "India",
    province: "Rajasthan",
    district: "",
    neighborhood: "",
    postCode: "",
    address: ""
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("customerToken");
    const storedUser = localStorage.getItem("customerUser");

    if (!storedToken || !storedUser) {
      window.location.href = "/login?redirect=/account";
    } else {
      setToken(storedToken);
      try {
        const parsedUser = JSON.parse(storedUser);
        setCustomer(parsedUser);
        
        // Load address from local storage if previously saved during checkout/here
        const savedAddress = localStorage.getItem("customerBillingAddress");
        if (savedAddress) {
          setAddress(JSON.parse(savedAddress));
        } else {
          // Initialize names from profile name
          const nameParts = (parsedUser.name || "").split(" ");
          setAddress(prev => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || ""
          }));
        }
      } catch (e) {
        console.error("Error loading account data", e);
      }
    }
  }, []);

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-semibold text-base">Loading account details...</p>
      </div>
    );
  }

  const handleSaveAddress = (e) => {
    e.preventDefault();
    localStorage.setItem("customerBillingAddress", JSON.stringify(address));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-normal text-gray-800 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User profile card */}
          <div className="md:col-span-1 bg-white border border-gray-200 rounded-sm p-6 shadow-sm flex flex-col items-center text-center h-fit">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-bold mb-4">
              {customer.name ? customer.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
            <p className="text-xs text-gray-400 capitalize mb-6">{customer.role || "Customer"}</p>

            <div className="w-full space-y-4 text-left pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate" title={customer.email}>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Customer since 2026</span>
              </div>
            </div>
          </div>

          {/* Account Details and Address */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Address Management Card */}
            <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-primary" />
                  Saved Billing Address
                </h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-sm transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Address
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">First Name</label>
                      <input 
                        type="text" 
                        value={address.firstName} 
                        onChange={e => setAddress({...address, firstName: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Name</label>
                      <input 
                        type="text" 
                        value={address.lastName} 
                        onChange={e => setAddress({...address, lastName: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Country</label>
                      <input 
                        type="text" 
                        value={address.country} 
                        onChange={e => setAddress({...address, country: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Province / State</label>
                      <input 
                        type="text" 
                        value={address.province} 
                        onChange={e => setAddress({...address, province: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">District</label>
                      <input 
                        type="text" 
                        value={address.district} 
                        onChange={e => setAddress({...address, district: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Neighborhood</label>
                      <input 
                        type="text" 
                        value={address.neighborhood} 
                        onChange={e => setAddress({...address, neighborhood: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Post Code</label>
                      <input 
                        type="text" 
                        value={address.postCode} 
                        onChange={e => setAddress({...address, postCode: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Street Address</label>
                      <input 
                        type="text" 
                        value={address.address} 
                        onChange={e => setAddress({...address, address: e.target.value})}
                        className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="text-gray-600 hover:bg-gray-100 text-sm font-semibold px-6 py-2 rounded-sm transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex items-center gap-1.5 bg-primary hover:bg-secondary text-white text-sm font-semibold px-6 py-2 rounded-sm transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {address.address ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Recipient</p>
                          <p className="font-semibold text-gray-800">{address.firstName} {address.lastName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Country</p>
                          <p className="font-semibold text-gray-800">{address.country}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Province / State</p>
                          <p className="font-semibold text-gray-800">{address.province}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">District</p>
                          <p className="font-semibold text-gray-800">{address.district}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Street Address</p>
                        <p className="font-semibold text-gray-800">
                          {address.address}{address.neighborhood && `, ${address.neighborhood}`}{address.postCode && ` (${address.postCode})`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No default billing address saved yet. You can edit here or add it during checkout.</p>
                  )}
                </div>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
