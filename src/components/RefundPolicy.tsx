import PageLayout from './PageLayout';

export default function RefundPolicy() {
  return (
    <PageLayout>
    <div className="min-h-screen bg-white p-8 max-w-3xl mx-auto">
      <h1 className="text-gray-900 text-3xl font-bold mb-2">Refund Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: May 2026 | BytePlay Technologies</p>

      {[
        {
          title: "1. Subscription Refunds",
          content: "We offer a 7-day refund policy for new Pro subscribers. If you are not satisfied with your subscription within the first 7 days of purchase, contact us at contact@karmatix.in for a full refund."
        },
        {
          title: "2. No Refund After 7 Days",
          content: "After the 7-day window, no refunds will be issued for the current billing cycle. You may cancel your subscription at any time to prevent future charges."
        },
        {
          title: "3. How to Request a Refund",
          content: "Email contact@karmatix.in with your registered phone number or email, your Razorpay payment ID, and the reason for your refund request. We will process eligible refunds within 5-7 business days."
        },
        {
          title: "4. Cancellation",
          content: "You may cancel your Pro subscription at any time. Upon cancellation, your Pro access will continue until the end of the current billing period. No partial refunds are provided for unused days after the 7-day window."
        },
        {
          title: "5. Payment Disputes",
          content: "If you believe you have been incorrectly charged, contact us immediately at contact@karmatix.in. We will investigate and resolve genuine disputes within 7 business days."
        },
        {
          title: "6. Contact",
          content: "Refund requests and payment queries: contact@karmatix.in"
        },
      ].map(section => (
        <div key={section.title} className="mb-6">
          <h2 className="text-gray-900 font-semibold text-lg mb-2">{section.title}</h2>
          <p className="text-gray-500 leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
    </PageLayout>
  );
}