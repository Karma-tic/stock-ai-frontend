import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Target,
  IndianRupee,
  Smartphone,
  Star,
  Briefcase,
  Mail,
  Coins,
  Newspaper,
  RefreshCcw,
} from "lucide-react";
interface Props {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">

      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0"><TrendingUp className="w-6 h-6 text-blue-400 shrink-0" /></span>
            <span className="font-bold text-xl text-white whitespace-nowrap">
              Stock AI
            </span>
            <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
              LIVE
            </span>
          </div>

          {/* Right Nav (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/about" className="text-slate-400 hover:text-white text-sm transition">
              About
            </Link>
            <Link to="/blog" className="text-slate-400 hover:text-white text-sm transition">
              Blog
            </Link>
            <Link to="/contact" className="text-slate-400 hover:text-white text-sm transition">
              Contact
            </Link>
            <Link to="/track-record" className="text-slate-400 hover:text-white text-sm transition">
              Track Record
            </Link>
            <Link
              to="/learn"
              className="text-slate-300 hover:text-white text-sm transition"
            >
              Learn
            </Link>
            

            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile CTA */}
          <div className="sm:hidden flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              Get Started
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white text-2xl px-2"
            >
              ☰
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {menuOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          )}
          {menuOpen && (
            <div className="absolute top-[100%] left-0 w-full sm:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-4 shadow-xl z-50">
              <Link to="/about" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm transition">
                About
              </Link>
              <Link to="/blog" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm transition">
                Blog
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm transition">
                Contact
              </Link>
              <Link to="/track-record" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm transition">
                Track Record
              </Link>
              <Link to="/learn" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white text-sm transition">
                Learn
              </Link>
            </div>
          )}

        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1 text-blue-400 text-sm mb-6">
          AI-Powered NSE/BSE Stock Analysis
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
          Stop Guessing.<br />
          <span className="text-blue-400">Let AI Analyze</span><br />
          Indian Stocks For You.
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-8">
          Stock AI reads NSE filings, Reuters, Business Standard, Mint and Moneycontrol
          — then gives you a structured BUY/HOLD/SELL signal with exact price targets
          in under 10 seconds. Free to start.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition">
            Start Free Analysis →
          </button>
          <a href="#how-it-works"
            className="border border-slate-600 text-slate-300 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition">
            How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { num: "500+", label: "NSE/BSE Stocks" },
            { num: "8 sec", label: "Analysis Time" },
            { num: "Free", label: "To Start" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-blue-400">{s.num}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Signal — shows real content to Google */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-white text-3xl font-bold text-center mb-4">
            Real AI Analysis — Updated Live
          </h2>
          <p className="text-slate-400 text-center mb-10">
            Here's what our AI said about top NSE stocks today
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { ticker: "RELIANCE", company: "Reliance Industries", signal: "BUY", conf: 78, price: "₹1,360", target: "₹1,520", sector: "Energy" },
              { ticker: "TCS", company: "Tata Consultancy Services", signal: "HOLD", conf: 65, price: "₹2,283", target: "₹2,400", sector: "IT" },
              { ticker: "IRFC", company: "Indian Railway Finance Corp", signal: "BUY", conf: 80, price: "₹98", target: "₹118", sector: "Finance" },
            ].map(s => (
              <div key={s.ticker} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-white font-bold text-lg">{s.ticker}</p>
                    <p className="text-slate-400 text-xs">{s.company}</p>
                    <p className="text-slate-500 text-xs">{s.sector}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    s.signal === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>{s.signal}</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{s.price}</p>
                <p className="text-green-400 text-sm">Target: {s.target}</p>
                <p className="text-slate-400 text-xs mt-2">Confidence: {s.conf}%</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs text-center mt-4">
            ⚠️ AI signals for educational purposes only. Not SEBI-registered advice.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-white text-3xl font-bold text-center mb-4">How Stock AI Works</h2>
        <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
          Our AI reads multiple financial data sources simultaneously and generates
          structured analysis that would take a human analyst 2+ hours — in under 10 seconds.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { step: "1", icon: "📊", title: "Fetch Live Data", desc: "Real-time price, PE ratio, 52-week range, volume and dividend data from NSE/BSE" },
            { step: "2", icon: "📰", title: "Scrape News", desc: "Reads NSE India announcements, Google News, Economic Times and Moneycontrol simultaneously" },
            { step: "3", icon: "🤖", title: "AI Analysis", desc: "Llama 3.3 AI processes all data and generates structured BUY/HOLD/SELL signal" },
            { step: "4", icon: "🎯", title: "Get Signal", desc: "Receive exact entry price, target prices, stop loss and quantity recommendations" },
          ].map(s => (
            <div key={s.step} className="text-center">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-blue-400 text-xs font-bold mb-1">STEP {s.step}</div>
              <p className="text-white font-semibold mb-2">{s.title}</p>
              <p className="text-slate-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
<section className="bg-slate-900 py-16">
  <div className="max-w-5xl mx-auto px-6">
    <h2 className="text-white text-3xl font-bold text-center mb-10">
      Everything You Need to Invest Smarter
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          icon: Target,
          title: "BUY/HOLD/SELL Signals",
          desc: "Clear signals with confidence percentage so you know how strong the recommendation is",
        },
        {
          icon: IndianRupee,
          title: "Price Targets",
          desc: "Exact entry price, two target levels and stop loss for every analysis",
        },
        {
          icon: Smartphone,
          title: "Works on Phone",
          desc: "Fully responsive — check your stocks anywhere from your mobile device",
        },
        {
          icon: Star,
          title: "Watchlist",
          desc: "Save your favourite stocks and monitor them with one tap",
        },
        {
          icon: Briefcase,
          title: "Portfolio Tracker",
          desc: "Track your holdings with live P&L — see your profit or loss in real time",
        },
        {
          icon: Mail,
          title: "Morning Digest",
          desc: "Pro users get daily email at 8:30 AM with top BUY signals before market opens",
        },
        {
          icon: Coins,
          title: "Penny Stocks",
          desc: "Dedicated section for NSE stocks under ₹100 — high risk, high reward opportunities",
        },
        {
          icon: Newspaper,
          title: "Multi-source News",
          desc: "Reads NSE India, Google News, Economic Times and Moneycontrol for every stock",
        },
        {
          icon: RefreshCcw,
          title: "Hourly Refresh",
          desc: "Signals automatically updated every hour during market hours (9 AM - 4 PM IST)",
        },
      ].map((f) => {
        const Icon = f.icon;
        return (
          <div
            key={f.title}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5"
          >
            <Icon className="w-7 h-7 text-blue-400 mb-3" strokeWidth={2.2} />
            <p className="text-white font-semibold mb-2">{f.title}</p>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        );
      })}
    </div>
  </div>
