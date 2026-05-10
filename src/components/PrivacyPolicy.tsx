export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 max-w-3xl mx-auto">
      <h1 className="text-white text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-slate-400 text-sm mb-8">Last updated: May 2026 | BytePlay Technologies</p>

      {[
        {
          title: "1. Information We Collect",
          content: "We collect your phone number or email address solely for authentication. We store your watchlist, portfolio holdings, and usage data to provide our services. We do not collect any sensitive financial credentials."
        },
        {
          title: "2. How We Use Your Information",
          content: "Your data is used exclusively to provide stock market analysis, watchlist tracking, and portfolio P&L features. We do not sell, rent, or share your personal information with any third parties for marketing purposes."
        },
        {
          title: "3. Data Storage & Security",
          content: "All data is securely stored using Supabase (PostgreSQL) with Row Level Security enabled. Data transmission is encrypted via HTTPS/TLS. We follow industry-standard security practices."
        },
        {
          title: "4. Cookies & Analytics",
          content: "We use cookies and local storage to maintain your login session. We use Google Analytics to understand how users interact with our platform. No personally identifiable information is shared with Google Analytics."
        },
        {
          title: "5. Third Party Services",
          content: "We use Groq AI for stock analysis generation, Razorpay for payment processing, and Supabase for authentication and data storage. Each service operates under its own privacy policy."
        },
        {
          title: "6. Data Retention",
          content: "We retain your data as long as your account is active. You may request deletion of your account and all associated data by emailing contact@karmatix.in."
        },
        {
          title: "7. Your Rights",
          content: "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at contact@karmatix.in."
        },
        {
          title: "8. Contact",
          content: "For privacy-related concerns, email us at contact@karmatix.in. We will respond within 48 hours."
        },
      ].map(section => (
        <div key={section.title} className="mb-6">
          <h2 className="text-white font-semibold text-lg mb-2">{section.title}</h2>
          <p className="text-slate-400 leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
  );
}