"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Volume2, VolumeX } from "lucide-react";
import api from "@/utils/api";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);
  const prevMessagesLength = useRef(0);

  // Synthesize soft double-beep chime for notification
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Tone 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0, audioCtx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.2);

      // Tone 2
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain2.gain.setValueAtTime(0, audioCtx.currentTime + 0.12);
      gain2.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.17);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc2.start(audioCtx.currentTime + 0.12);
      osc2.stop(audioCtx.currentTime + 0.35);

    } catch (err) {
      console.warn("Failed to play notification audio chime:", err);
    }
  };

  // Identify / Initialize Chat Identity
  useEffect(() => {
    const checkUserIdentity = () => {
      // 1. Check if logged in customer
      const storedUser = localStorage.getItem("customerUser");
      const storedToken = localStorage.getItem("customerToken");

      if (storedUser && storedToken) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed._id) {
            setUserId(parsed._id);
            setUserName(parsed.name || "Customer");
            setUserEmail(parsed.email || "");
            setIsRegistered(true);
            return;
          }
        } catch (e) {
          console.error("Failed to parse customer auth metadata:", e);
        }
      }

      // 2. Check if existing guest session
      const guestId = localStorage.getItem("support_chat_guest_id");
      const guestName = localStorage.getItem("support_chat_guest_name");
      const guestEmail = localStorage.getItem("support_chat_guest_email");

      if (guestId && guestName && guestEmail) {
        setUserId(guestId);
        setUserName(guestName);
        setUserEmail(guestEmail);
        setIsRegistered(true);
      } else {
        // Not registered / not logged in
        setIsRegistered(false);
      }
    };

    checkUserIdentity();

    // Listen for custom authentication changes (e.g. login/register/logout)
    window.addEventListener("customerAuthChange", checkUserIdentity);
    return () => {
      window.removeEventListener("customerAuthChange", checkUserIdentity);
    };
  }, []);

  // Fetch Chat History
  const fetchChatHistory = async () => {
    if (!userId) return;
    try {
      const endpoint = isOpen 
        ? `/chat/session/${userId}` 
        : `/chat/session/${userId}?silent=true`; // wait, our route is GET /api/chat/session/:userId, which resets user unread
      // But if closed, we can just hit the same route, though we want to know if there is unread.
      // Wait, we designed getUserChatHistory to reset user unread when they fetch.
      // So if the chat window is closed, we don't want to reset it, or we do?
      // Actually, if we hit the route when chat window is OPEN, it resets unread.
      // If we are just polling while closed, we can fetch, but wait, the unreadByUser property in backend tells us how many admin messages the user hasn't seen.
      // Let's check how many messages are in the history!
      const res = await api.get(`/chat/session/${userId}`);
      if (res.data) {
        const session = res.data;
        const newMsgs = session.messages || [];
        
        // Notification sound check:
        // Play only if count of messages increased, the last message is from admin/ai, and chat widget is closed
        if (newMsgs.length > prevMessagesLength.current && prevMessagesLength.current > 0) {
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg.sender === "admin" || lastMsg.sender === "ai") {
            if (!isOpen) {
              playNotificationSound();
            }
          }
        }

        setMessages(newMsgs);
        setUnreadCount(session.unreadByUser || 0);
        prevMessagesLength.current = newMsgs.length;
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
    }
  };

  // Start polling when userId changes
  useEffect(() => {
    if (!userId) return;

    fetchChatHistory();

    // Set polling every 3 seconds
    pollingRef.current = setInterval(fetchChatHistory, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [userId, isOpen]);

  // Scroll to bottom of message panel
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // When chat window is opened, reset user unread count
  useEffect(() => {
    if (isOpen && userId) {
      fetchChatHistory(); // Triggers backend reset since endpoint clears unreadByUser
    }
  }, [isOpen]);

  // Handle guest onboarding form
  const handleRegister = (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    const newGuestId = "guest_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("support_chat_guest_id", newGuestId);
    localStorage.setItem("support_chat_guest_name", userName);
    localStorage.setItem("support_chat_guest_email", userEmail);

    setUserId(newGuestId);
    setIsRegistered(true);
  };

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || loading || !userId) return;

    const msgText = inputValue.trim();
    setInputValue("");
    setLoading(true);

    try {
      const res = await api.post("/chat/message", {
        userId,
        userName,
        userEmail,
        message: msgText
      });

      if (res.data) {
        setMessages(res.data.messages || []);
        prevMessagesLength.current = (res.data.messages || []).length;
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end">
      
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <div className="relative flex flex-col items-center">
          
          {/* "We Are Here!" floating indicator label */}
          <div className="absolute bottom-16 right-0 bg-emerald-600 border border-emerald-500 text-white text-xs py-1.5 px-3.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1 font-semibold border-b-2 animate-bounce">
            <span>👋</span> We Are Here!
          </div>

          <button
            onClick={() => setIsOpen(true)}
            id="storefront-chat-bubble-btn"
            className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 cursor-pointer relative"
          >
            <MessageCircle className="w-7 h-7" />
            
            {/* Red Notification Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[360px] h-[500px] sm:w-[380px] sm:h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-300 animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                RP
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">RoidsPharma Support</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                  <span className="text-[11px] text-emerald-100">AI Active / Online Help</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-emerald-100 hover:text-white transition-colors"
                title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Onboarding / Messages Window */}
          {!isRegistered ? (
            /* Onboarding Form for Guest Users */
            <div className="flex-1 p-6 flex flex-col justify-center bg-gray-50/50">
              <div className="text-center mb-6">
                <span className="text-3xl">💬</span>
                <h5 className="font-bold text-gray-800 text-lg mt-2">Start a Live Chat</h5>
                <p className="text-xs text-gray-500 mt-1">Please enter your details to connect with support.</p>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all text-sm mt-2"
                >
                  Start Live Chat
                </button>
              </form>
            </div>
          ) : (
            /* Active Chat Thread */
            <>
              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50/70 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="my-auto text-center p-4">
                    <span className="text-2xl text-emerald-500 animate-bounce block">👋</span>
                    <h6 className="font-bold text-gray-700 mt-2">Hello, {userName}!</h6>
                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto mt-1">
                      Ask us about orders, shipping options, payment discounts, or steroid guides!
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isUser = msg.sender === "user";
                    const isAI = msg.sender === "ai";
                    
                    return (
                      <div
                        key={idx}
                        className={`flex gap-2 max-w-[85%] ${
                          isUser ? "self-end flex-row-reverse" : "self-start"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                            isUser ? "bg-gray-400" : isAI ? "bg-blue-500" : "bg-emerald-600"
                          }`}
                        >
                          {isUser ? (
                            <User className="w-4 h-4" />
                          ) : isAI ? (
                            <Bot className="w-4 h-4" />
                          ) : (
                            <span className="text-[10px] font-bold">A</span>
                          )}
                        </div>

                        {/* Content & Tag */}
                        <div className="flex flex-col">
                          <span
                            className={`text-[9px] text-gray-400 mb-0.5 ${
                              isUser ? "text-right" : "text-left"
                            }`}
                          >
                            {isUser ? "You" : isAI ? "AI Assistant" : "Support Representative"}
                          </span>
                          
                          <div
                            className={`p-3 rounded-2xl text-sm shadow-sm ${
                              isUser
                                ? "bg-emerald-600 text-white rounded-tr-none"
                                : isAI
                                ? "bg-blue-50 text-gray-800 border border-blue-100 rounded-tl-none"
                                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                            }`}
                          >
                            <p className="whitespace-pre-line break-words leading-relaxed">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-2 px-4 text-sm outline-none focus:bg-white focus:border-emerald-500 text-gray-800 disabled:opacity-60"
                />
                
                <button
                  type="submit"
                  disabled={loading || !inputValue.trim()}
                  className="w-9 h-9 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-150 disabled:text-gray-400 text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </>
          )}

        </div>
      )}

    </div>
  );
}