</section>
      {/* Educational Content — critical for AdSense */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-white text-3xl font-bold text-center mb-4">
          Learn Stock Market Investing
        </h2>
        <p className="text-slate-400 text-center mb-10">
          Educational resources for Indian retail investors
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "What is PE Ratio and Why It Matters",
              desc: "Price to Earnings ratio compares a company's stock price to its earnings per share. A lower PE suggests the stock may be undervalued. For Indian markets, average PE is around 20-25 for large caps.",
              link: "/blog/what-is-pe-ratio"
            },
            {
              title: "How to Read NSE Stock Announcements",
              desc: "NSE publishes corporate announcements including quarterly results, board meetings, dividends and major business updates. These directly impact stock prices and are crucial for investors.",
              link: "/blog/how-to-read-nse-announcements"
            },
            {
              title: "Understanding Dividend Yield in Indian Stocks",
              desc: "Dividend yield shows annual dividend as percentage of stock price. ITC, Coal India and PSU stocks typically offer high dividend yields, making them attractive for income investors.",
              link: "/blog/dividend-yield-india"
            },
            {
              title: "What are Penny Stocks in NSE/BSE?",
              desc: "Penny stocks are shares trading below ₹100. While they offer high return potential, they also carry significant risks including low liquidity and high volatility. Always invest cautiously.",
              link: "/blog/penny-stocks-india"
            },
          ].map(a => (
            <div key={a.title} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">{a.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{a.desc}</p>
              <Link to={a.link} className="text-blue-400 hover:text-blue-300 text-sm transition">
                Read more →
              </Link>
            </div>
          ))}
        </div>
      </section>

 {/* Pricing — replace existing section */}
