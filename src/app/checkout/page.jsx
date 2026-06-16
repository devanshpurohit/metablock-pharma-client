"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import api, { resolveImageUrl } from "@/utils/api";
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  CreditCard, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  ArrowLeft,
  Calendar,
  DollarSign
} from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Flow states: 'billing_form' | 'overview' | 'success'
  const [step, setStep] = useState("billing_form");

  // Address state
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    country: "India",
    province: "Rajasthan",
    district: "",
    neighborhood: "",
    postCode: "",
    address: ""
  });
  const [shippingSame, setShippingSame] = useState(true);

  // Selection states
  const [deliveryOption, setDeliveryOption] = useState(""); // 'regular' or 'insurance'
  const [paymentOption, setPaymentOption] = useState(""); // 'zelle', 'western_union', 'ria', 'bitcoin'
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Collapsible accordion states
  const [cartOpen, setCartOpen] = useState(true);
  const [couponOpen, setCouponOpen] = useState(false);

  // Feedback & result states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successOrderId, setSuccessOrderId] = useState("");

  // Authentication & redirection guard
  useEffect(() => {
    const storedToken = localStorage.getItem("customerToken");
    const storedUser = localStorage.getItem("customerUser");
    if (!storedToken) {
      window.location.href = `/login?redirect=/checkout`;
    } else {
      setToken(storedToken);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          // Prefill name if available
          const nameParts = (parsed.name || "").split(" ");
          setBillingAddress(prev => ({
            ...prev,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || ""
          }));
        } catch (e) {
          console.error("Failed to parse user details from local storage", e);
        }
      }
    }
  }, []);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-base font-semibold">Redirecting to login...</p>
      </div>
    );
  }

  // Calculate pricing values
  const subTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Delivery cost mapping
  let deliveryCost = 0;
  let deliveryName = "";
  if (deliveryOption === "regular") {
    deliveryCost = 35.00;
    deliveryName = "Regular Shipping Cost";
  } else if (deliveryOption === "insurance") {
    deliveryCost = 50.40;
    deliveryName = "Regular Shipping Cost + Insurance";
  }

  // Payment fees/discount calculations
  let paymentFee = 0;
  let paymentDiscount = 0;
  let paymentLabel = "";
  if (paymentOption === "zelle") {
    paymentFee = subTotal * 0.10; // +10%
    paymentLabel = "Zelle (+10% fee)";
  } else if (paymentOption === "bitcoin") {
    paymentDiscount = subTotal * 0.10; // -10%
    paymentLabel = "Bitcoin (discount 10%)";
  } else if (paymentOption === "western_union") {
    paymentLabel = "Western Union";
  } else if (paymentOption === "ria") {
    paymentLabel = "RIA";
  }

  const grandTotal = subTotal + deliveryCost + paymentFee - paymentDiscount;

  // Address handlers
  const handleSaveAddress = (e) => {
    e.preventDefault();
    const { firstName, lastName, country, province, district, neighborhood, postCode, address } = billingAddress;
    if (!firstName.trim() || !lastName.trim() || !country.trim() || !province.trim() || !district.trim() || !postCode.trim() || !address.trim()) {
      setError("Please fill in all required fields marked with *.");
      window.scrollTo(0, 0);
      return;
    }
    setError("");
    setStep("overview");
  };

  // Order confirmation handler
  const handleConfirmOrder = async () => {
    if (!agreeTerms) return;
    if (!deliveryOption) {
      setError("Please select a delivery method.");
      return;
    }
    if (!paymentOption) {
      setError("Please select a payment method.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        billingAddress,
        shippingAddressSameAsBilling: shippingSame,
        deliveryMethod: {
          name: deliveryName,
          cost: deliveryCost
        },
        paymentMethod: paymentLabel,
        paymentFeePercent: paymentOption === "zelle" ? 10 : 0,
        discountPercent: paymentOption === "bitcoin" ? 10 : 0,
        subTotal,
        total: grandTotal
      };

      const res = await api.post("/orders", orderPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessOrderId(res.data.order._id);
      clearCart();
      setStep("success");
      window.scrollTo(0, 0);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to confirm order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Step 1: Billing Address Form */}
        {step === "billing_form" && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  Billing Details
                </div>
                <button 
                  onClick={() => window.location.href = "/cart"} 
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSaveAddress}>
                <h3 className="text-base font-bold text-gray-900 mb-4">New Address</h3>
                <p className="text-xs text-gray-500 mb-6">Complete the form and continue with this address.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">First Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={billingAddress.firstName} 
                      onChange={e => setBillingAddress({...billingAddress, firstName: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Last Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={billingAddress.lastName} 
                      onChange={e => setBillingAddress({...billingAddress, lastName: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Country <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={billingAddress.country} 
                      onChange={e => setBillingAddress({...billingAddress, country: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Province / State <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={billingAddress.province} 
                      onChange={e => setBillingAddress({...billingAddress, province: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">District <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={billingAddress.district} 
                      onChange={e => setBillingAddress({...billingAddress, district: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Neighborhood / City Area</label>
                    <input 
                      type="text" 
                      value={billingAddress.neighborhood} 
                      onChange={e => setBillingAddress({...billingAddress, neighborhood: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Post Code / ZIP <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={billingAddress.postCode} 
                      onChange={e => setBillingAddress({...billingAddress, postCode: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1 font-medium">Street Address <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={billingAddress.address} 
                      onChange={e => setBillingAddress({...billingAddress, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                      required 
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    className="flex items-center gap-1.5 bg-[#2b3947] hover:bg-[#1f2a36] text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Summary (Billing form state) */}
            <div className="w-full md:w-[320px] shrink-0">
              <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Order Summary</h3>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-500">Sub-Total</span>
                  <span className="font-semibold text-gray-900">${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-gray-100">
                  <span className="text-gray-900">Total</span>
                  <span className="text-primary text-base">${subTotal.toFixed(2)}</span>
                </div>

                <button 
                  disabled 
                  className="w-full mt-6 bg-gray-200 text-gray-400 text-sm font-semibold py-3 rounded-sm cursor-not-allowed text-center"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Checkout Details Overview */}
        {step === "overview" && (
          <div>
            {/* GETROIDS Header */}
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-sm px-6 py-4 mb-6 shadow-sm">
              <span className="text-primary font-black text-2xl tracking-wider">GET<span className="bg-primary text-white px-2 py-0.5 rounded-sm ml-0.5">ROIDS</span></span>
              <div className="flex items-center gap-1 text-emerald-600 font-semibold text-xs tracking-wider uppercase">
                <ShieldCheck className="w-4.5 h-4.5" />
                SSL secured SECURE PAYMENT
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Left Main Form options */}
              <div className="flex-1 flex flex-col gap-6">
                
                {/* 1. Items in My Cart (Collapsible) */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setCartOpen(!cartOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 hover:bg-gray-100/60 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Items in My Cart ({cartItems.length})
                    </span>
                    {cartOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {cartOpen && (
                    <div className="p-6 divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                          <img 
                            src={resolveImageUrl(item.image)} 
                            alt={item.name} 
                            className="w-12 h-12 object-contain border border-gray-100 rounded-sm p-1"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 leading-tight">{item.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                          </div>
                          <span className="text-sm font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Discount / Coupon (Collapsible) */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setCouponOpen(!couponOpen)}
                    className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100 hover:bg-gray-100/60 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      Discount / Coupon
                    </span>
                    {couponOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {couponOpen && (
                    <div className="p-6 flex gap-3 max-w-md">
                      <input 
                        type="text" 
                        placeholder="Coupon Code" 
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white"
                      />
                      <button 
                        type="button" 
                        className="bg-primary hover:bg-secondary text-white font-semibold text-sm px-5 py-2 rounded-sm transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Billing Address Details */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Billing Details
                  </h3>
                  
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Billing Address</h4>
                    <div className="flex items-center justify-between border border-gray-200 bg-gray-50/50 rounded-sm p-4 text-sm text-gray-800">
                      <span>
                        <strong>{billingAddress.firstName} {billingAddress.lastName}</strong>, {billingAddress.address}, {billingAddress.neighborhood && `${billingAddress.neighborhood}, `}{billingAddress.district}, {billingAddress.province}, {billingAddress.postCode}, {billingAddress.country}
                      </span>
                      <button 
                        onClick={() => setStep("billing_form")} 
                        className="text-xs font-semibold text-primary border border-primary/20 hover:bg-primary/5 px-3 py-1.5 rounded-sm transition-colors ml-4 shrink-0"
                      >
                        Add / Edit Address
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h4>
                    <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={shippingSame} 
                        onChange={e => setShippingSame(e.target.checked)}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span>Same as billing address</span>
                    </label>
                  </div>
                </div>

                {/* 4. Delivery Method */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    Delivery Method
                  </h3>

                  {!deliveryOption && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-sm mb-4">
                      <strong>Delivery method not selected</strong><br/>
                      Choose a shipping option below to continue.
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <label className={`flex items-center justify-between border rounded-sm p-4 cursor-pointer transition-all ${deliveryOption === "regular" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-3 text-sm text-gray-800">
                        <input 
                          type="radio" 
                          name="delivery" 
                          value="regular"
                          checked={deliveryOption === "regular"}
                          onChange={() => setDeliveryOption("regular")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Regular Shipping Cost</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">$35.00</span>
                    </label>

                    <label className={`flex items-center justify-between border rounded-sm p-4 cursor-pointer transition-all ${deliveryOption === "insurance" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-3 text-sm text-gray-800">
                        <input 
                          type="radio" 
                          name="delivery" 
                          value="insurance"
                          checked={deliveryOption === "insurance"}
                          onChange={() => setDeliveryOption("insurance")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span>Regular Shipping Cost + Insurance</span>
                      </span>
                      <span className="text-sm font-bold text-gray-900">$50.40</span>
                    </label>
                  </div>
                </div>

                {/* 5. Payment Method */}
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Payment Method
                  </h3>

                  {!paymentOption && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm mb-4">
                      <strong>Payment method not selected</strong><br/>
                      Choose a payment method to complete your order.
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <label className={`flex items-center justify-between border rounded-sm p-4 cursor-pointer transition-all ${paymentOption === "zelle" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-3 text-sm text-gray-800">
                        <input 
                          type="radio" 
                          name="payment" 
                          value="zelle"
                          checked={paymentOption === "zelle"}
                          onChange={() => setPaymentOption("zelle")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="font-semibold text-gray-800">Zelle (+10% fee) <span className="font-normal text-xs text-gray-500">— For only US Clients</span></span>
                      </span>
                      {deliveryOption && <span className="text-xs text-gray-500">+${(subTotal * 0.10).toFixed(2)} fee</span>}
                    </label>

                    <label className={`flex items-center justify-between border rounded-sm p-4 cursor-pointer transition-all ${paymentOption === "western_union" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-3 text-sm text-gray-800">
                        <input 
                          type="radio" 
                          name="payment" 
                          value="western_union"
                          checked={paymentOption === "western_union"}
                          onChange={() => setPaymentOption("western_union")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="font-semibold text-gray-800">Western Union</span>
                      </span>
                    </label>

                    <label className={`flex items-center justify-between border rounded-sm p-4 cursor-pointer transition-all ${paymentOption === "ria" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-3 text-sm text-gray-800">
                        <input 
                          type="radio" 
                          name="payment" 
                          value="ria"
                          checked={paymentOption === "ria"}
                          onChange={() => setPaymentOption("ria")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="font-semibold text-gray-800">RIA</span>
                      </span>
                    </label>

                    <label className={`flex items-center justify-between border rounded-sm p-4 cursor-pointer transition-all ${paymentOption === "bitcoin" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                      <span className="flex items-center gap-3 text-sm text-gray-800">
                        <input 
                          type="radio" 
                          name="payment" 
                          value="bitcoin"
                          checked={paymentOption === "bitcoin"}
                          onChange={() => setPaymentOption("bitcoin")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="font-semibold text-gray-800">Bitcoin (discount 10%) <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-sm ml-1.5">— Recommended</span></span>
                      </span>
                      {deliveryOption && <span className="text-xs text-emerald-600">-${(subTotal * 0.10).toFixed(2)} discount</span>}
                    </label>
                  </div>
                </div>

              </div>

              {/* Sidebar Summary (Overview state) */}
              <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-6">
                <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Order Summary</h3>
                  
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-500">Sub-Total</span>
                    <span className="font-semibold text-gray-900">${subTotal.toFixed(2)}</span>
                  </div>

                  {deliveryOption && (
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-gray-500">{deliveryName}</span>
                      <span className="font-semibold text-gray-900">${deliveryCost.toFixed(2)}</span>
                    </div>
                  )}

                  {paymentOption === "zelle" && (
                    <div className="flex justify-between items-center text-sm mb-3 text-amber-700">
                      <span className="text-gray-500">Zelle 10% Fee</span>
                      <span className="font-semibold">+${paymentFee.toFixed(2)}</span>
                    </div>
                  )}

                  {paymentOption === "bitcoin" && (
                    <div className="flex justify-between items-center text-sm mb-3 text-emerald-600">
                      <span className="text-gray-500">BTC 10% Discount</span>
                      <span className="font-semibold">-${paymentDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-gray-100 mb-6">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary text-lg font-black">${grandTotal.toFixed(2)}</span>
                  </div>

                  {/* Conditions of Use Checkbox */}
                  <label className="flex items-start gap-2.5 text-xs text-gray-600 cursor-pointer mb-6 select-none">
                    <input 
                      type="checkbox" 
                      checked={agreeTerms} 
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="w-4.5 h-4.5 accent-primary rounded mt-0.5"
                    />
                    <span className="leading-tight">
                      I have read and agree to the <a href="#" className="text-primary hover:underline font-semibold underline decoration-dotted">Conditions of Use</a>
                    </span>
                  </label>

                  {/* Confirm Order Button */}
                  <button 
                    onClick={handleConfirmOrder}
                    disabled={loading || !agreeTerms || !deliveryOption || !paymentOption}
                    className={`w-full flex items-center justify-center gap-1.5 h-12 text-white font-bold rounded-sm text-sm transition-colors duration-150 disabled:opacity-50 select-none ${agreeTerms && deliveryOption && paymentOption ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer" : "bg-gray-300 text-gray-400 cursor-not-allowed"}`}
                  >
                    <Check className="w-4.5 h-4.5" />
                    {loading ? "Confirming..." : "Confirm Order"}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-400 text-[10px] tracking-wider uppercase font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Protected by 256-bit SSL
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation Screen */}
        {step === "success" && (
          <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-sm p-8 shadow-md text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
            <p className="text-sm text-gray-600 mb-6">
              Thank you for your order! Your Order ID is <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1.5 rounded-sm select-all">#{successOrderId}</span>. We have emailed you the order confirmation.
            </p>

            {/* Payment Method Instructions */}
            <div className="bg-[#fffcf7] border border-amber-200 text-left p-6 rounded-sm mb-8">
              <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4.5 h-4.5 text-amber-700" />
                Payment Action Required ({paymentLabel})
              </h3>
              
              {paymentOption === "zelle" && (
                <div className="text-sm text-amber-800 space-y-2">
                  <p>To process your order, send Zelle payment to: <strong>zelle@roidspharma.com</strong></p>
                  <p><strong>Amount:</strong> ${grandTotal.toFixed(2)}</p>
                  <p className="text-xs text-amber-600">Please mention Order ID <strong>#{successOrderId}</strong> in the memo/notes section.</p>
                </div>
              )}

              {paymentOption === "bitcoin" && (
                <div className="text-sm text-amber-800 space-y-3">
                  <p>To process your order, send Bitcoin payment to our address:</p>
                  <div className="font-mono bg-white border border-amber-200 p-3 rounded-sm select-all text-xs font-bold break-all text-center tracking-wider text-amber-950">
                    bc1qxy2kg3ut5xg4h7625rw0upv6832872895q9e07
                  </div>
                  <p><strong>Amount to send:</strong> Bitcoin equivalent of <strong>${grandTotal.toFixed(2)}</strong></p>
                  <p className="text-xs text-amber-600">Email us the transaction hash or confirmation once sent to expedite approval.</p>
                </div>
              )}

              {paymentOption === "western_union" && (
                <p className="text-sm text-amber-800 leading-relaxed">
                  We will contact you via email at <strong>{user?.email}</strong> with receiver instructions for your Western Union payment.
                </p>
              )}

              {paymentOption === "ria" && (
                <p className="text-sm text-amber-800 leading-relaxed">
                  We will contact you via email at <strong>{user?.email}</strong> with details on how to send the RIA transfer.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.href = "/"}
                className="bg-primary hover:bg-secondary text-white font-semibold text-sm py-3 px-6 rounded-sm transition-colors cursor-pointer"
              >
                Go to Homepage
              </button>
              <button 
                onClick={() => window.location.href = "/all-products"}
                className="text-sm text-gray-500 hover:text-primary transition-colors hover:underline underline-offset-4"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
