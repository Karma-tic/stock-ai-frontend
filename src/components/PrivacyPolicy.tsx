import PageLayout from './PageLayout';

export default function PrivacyPolicy() {
  return (
    <PageLayout>
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl mb-2">Privacy Policy</h1>
      <p className="text-muted text-sm mb-8">Last updated: August 2026 | BytePlay Technologies</p>

      {[
        {
          title: "1. Information We Collect",
          content: "We collect your phone number or email address for authentication. If you voluntarily apply to our product-research beta, we also collect the name or alias, investor type, watchlist size, research problem, and consent record that you submit. We store your watchlist, portfolio holdings, and usage data to provide our services. We do not collect brokerage passwords or other sensitive financial credentials."
        },
        {
          title: "2. How We Use Your Information",
          content: "Your data is used to provide stock research, watchlist tracking, portfolio features, support, and—when you explicitly opt in—to contact you about the BytePlay beta and request product feedback. We do not sell or rent beta-applicant contact information. You may withdraw beta contact consent at any time by using the unsubscribe option in an email or contacting us. Advertising services are described in section 4."
        },
        {
          title: "3. Data Storage & Security",
          content: "All data is securely stored using Supabase (PostgreSQL) with Row Level Security enabled. Data transmission is encrypted via HTTPS/TLS. We follow industry-standard security practices."
        },
        {
          title: "4. Cookies, Google AdSense & Analytics",
          content: "We use cookies and local storage to maintain your login session. We also use third-party vendors, including Google, which use cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads). We also use Google Analytics to understand how users interact with our platform."
        },
        {
          title: "5. Third Party Services",
          content: "We use Groq AI for stock analysis generation, Razorpay for payment processing, Supabase for authentication and data storage, and Google AdSense for monetization. Each service operates under its own privacy policy."
        },
        {
          title: "6. Data Retention",
          content: "We retain account data while your account is active. Beta application records are retained only while needed for the research programme, consent evidence, and legal compliance. You may opt out or request deletion of your application, account, and associated data by emailing contact@karmatix.in."
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
          <h2 className="text-ink font-semibold text-lg mb-2">{section.title}</h2>
          <p className="text-muted leading-relaxed">{section.content}</p>
        </div>
      ))}
    </div>
    </PageLayout>
  );
}
