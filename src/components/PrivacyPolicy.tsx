export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 max-w-3xl mx-auto">
      <h1 className="text-white text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-slate-400 text-sm mb-4">Last updated: May 2026</p>

      {[
        { title: "Information We Collect", content: "We collect your phone number or email address for authentication purposes. We also collect your watchlist and portfolio data to provide our services." },
        { title: "How We Use Your Information", content: "Your data is used solely to provide stock analysis and portfolio tracking features. We do not sell your personal information to third parties." },
        { title: "Data Storage", content: "Your data is securely stored using Supabase (PostgreSQL). We use industry-standard encryption for all data transmission." },
        { title: "Cookies", content: "We use cookies and local storage to maintain your login session. We also use Google Analytics cookies to understand how users interact with our platform." },
        { title: "Third Party Services", content: "We use Google Analytics for usage tracking, Groq AI for stock analysis, and Razorpay for payment processing. Each service has its own privacy policy." },
        { title: "Investment Disclaimer", content: "Stock AI provides AI-generated insights for educational purposes only. We are not SEBI-registered investment advisors. Always consult a qualified financial advisor before making investment decisions." },
        { title: "Contact Us", content: "For privacy concerns, email us at privacy@byteplay.org" },
      ].map(section => (
        <div key={section.title} className="mb-6">
          <h2 className="text-white font-semibold text-lg mb-2">{section.title}</h2>
          <p className="text-slate-400">{section.content}</p>
        </div>
      ))}
    </div>
  );
}