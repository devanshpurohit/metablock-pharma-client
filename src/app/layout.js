import { Dosis } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

const dosis = Dosis({
  variable: "--font-dosis",
  subsets: ["latin"],
});

export const metadata = {
  title: "Roidspharma",
  description: "Official Reliable Steroid Shop! Secure Payment & Fast Shipping",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dosis.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <Navbar/>
          {children}
          <Footer/>
        </CartProvider>
      </body>
    </html>
  );
}