<section className="bg-slate-900 py-16">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <h2 className="text-white text-3xl font-bold mb-2">Simple, Transparent Pricing</h2>
    <p className="text-slate-400 mb-10">No hidden charges. Cancel anytime.</p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
      {/* Free */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-left">
        <p className="text-slate-400 text-xs font-semibold uppercase mb-2">Free</p>
        <p className="text-3xl font-black text-white mb-1">₹0</p>
        <p className="text-slate-500 text-xs mb-4">forever</p>
        <div className="space-y-2">
          {["2 AI analyses/day", "Top 10 stocks", "3 watchlist stocks"].map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <p className="text-slate-400 text-xs">{f}</p>
            </div>
          ))}
        </div>
        <button onClick={onGetStarted}
          className="mt-4 w-full border border-slate-600 text-slate-300 py-2 rounded-lg text-sm font-semibold hover:border-slate-400 transition">
          Get Started
        </button>
      </div>

      {/* 1 Day Trial */}
      <div className="bg-yellow-500/5 border border-yellow-500/40 rounded-xl p-5 text-left relative">
        <span className="absolute -top-3 left-4 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">TRY IT</span>
        <p className="text-yellow-400 text-xs font-semibold uppercase mb-2">Trial</p>
        <p className="text-3xl font-black text-white mb-1">₹1</p>
        <p className="text-slate-500 text-xs mb-4">1 day access</p>
        <div className="space-y-2">
          {["Full Pro access", "All features unlocked", "No commitment"].map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <p className="text-slate-300 text-xs">{f}</p>
            </div>
          ))}
        </div>
        <button onClick={onGetStarted}
          className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-lg text-sm font-bold transition">
          Try for ₹1
        </button>
      </div>

      {/* 1 Month */}
      <div className="bg-blue-600/10 border-2 border-blue-500 rounded-xl p-5 text-left relative">
        <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">POPULAR</span>
        <p className="text-blue-400 text-xs font-semibold uppercase mb-2">1 Month</p>
        <p className="text-3xl font-black text-white mb-1">₹49</p>
        <p className="text-slate-500 text-xs mb-4">no auto-renewal</p>
        <div className="space-y-2">
          {["Unlimited analysis", "500+ stocks", "Portfolio tracker", "Email digest"].map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <p className="text-slate-300 text-xs">{f}</p>
            </div>
          ))}
        </div>
        <button onClick={onGetStarted}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-bold transition">
          Get 30 Days
        </button>
      </div>

      
    </div>
  </div>
</section>

      {/* FAQ — great for SEO and AdSense */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-white text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Is Stock AI free to use?",
              a: "Yes, Stock AI has a free plan that gives you 2 AI analyses per day, 3 watchlist stocks and access to top 10 market stocks. Pro plan at ₹49/month gives unlimited access."
            },
            {
              q: "Is this SEBI registered investment advice?",
              a: "No. Stock AI is an educational platform. All signals are AI-generated for informational purposes only. We are not SEBI-registered investment advisors. Always consult a qualified financial advisor before investing."
            },
            {
              q: "How accurate are the AI signals?",
              a: "Our AI analyses price data, valuation metrics and recent news to generate signals. Like any analysis tool, it is not 100% accurate. Always use it as one input among many before making investment decisions."
            },
            {
              q: "Which stocks are covered?",
              a: "We cover 500+ NSE and BSE listed stocks including all Nifty 50, Nifty Next 50, popular mid-caps, PSU stocks, IT companies, banks, pharma, FMCG and penny stocks."
            },
            {
              q: "How often are signals updated?",
              a: "Signals are updated every hour during market hours (9 AM to 4 PM IST, Monday to Friday). Pro users also receive a morning digest email at 8:30 AM with top BUY signals."
            },
            {
              q: "Can I track my own portfolio?",
              a: "Yes. Enter your stocks, quantity and average buy price in the Portfolio tab. Stock AI will show you live P&L — current value versus your invested amount."
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <p className="text-white font-semibold mb-2">Q: {item.q}</p>
              <p className="text-slate-400 text-sm leading-relaxed">A: {item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <h2 className="text-white text-3xl font-bold mb-4">
          Start Investing Smarter Today
        </h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Join thousands of Indian investors using AI to analyze stocks.
          Free to start — no credit card required.
        </p>
        <button onClick={onGetStarted}
          className="bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-black hover:bg-blue-50 transition">
          Get Free AI Stock Analysis →
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2026 BytePlay Technologies. All rights reserved.</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/about" className="text-slate-500 hover:text-white text-sm">About</Link>
            <Link to="/privacy" className="text-slate-500 hover:text-white text-sm">Privacy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-white text-sm">Terms</Link>
            <Link to="/refund" className="text-slate-500 hover:text-white text-sm">Refund</Link>
            <Link to="/disclaimer" className="text-slate-500 hover:text-white text-sm">Disclaimer</Link>
            <Link to="/contact" className="text-slate-500 hover:text-white text-sm">Contact</Link>
          </div>
          <p className="text-slate-600 text-xs w-full text-center">
            ⚠️ Not SEBI-registered. AI signals for educational purposes only. Invest at your own risk.
          </p>
          {/* Data Sources */}
<div className="border-t border-slate-800 pt-6 mt-6 w-full">
  <p className="text-slate-600 text-xs text-center mb-3">
    Data Sources
  </p>

  <div className="flex flex-wrap justify-center gap-4">
    {[
      { label: "NSE India", url: "https://www.nseindia.com" },
      { label: "BSE India", url: "https://www.bseindia.com" },
      { label: "Economic Times Markets", url: "https://economictimes.indiatimes.com/markets" },
      { label: "SEBI", url: "https://www.sebi.gov.in" },
      { label: "Moneycontrol", url: "https://www.moneycontrol.com" },
    ].map((link) => (
      <a
        key={link.label}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-600 hover:text-slate-400 text-xs transition underline"
      >
        {link.label}
      </a>
    ))}
  </div>
</div>
        </div>
        
      </footer>
    </div>
  );
}