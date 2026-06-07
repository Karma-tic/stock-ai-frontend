
import { Link } from 'react-router-dom';
import { TrendingUp } from "lucide-react";
import {
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
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">

      {/* Navigation */}
      <nav className="bg-slate-900 border-b border-slate-800">
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
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile CTA */}
          <button
            onClick={onGetStarted}
            className="sm:hidden bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            Get Started
          </button>

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
          Stock AI reads NSE filings, Google News, Economic Times and Moneycontrol
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
    {/* ── EDUCATION HUB ─────────────────────────────────────── */}
<section className="max-w-5xl mx-auto px-6 py-16">

  {/* Section header */}
  <div className="text-center mb-12">
    <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
      Free Learning Hub
    </p>
    <h2 className="text-white text-3xl font-bold mb-4">
      Complete Guide to Stock Market Investing in India
    </h2>
    <p className="text-slate-400 max-w-2xl mx-auto">
      Everything you need to know about trading on NSE and BSE —
      from basics to AI-powered analysis. Learn at your own pace.
    </p>
  </div>

  {/* ── Chapter 1 — What is Stock Market ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">1</div>
      <h3 className="text-white text-xl font-bold">What is the Stock Market?</h3>
    </div>
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-4">
      <p className="text-slate-300 leading-relaxed mb-4">
        The stock market is a marketplace where buyers and sellers trade shares of publicly listed companies. In India, the two primary stock exchanges are the <strong className="text-white">National Stock Exchange (NSE)</strong> and the <strong className="text-white">Bombay Stock Exchange (BSE)</strong>. When you buy a share, you become a part-owner of that company and participate in its profits and growth.
      </p>
      <p className="text-slate-300 leading-relaxed mb-4">
        The NSE's benchmark index is <strong className="text-white">Nifty 50</strong> — representing the 50 largest companies by market capitalisation. The BSE equivalent is <strong className="text-white">Sensex</strong> — tracking 30 companies. When people say "the market is up today" they typically mean these indices have risen.
      </p>
      <p className="text-slate-300 leading-relaxed">
        India's market capitalisation crossed ₹400 lakh crore in 2024, making it one of the top 5 largest stock markets in the world. Over 9 crore Indians are now registered investors on NSE — a number growing rapidly as digital platforms make investing more accessible.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        { term: "NSE", def: "National Stock Exchange — India's largest exchange by trading volume. Home to Nifty 50 index and over 2,000 listed companies." },
        { term: "BSE", def: "Bombay Stock Exchange — Asia's oldest exchange, established 1875. Home to Sensex index and over 5,000 listed companies." },
        { term: "SEBI", def: "Securities and Exchange Board of India — the regulatory authority that governs all market participants and protects investor interests." },
      ].map(item => (
        <div key={item.term} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-blue-400 font-bold mb-2">{item.term}</p>
          <p className="text-slate-400 text-sm leading-relaxed">{item.def}</p>
        </div>
      ))}
    </div>
  </div>

  {/* ── Chapter 2 — Types of Trading ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">2</div>
      <h3 className="text-white text-xl font-bold">Types of Trading in Indian Stock Market</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {[
        {
          title:  "Intraday Trading",
          color:  "border-red-500/40 bg-red-500/5",
          badge:  "High Risk",
          badgeC: "bg-red-500/20 text-red-400",
          desc:   "Buying and selling stocks within the same trading day. Positions must be closed before 3:30 PM. Requires significant time, discipline and risk management. Not recommended for beginners.",
          pros:   ["No overnight risk", "Can profit in falling markets"],
          cons:   ["Very high risk", "Requires constant monitoring", "Most beginners lose money"],
        },
        {
          title:  "Swing Trading",
          color:  "border-yellow-500/40 bg-yellow-500/5",
          badge:  "Medium Risk",
          badgeC: "bg-yellow-500/20 text-yellow-400",
          desc:   "Holding stocks for 2 days to several weeks to capture short-term price movements. Combines technical analysis with fundamental research. Suitable for part-time traders.",
          pros:   ["Less time intensive than intraday", "Can capture multi-day trends"],
          cons:   ["Overnight gap risk", "Requires technical knowledge"],
        },
        {
          title:  "Positional Trading",
          color:  "border-blue-500/40 bg-blue-500/5",
          badge:  "Medium Risk",
          badgeC: "bg-blue-500/20 text-blue-400",
          desc:   "Holding stocks for weeks to months based on a medium-term view. Focuses on fundamental analysis and sector trends. Good balance between active and passive investing.",
          pros:   ["Less stress than intraday", "Captures large moves"],
          cons:   ["Requires patience", "Capital locked for months"],
        },
        {
          title:  "Long-term Investing",
          color:  "border-green-500/40 bg-green-500/5",
          badge:  "Lower Risk",
          badgeC: "bg-green-500/20 text-green-400",
          desc:   "Buying quality stocks and holding for years or decades. Warren Buffett's preferred approach. Power of compounding works best here. Ideal for wealth building over time.",
          pros:   ["Benefits from compounding", "Lower tax on LTCG", "Less time required"],
          cons:   ["Returns take years", "Patience required"],
        },
      ].map(item => (
        <div key={item.title} className={`border rounded-xl p-5 ${item.color}`}>
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-white font-bold">{item.title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.badgeC}`}>
              {item.badge}
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.desc}</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-green-400 text-xs font-semibold mb-1">Pros</p>
              {item.pros.map(p => <p key={p} className="text-slate-400 text-xs">+ {p}</p>)}
            </div>
            <div>
              <p className="text-red-400 text-xs font-semibold mb-1">Cons</p>
              {item.cons.map(c => <p key={c} className="text-slate-400 text-xs">- {c}</p>)}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
      <p className="text-blue-400 text-sm font-semibold mb-1">Stock AI Recommendation</p>
      <p className="text-slate-300 text-sm">
        For most retail investors, a combination of positional trading and long-term investing works best. Stock AI at <strong>byteplay.org</strong> generates BUY/HOLD/SELL signals with 1-3 month and 6-12 month targets — perfectly suited for both positional and long-term approaches.
      </p>
    </div>
  </div>

  {/* ── Chapter 3 — Key Stock Market Terms ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">3</div>
      <h3 className="text-white text-xl font-bold">Essential Stock Market Terms Every Investor Must Know</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        { term: "Bull Market", def: "A market condition where stock prices are rising or expected to rise. Nifty 50 rising 20% from its recent low signals a bull market." },
        { term: "Bear Market", def: "A market condition where stock prices are falling by 20% or more from recent highs. Associated with economic slowdowns." },
        { term: "Market Cap", def: "Total market value of a company's shares. Calculated as share price × total shares. Used to classify stocks as large-cap (>₹20,000 Cr), mid-cap, or small-cap." },
        { term: "PE Ratio", def: "Price to Earnings ratio. Shows how much investors pay per rupee of earnings. Lower PE may indicate undervaluation. Nifty 50 average PE is ~20-22." },
        { term: "Dividend", def: "A portion of company profits distributed to shareholders. Companies like ITC, Coal India and PSUs are known for high dividend yields in India." },
        { term: "52-Week High/Low", def: "The highest and lowest price at which a stock has traded in the past year. Stocks near 52-week lows may present buying opportunities." },
        { term: "Volume", def: "Number of shares traded in a given period. High volume with price increase confirms strong buying interest. Low volume moves are less reliable." },
        { term: "Stop Loss", def: "A predetermined price at which you exit a trade to limit losses. Essential risk management tool. Stock AI calculates stop loss for every recommendation." },
        { term: "FII/FPI", def: "Foreign Institutional Investors. Their buying or selling significantly impacts Indian markets. Heavy FII selling often causes market corrections." },
        { term: "DII", def: "Domestic Institutional Investors — mutual funds, insurance companies, pension funds. They often buy during FII selling, providing market support." },
        { term: "Circuit Breaker", def: "Automatic trading halt when a stock moves beyond a limit (typically ±5%, ±10%, ±20%). Prevents panic buying or selling." },
        { term: "Demat Account", def: "Dematerialised account that holds your shares electronically. Required to trade on NSE/BSE. Provided by brokers like Zerodha, Groww, Upstox." },
      ].map(item => (
        <div key={item.term} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-blue-400 font-bold text-sm mb-1">{item.term}</p>
          <p className="text-slate-400 text-sm leading-relaxed">{item.def}</p>
        </div>
      ))}
    </div>
  </div>

  {/* ── Chapter 4 — How to Analyze Stocks ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">4</div>
      <h3 className="text-white text-xl font-bold">How to Analyze Stocks — Fundamental vs Technical</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h4 className="text-white font-bold text-lg mb-3">Fundamental Analysis</h4>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Evaluating a company's intrinsic value by examining financial statements, business model, management quality, competitive advantages and growth prospects. Used for long-term investment decisions.
        </p>
        <div className="space-y-2">
          {[
            { metric: "Revenue Growth", desc: "Is the company growing its sales year-on-year?" },
            { metric: "Profit Margins", desc: "Is it converting revenue to profit efficiently?" },
            { metric: "Debt Levels", desc: "Is the company over-leveraged? Check D/E ratio." },
            { metric: "Return on Equity", desc: "How efficiently is it using shareholder money?" },
            { metric: "Cash Flow", desc: "Is it generating real cash, not just paper profits?" },
          ].map(item => (
            <div key={item.metric} className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
              <div>
                <span className="text-white text-sm font-semibold">{item.metric}: </span>
                <span className="text-slate-400 text-sm">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h4 className="text-white font-bold text-lg mb-3">Technical Analysis</h4>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Studying price charts and patterns to predict future price movements. Based on the belief that historical price action repeats. Used primarily for short-term trading decisions.
        </p>
        <div className="space-y-2">
          {[
            { metric: "Moving Averages", desc: "50-day and 200-day MA show trend direction." },
            { metric: "RSI", desc: "Relative Strength Index — above 70 is overbought, below 30 is oversold." },
            { metric: "Support/Resistance", desc: "Price levels where stocks historically reverse." },
            { metric: "Volume Analysis", desc: "Confirms price moves — high volume = conviction." },
            { metric: "Candlestick Patterns", desc: "Doji, hammer, engulfing patterns signal reversals." },
          ].map(item => (
            <div key={item.metric} className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <div>
                <span className="text-white text-sm font-semibold">{item.metric}: </span>
                <span className="text-slate-400 text-sm">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
      <h4 className="text-green-400 font-bold mb-2">How Stock AI Combines Both Approaches</h4>
      <p className="text-slate-300 text-sm leading-relaxed">
        Stock AI at <strong>byteplay.org</strong> combines fundamental data (PE ratio, EPS, dividend yield, market cap) with price action data (52-week position, volume ratio, daily change) and real-time news sentiment to generate signals. This multi-factor approach is more robust than using either method alone. Our AI reads 4 news sources simultaneously and integrates qualitative news analysis with quantitative market data — something that would take a human analyst several hours per stock.
      </p>
    </div>
  </div>

  {/* ── Chapter 5 — Risks ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">5</div>
      <h3 className="text-white text-xl font-bold">Stock Market Risks Every Investor Must Understand</h3>
    </div>
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-6">
      <p className="text-red-400 font-semibold mb-2">Important Warning</p>
      <p className="text-slate-300 text-sm leading-relaxed">
        Stock market investments are subject to market risks. You can lose some or all of your invested capital. Never invest money you cannot afford to lose. Stock AI provides AI-generated analysis for educational purposes — it is not SEBI-registered investment advice.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        {
          risk:   "Market Risk",
          desc:   "The entire market can fall due to global events, economic slowdowns, or geopolitical crises. Even good companies fall in a bear market. Diversification helps but cannot eliminate this risk.",
          level:  "HIGH",
        },
        {
          risk:   "Company-Specific Risk",
          desc:   "A company can fail, face fraud allegations, lose key management, or see its business disrupted. Examples: YES Bank, Satyam. Research thoroughly before investing.",
          level:  "HIGH",
        },
        {
          risk:   "Liquidity Risk",
          desc:   "Small and mid-cap stocks may not have enough buyers when you want to sell. Stick to liquid, high-volume stocks especially for large investments.",
          level:  "MEDIUM",
        },
        {
          risk:   "Regulatory Risk",
          desc:   "Government policy changes can significantly impact specific sectors. Examples: tobacco taxes affecting ITC, telecom regulations affecting Idea, crypto bans.",
          level:  "MEDIUM",
        },
        {
          risk:   "Currency Risk",
          desc:   "For IT companies earning in USD, a strong rupee reduces their revenues when converted. FII flows also affected by INR/USD movements.",
          level:  "MEDIUM",
        },
        {
          risk:   "Emotional Risk",
          desc:   "Fear and greed are the biggest risks. Panic selling at lows and buying at highs destroys wealth. Following AI-based signals removes emotional bias from decisions.",
          level:  "HIGH",
        },
      ].map(item => (
        <div key={item.risk} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-white font-semibold">{item.risk}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              item.level === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {item.level}
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>

  {/* ── Chapter 6 — AI in Stock Markets ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">6</div>
      <h3 className="text-white text-xl font-bold">Role of Artificial Intelligence in Stock Market Analysis</h3>
    </div>
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
      <p className="text-slate-300 leading-relaxed mb-4">
        Artificial Intelligence is transforming how financial markets are analyzed. Hedge funds and institutional investors have used AI for over a decade. Now, platforms like <strong className="text-white">Stock AI (byteplay.org)</strong> are making these capabilities available to retail investors in India at no cost.
      </p>
      <p className="text-slate-300 leading-relaxed mb-4">
        Modern AI models — particularly Large Language Models (LLMs) like the ones powering Stock AI — can read and understand unstructured text data like news articles, company announcements and earnings reports. They can process thousands of data points simultaneously and identify patterns that human analysts might miss.
      </p>
      <p className="text-slate-300 leading-relaxed">
        However, AI is not infallible. Markets are influenced by human psychology, unexpected events and irrational behavior that no model can perfectly predict. AI analysis should be used as one input among many, not as the sole basis for investment decisions.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {[
        {
          title: "What AI Does Well",
          color: "border-green-500/30",
          items: [
            "Processing large volumes of news simultaneously",
            "Identifying patterns in price and volume data",
            "Removing emotional bias from analysis",
            "Generating structured, consistent outputs",
            "Running analysis on hundreds of stocks in minutes",
            "Combining multiple data sources into one signal",
          ],
          itemColor: "text-green-400",
        },
        {
          title: "What AI Cannot Do",
          color: "border-red-500/30",
          items: [
            "Predict black swan events (wars, pandemics)",
            "Guarantee future stock price movements",
            "Replace thorough fundamental research",
            "Account for insider information",
            "Understand complex political situations perfectly",
            "Provide SEBI-registered investment advice",
          ],
          itemColor: "text-red-400",
        },
      ].map(item => (
        <div key={item.title} className={`bg-slate-800 border rounded-xl p-5 ${item.color}`}>
          <h4 className="text-white font-bold mb-3">{item.title}</h4>
          <div className="space-y-2">
            {item.items.map(i => (
              <div key={i} className="flex gap-2">
                <span className={`${item.itemColor} text-xs mt-0.5`}>●</span>
                <p className="text-slate-400 text-sm">{i}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
      <h4 className="text-cyan-400 font-bold mb-2">How Stock AI Uses LLM Technology</h4>
      <p className="text-slate-300 text-sm leading-relaxed">
        Stock AI at <strong>byteplay.org</strong> uses Llama 3.3 — a state-of-the-art Large Language Model — to analyze each stock. For every analysis request, the AI receives: live price data from NSE, PE ratio, 52-week position, volume data, and the latest news from 4 sources. It then generates a structured JSON response with BUY/HOLD/SELL signal, confidence score, entry price, two price targets, stop loss, quantity guide and detailed reasoning. The entire process takes approximately 8 seconds.
      </p>
    </div>
  </div>

  {/* ── Chapter 7 — How to start investing ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">7</div>
      <h3 className="text-white text-xl font-bold">How to Start Investing in Indian Stocks — Step by Step</h3>
    </div>
    <div className="space-y-4">
      {[
        {
          step:  "Open a Demat and Trading Account",
          desc:  "You need a Demat account to hold shares electronically and a trading account to buy/sell. Popular brokers in India include Zerodha, Groww, Upstox, Angel One and HDFC Securities. KYC verification with Aadhaar and PAN is required. Account opening is free on most platforms.",
        },
        {
          step:  "Start with Large-Cap Nifty 50 Stocks",
          desc:  "Begin your investing journey with well-known, stable companies from Nifty 50. These include HDFC Bank, Reliance, TCS, Infosys and ITC. They are liquid, well-researched and less volatile than small or mid-cap stocks. Avoid penny stocks until you have significant experience.",
        },
        {
          step:  "Use Stock AI for Analysis",
          desc:  "Before buying any stock, run an AI analysis on byteplay.org. The platform reads official NSE announcements, latest news and valuation metrics to give you a structured BUY/HOLD/SELL signal with specific entry price, targets and stop loss. Use this as one input — always do your own research as well.",
        },
        {
          step:  "Always Set a Stop Loss",
          desc:  "A stop loss is a price level at which you exit a losing trade to prevent further loss. For example, if you buy a stock at ₹100, set a stop loss at ₹90. If it falls below ₹90, sell immediately. This protects you from catastrophic losses. Stock AI calculates an appropriate stop loss for every recommendation.",
        },
        {
          step:  "Diversify Your Portfolio",
          desc:  "Never put all your money in one stock or one sector. Spread across different sectors — banking, IT, FMCG, pharma, infrastructure. A diversified portfolio reduces the impact of any single stock's poor performance on your overall wealth.",
        },
        {
          step:  "Track Your Portfolio Regularly",
          desc:  "Use Stock AI's portfolio tracker at byteplay.org to monitor your live P&L. Enter your holdings, buy prices and quantities — the app shows your current profit or loss updated in real time. Review your portfolio at least once a week and rebalance based on changed fundamentals.",
        },
      ].map((item, index) => (
        <div key={item.step} className="flex gap-4 bg-slate-800 border border-slate-700 rounded-xl p-5">
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center text-yellow-400 font-black text-sm">
            {index + 1}
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">{item.step}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* ── Chapter 8 — Dividends & Long-term ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">8</div>
      <h3 className="text-white text-xl font-bold">Dividend Investing — Building Passive Income from Stocks</h3>
    </div>
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-4">
      <p className="text-slate-300 leading-relaxed mb-4">
        Dividend investing is a strategy of buying stocks that regularly pay dividends — a share of company profits distributed to shareholders. In India, many PSU companies and established private companies offer attractive dividend yields. Reinvesting dividends over time through compounding can significantly grow your wealth.
      </p>
      <p className="text-slate-300 leading-relaxed">
        For example, Coal India has historically offered dividend yields of 5-8%. If you invested ₹10 lakh in Coal India and reinvested all dividends, your investment could double in approximately 10-14 years purely through dividends — before any price appreciation.
      </p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { stock: "ITC",       yield: "~4-5%",  type: "FMCG" },
        { stock: "Coal India", yield: "~5-8%", type: "Mining" },
        { stock: "ONGC",      yield: "~4-6%",  type: "Energy" },
        { stock: "Power Grid", yield: "~4-5%", type: "Utility" },
      ].map(item => (
        <div key={item.stock} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
          <p className="text-white font-bold text-sm">{item.stock}</p>
          <p className="text-emerald-400 font-black">{item.yield}</p>
          <p className="text-slate-500 text-xs">{item.type}</p>
        </div>
      ))}
    </div>
    <p className="text-slate-500 text-xs mt-3 text-center">
      * Dividend yields are approximate and change with stock price. Check byteplay.org for current data.
    </p>
  </div>

  {/* ── CTA in middle of content ── */}
  <div className="bg-gradient-to-r from-blue-900/50 to-slate-800 border border-blue-500/30 rounded-2xl p-8 text-center mb-12">
    <h3 className="text-white text-2xl font-bold mb-3">
      Put This Knowledge Into Practice
    </h3>
    <p className="text-slate-400 mb-6 max-w-xl mx-auto">
      Stock AI combines everything you've learned here — fundamental analysis, technical screening, news sentiment — into one AI-powered signal. Free to start, no credit card needed.
    </p>
    <button onClick={onGetStarted}
      className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition">
      Get Free AI Stock Analysis at byteplay.org
    </button>
  </div>

  {/* ── Chapter 9 — Common Mistakes ── */}
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">9</div>
      <h3 className="text-white text-xl font-bold">10 Common Mistakes New Investors Make</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { mistake: "Investing without research",    fix: "Use Stock AI to analyze any stock in 8 seconds before buying" },
        { mistake: "No stop loss",                  fix: "Always set a stop loss. Stock AI calculates it for every signal" },
        { mistake: "Panic selling at lows",         fix: "Pre-define exit points. Don't make decisions during market volatility" },
        { mistake: "Buying tips from WhatsApp",     fix: "Verify every tip with fundamental data. Use byteplay.org for quick analysis" },
        { mistake: "Over-concentration in 1 stock", fix: "Diversify across at least 5-8 different sectors" },
        { mistake: "Ignoring valuations",           fix: "Always check PE ratio before buying. Never buy overvalued stocks" },
        { mistake: "Trading with borrowed money",   fix: "Only invest surplus money you can afford to lose completely" },
        { mistake: "Ignoring transaction costs",    fix: "Frequent trading erodes returns through brokerage and STT charges" },
        { mistake: "FOMO buying at highs",          fix: "Check 52-week position. Avoid stocks already at 52-week highs without strong catalysts" },
        { mistake: "Not reviewing portfolio",       fix: "Review monthly. Use Stock AI portfolio tracker for live P&L monitoring" },
      ].map((item, i) => (
        <div key={item.mistake} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-3">
          <span className="text-rose-400 font-black text-lg flex-shrink-0">{i + 1}.</span>
          <div>
            <p className="text-white font-semibold text-sm mb-1">{item.mistake}</p>
            <p className="text-slate-400 text-xs leading-relaxed">Fix: {item.fix}</p>
          </div>
        </div>
      ))}
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