"use client";

import { useState, useEffect } from "react";
import api, { resolveImageUrl } from "@/utils/api";
import { 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Truck, 
  Clock, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  DollarSign
} from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("customerToken");
    if (!storedToken) {
      window.location.href = "/login?redirect=/orders";
      return;
    }

    setToken(storedToken);

    api.get("/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then(res => {
        setOrders(res.data || []);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message || "Failed to load orders. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-semibold text-base">Loading your orders...</p>
      </div>
    );
  }

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200"; // pending
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-normal text-gray-800 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            My Orders
          </h1>
          <span className="text-sm text-gray-500 font-medium">Total: {orders.length} orders</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-sm mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-sm p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No Orders Found</h3>
            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">You haven't placed any orders yet. Visit our shop to browse and find what you need!</p>
            <a 
              href="/all-products" 
              className="bg-primary hover:bg-secondary text-white font-semibold text-sm px-8 py-3 rounded-sm transition-colors duration-150 inline-block"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              });

              return (
                <div key={order._id} className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                  
                  {/* Order Main Header Row */}
                  <div className="p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-950 font-mono">#{order._id}</span>
                        <span className={`text-xs px-2.5 py-0.5 border rounded-full font-semibold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formattedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400 font-semibold mb-0.5">Order Total</p>
                        <p className="text-lg font-black text-primary">${order.total.toFixed(2)}</p>
                      </div>

                      <div className="flex gap-2">
                        {order.status?.toLowerCase() === "pending" && (
                          <a 
                            href={`/submit-payment?orderId=${order._id}`}
                            className="bg-primary hover:bg-secondary text-white text-xs font-semibold px-4 py-2 rounded-sm transition-colors flex items-center gap-1"
                          >
                            Submit Payment
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button 
                          onClick={() => toggleExpandOrder(order._id)}
                          className="border border-gray-300 hover:bg-gray-50 text-gray-600 p-2 rounded-sm transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details Body (Expanded) */}
                  {isExpanded && (
                    <div className="border-t border-gray-150 bg-gray-50/30 p-6 space-y-6">
                      
                      {/* Products list */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                        <div className="bg-white border border-gray-200 rounded-sm divide-y divide-gray-100">
                          {order.items.map((item, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 text-sm">
                              {item.image && (
                                <img 
                                  src={resolveImageUrl(item.image)} 
                                  alt={item.name} 
                                  className="w-10 h-10 object-contain border border-gray-100 rounded-sm p-0.5"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 leading-tight">{item.name}</h5>
                                <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)} x {item.quantity}</p>
                              </div>
                              <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Addresses and shipping info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="bg-white border border-gray-200 rounded-sm p-4 text-sm">
                          <h5 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary" strokeWidth={2.5} />
                            Billing Address
                          </h5>
                          <p className="text-gray-700 leading-relaxed text-xs">
                            <strong>{order.billingAddress.firstName} {order.billingAddress.lastName}</strong><br/>
                            {order.billingAddress.address}<br/>
                            {order.billingAddress.neighborhood && `${order.billingAddress.neighborhood}, `}{order.billingAddress.district}<br/>
                            {order.billingAddress.province}, {order.billingAddress.postCode}<br/>
                            {order.billingAddress.country}
                          </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-sm p-4 text-sm">
                          <h5 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2 flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-primary" />
                            Delivery Details
                          </h5>
                          <p className="text-gray-700 leading-relaxed text-xs">
                            <strong>Shipping Method:</strong> {order.deliveryMethod.name}<br/>
                            <strong>Shipping Cost:</strong> ${order.deliveryMethod.cost.toFixed(2)}<br/>
                            <strong>Address:</strong> {order.shippingAddressSameAsBilling ? "Same as billing address" : (
                              <span>
                                {order.shippingAddress.address}, {order.shippingAddress.neighborhood && `${order.shippingAddress.neighborhood}, `}{order.shippingAddress.district}, {order.shippingAddress.province}, {order.shippingAddress.postCode}, {order.shippingAddress.country}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Payment Instructions helper if pending */}
                      {order.status?.toLowerCase() === "pending" && (
                        <div className="bg-[#fffdf7] border border-amber-200 p-4 rounded-sm">
                          <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2">Payment Required</h5>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            This order is pending verification. Send the total amount of <strong>${order.total.toFixed(2)}</strong> using your selected payment method (<strong>{order.paymentMethod}</strong>). Once paid, submit the payment transaction details using the button at the top to complete your order.
                          </p>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
