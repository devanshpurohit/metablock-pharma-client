"use client";

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { Send, CreditCard, ShieldCheck, Check, ArrowLeft, ArrowRight } from "lucide-react";

export default function SubmitPaymentPage() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Form states
  const [orderId, setOrderId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bitcoin");
  const [transactionId, setTransactionId] = useState("");

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("customerToken");
    const storedUser = localStorage.getItem("customerUser");

    if (!storedToken || !storedUser) {
      window.location.href = `/login?redirect=/submit-payment`;
      return;
    }

    setToken(storedToken);
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserName(parsedUser.name || "");
      setUserEmail(parsedUser.email || "");
    } catch (e) {
      console.error("Failed to parse user state", e);
    }

    // Prefill Order ID if passed in the query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const qOrderId = searchParams.get("orderId");
    if (qOrderId) {
      setOrderId(qOrderId);
      
      // Optionally fetch order details to prefill amount/method if needed
      api.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
        .then(res => {
          const matchedOrder = (res.data || []).find(o => o._id === qOrderId);
          if (matchedOrder) {
            setAmount(matchedOrder.total.toString());
            // Map payment methods cleanly
            const method = matchedOrder.paymentMethod.toLowerCase();
            if (method.includes("zelle")) {
              setPaymentMethod("Zelle");
            } else if (method.includes("bitcoin") || method.includes("btc")) {
              setPaymentMethod("Bitcoin");
            } else if (method.includes("western")) {
              setPaymentMethod("Western Union");
            } else if (method.includes("ria")) {
              setPaymentMethod("RIA");
            }
          }
        })
        .catch(err => console.error("Error loading order for payment details:", err));
    }
  }, []);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!userName.trim() || !userEmail.trim() || !amount || !transactionId.trim()) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/payments", {
        userName: userName.trim(),
        userEmail: userEmail.trim().toLowerCase(),
        amount: Number(amount),
        currency: "USD",
        paymentMethod,
        transactionId: transactionId.trim().toUpperCase(),
        orderId: orderId.trim() || undefined
      });

      setSuccess(true);
      window.scrollTo(0, 0);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit payment details. Please check transaction ID.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 px-6 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-sm p-8 shadow-md text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-3">Payment Submitted!</h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Your transaction report has been submitted successfully. The administration will verify details of transaction <span className="font-mono font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded-sm">{transactionId.toUpperCase()}</span> and update your order shortly.
          </p>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.location.href = "/orders"}
              className="bg-primary hover:bg-secondary text-white font-semibold text-sm py-3 px-6 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              Go to My Orders
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => window.location.href = "/"}
              className="text-sm text-gray-500 hover:text-primary transition-colors hover:underline"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6 font-sans">
      <div className="max-w-2xl mx-auto">
        
        <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h1 className="text-xl font-normal text-gray-800 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Submit Payment Details
            </h1>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitPayment} className="space-y-4">
            
            {/* Order ID */}
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Order ID <span className="text-gray-400 font-normal text-xs">(optional, links to order)</span></label>
              <input 
                type="text" 
                placeholder="e.g. 6649fc..."
                value={orderId} 
                onChange={e => setOrderId(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white font-mono" 
              />
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-medium">Your Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={e => setUserName(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-medium">Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                  required 
                />
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-medium">Payment Method <span className="text-red-500">*</span></label>
                <select 
                  value={paymentMethod} 
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                  required
                >
                  <option value="Zelle">Zelle</option>
                  <option value="Western Union">Western Union</option>
                  <option value="RIA">RIA</option>
                  <option value="Bitcoin">Bitcoin (BTC)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1 font-medium">Amount Paid (USD) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="e.g. 154.00"
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white" 
                  required 
                />
              </div>
            </div>

            {/* Transaction ID / Reference */}
            <div>
              <label className="block text-sm text-gray-700 mb-1 font-medium">Transaction ID / Reference ID / BTC Hash <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter Zelle Confirmation #, WU MTCN, or Bitcoin Tx Hash"
                value={transactionId} 
                onChange={e => setTransactionId(e.target.value)}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-gray-400 bg-white font-mono uppercase" 
                required 
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Specify the unique payment confirmation key so we can identify your transaction.</span>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-secondary text-white text-sm font-semibold px-8 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {loading ? "Submitting..." : "Submit Transaction"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-400 text-[10px] tracking-wider uppercase font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Secure SSL Payment Verification
        </div>

      </div>
    </div>
  );
}
