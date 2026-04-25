import CustomerReviews from "@/components/Review";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Breadcrumb */}
      <div className="px-6 py-3 text-sm text-gray-500 flex items-center gap-1.5 border-b border-gray-100">
        <a href="/" className="hover:text-primary">Home</a>
        <span>›</span>
        <span className="text-gray-700">Shipping &amp; Delivery Information</span>
      </div>

      <div className="px-6 py-8 max-w-7xl">
        {/* Page Title */}
        <h1 className="text-2xl font-normal text-gray-800 mb-6">
          Shipping &amp; Delivery Information
        </h1>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 text-sm text-gray-800 leading-relaxed">

            {/* Bold underline notice */}
            <p className="font-bold underline mb-4">
              Zelle and Venmo payments are approved within 4-5 business days after payment is
              made. The delivery times below apply after this 4-5 day approval period.
            </p>

            {/* Red italic notice */}
            <p className="text-primary italic font-semibold mb-6">
              After processing your order payment, the following delivery times apply based on
              the brands.
            </p>

            {/* US Domestic */}
            <p className="font-bold underline mb-3">US Domestic warehouses delivery times:</p>

            <div className="flex flex-col gap-3 mb-6">
              <p><span className="font-semibold">Xeno Labs</span> USA: 4-6 business days</p>

              <p>
                <span className="font-semibold">Xt Labs</span> USA: 6-8 business days{" "}
                <em>
                  (After we provide you with the tracking number, it will take 3-5 business
                  days for it to become trackable. Please do not request status updates about
                  your tracking number before this period.)
                </em>
              </p>

              <p><span className="font-semibold">Peptide Plus</span> 4-5 business days</p>

              <p><span className="font-semibold">Aslan Pharma</span> 5-6 business days</p>

              <p>
                <span className="font-semibold">Omega Labs</span> 6-8 business days{" "}
                <em>
                  (After we provide you with the tracking number, it will take 3-5 business
                  days for it to become trackable. Please do not request status updates about
                  your tracking number before this period.)
                </em>
              </p>

              <p>
                <span className="font-semibold">Bull Pharma</span> 6-8 business days{" "}
                <em>
                  (After we provide you with the tracking number, it will take 3-5 business
                  days for it to become trackable. Please do not request status updates about
                  your tracking number before this period.)
                </em>
              </p>

              <p><span className="font-semibold">Crowx Labs</span> USA: 6-7 business days</p>
              <p><span className="font-semibold">Sixpex</span> USA: 4-6 business days</p>
              <p><span className="font-semibold">Ryzen Pharma</span> USA: 5-7 business days.</p>
              <p><span className="font-semibold">No Label Peptides:</span> 2-5 business days.</p>
              <p><span className="font-semibold">Beligas</span> Pharma USA: 5-7 business days</p>
              <p><span className="font-semibold">Hutech Labs</span> USA: 6-9 business days.</p>
              <p><span className="font-semibold">Nakon Pharma</span> USA: 6-9 business days.</p>
              <p><span className="font-semibold">Ultima Pharma</span> USA: 10-12 business days.</p>
              <p><span className="font-semibold">Hubio Pharm</span> USA: 5-6 business days</p>
              <p><span className="font-semibold">Hygene Pharm:</span> 5-6 business days</p>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex-1 text-sm text-gray-800 leading-relaxed">

            {/* INT delivery times */}
            <div className="flex flex-col gap-3 mb-6">
              <p>
                <span className="font-semibold">Beligas Pharma</span> INT 15-20 business days to US
                &nbsp;--- to EU 10-15 business days
              </p>
              <p>
                <span className="font-semibold">Ultima Pharma</span> INT 15-20 business days to US
                &nbsp;--- to EU 10-15 business days
              </p>
              <p>
                <span className="font-semibold">Nakon Medical</span> INT 15-20 business days to US
                &nbsp;--- to EU 10-15 business days
              </p>
              <p>
                <span className="font-semibold">Deus Medical</span> 7-15 business days to US
                &nbsp;--- to EU 5-10 business days
              </p>
              <p>
                <span className="font-semibold">Human Grade Products</span> 15 business days to US
                &nbsp;--- to EU 5-10 business days
              </p>
            </div>

            {/* UK Domestic */}
            <p className="text-lg font-semibold underline mb-2">
              UK DOMESTIC Warehouses Delivery Times:
            </p>
            <p className="mb-6">All of them 1-3 business days UK to UK</p>

            {/* Shipping section */}
            <p className="text-xl font-bold underline mb-3">Shipping</p>

            <p className="mb-3">You can read the features of our regular shipment:</p>

            <p className="mb-3">
              Each order is shipped and tracking numbers of shipments are emailed in 3-4 business
              days from the day we received the payment.
            </p>

            <p className="mb-3">
              All of orders are packed and shipped by using reliable and discreet methods.
            </p>

            {/* NOTE */}
            <p className="mb-4">
              <span className="font-bold">NOTE:</span>{" "}
              <span className="text-primary">
                Because we handle a large number of orders daily, the item you chose might
                sometimes become unavailable. To prevent any hold-ups, we will automatically send
                you a substitute product with equivalent dosage and quality, without needing to
                check with you first.
              </span>
            </p>

            {/* Warning */}
            <p className="font-bold mb-2">Warning for international shipment orders:</p>

            <p className="font-bold text-primary mb-3">
              FOR INTERNATIONAL ORDERS: (NOT FOR US or UK DOMESTIC)
            </p>

            <p className="underline mb-3">
              Please wait at least 4 weeks before contacting us regarding non-arrival shipments.
              If your order gets seized at custom of your country please contact us immediately
              with a scanned copy of the seizure letter and new shipping address. Your order will
              be re-shipped for free right away.
            </p>

            <p className="mb-3">
              .(We do not have reships to Australia, Canada, New Zealand, Sweden, Finland,
              Denmark, Korea, Philippines, Switzerland.) Please contact us for other countries.
            </p>

            <p className="mb-3">
              All shipments are delivered by first-class, priority regular registered airmail
              service. You can email us to learn tracking number of your shipment if you don't
              get a working tracking number in 3 business days from the day you emailed us the
              payment informations.
            </p>

            <p className="mb-3">Regular shipping cost is $35 for every order.</p>

            <p className="mb-3">
              Estimated time of arrival is 12 to 17 business days except for USA Domestic: 4-5
              business days after shipped.
            </p>
          </div>

        </div>
      </div>
      
      {/* Customer Reviews Section */}
      <CustomerReviews />
    </div>
  );
}