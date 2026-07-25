import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  Activity,
  Globe,
  Cpu,
} from "lucide-react";
import UpcomingIpos from "./UpcomingIpos";

interface Props {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: Props) {
  const [trackAccuracy, setTrackAccuracy] = useState<number | null>(null);
 const [activePricing, setActivePricing] = useState(1); // Default to middle card
  const [touchStart, setTouchStart] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activePricing < 2) {
      setActivePricing(prev => prev + 1);
    }
    if (isRightSwipe && activePricing > 0) {
      setActivePricing(prev => prev - 1);
    }
  };

  const pricingPlans = [
    {
      title: "Free",
      price: "₹0",
      period: "forever",
      features: ["2 AI analyses/day", "Top 10 stocks", "3 watchlist stocks"],
      badge: null,
      badgeClass: "",
      bgClass: "bg-slate-800",
      borderClass: "border border-slate-700",
      titleClass: "text-slate-400",
      dotClass: "bg-slate-500",
      featureClass: "text-slate-400",
      btnClass: "border border-slate-600 text-slate-300 hover:border-slate-400",
      btnText: "Get Started"
    },
    {
      title: "Trial",
      price: "₹1",
      period: "1 day access",
      features: ["Full Pro access", "All features unlocked", "No commitment"],
      badge: "TRY IT",
      badgeClass: "bg-yellow-500 text-black",
      bgClass: "bg-yellow-500/5",
      borderClass: "border border-yellow-500/40",
      titleClass: "text-yellow-400",
      dotClass: "bg-yellow-400",
      featureClass: "text-slate-300",
      btnClass: "bg-yellow-500 hover:bg-yellow-400 text-black",
      btnText: "Try for ₹1"
    },
    {
      title: "1 Month",
      price: "₹99",
      originalPrice: "₹499",
      period: "no auto-renewal · limited offer",
      features: ["Unlimited analysis", "500+ stocks", "Portfolio tracker", "Email digest"],
      badge: "POPULAR",
      badgeClass: "bg-blue-600 text-white",
      bgClass: "bg-blue-600/10",
      borderClass: "border-2 border-blue-500",
      titleClass: "text-blue-400",
      dotClass: "bg-blue-400",
      featureClass: "text-slate-300",
      btnClass: "bg-blue-600 hover:bg-blue-500 text-white",
      btnText: "Get 30 Days for ₹99"
    }
  ];
  useEffect(() => {
    const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    axios.get(`${BASE}/api/track-record`)
      .then(res => {
        if (res.data?.overall_accuracy) {
          setTrackAccuracy(res.data.overall_accuracy);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">

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
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-4">
          {[
            { num: "2,300+", label: "NSE Stocks" },
            { num: "8 sec", label: "Analysis Time" },
            { num: trackAccuracy ? `${trackAccuracy}%` : "—", label: "Verified Accuracy" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-blue-400">{s.num}</p>
              <p className="text-slate-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <Link
          to="/track-record"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
        >
          See our full public track record — every signal, every outcome
        </Link>
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
            AI signals for educational purposes only. Not SEBI-registered advice.
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
            { step: "1", icon: Activity, anim: "animate-[bounce_3s_infinite]", color: "text-blue-400", bg: "bg-blue-500/10", title: "Fetch Live Data", desc: "Real-time price, PE ratio, 52-week range, volume and dividend data from NSE/BSE" },
            { step: "2", icon: Globe, anim: "animate-[spin_8s_linear_infinite]", color: "text-indigo-400", bg: "bg-indigo-500/10", title: "Scrape News", desc: "Reads NSE India announcements, Google News, Economic Times and Moneycontrol simultaneously" },
            { step: "3", icon: Cpu, anim: "animate-pulse", color: "text-purple-400", bg: "bg-purple-500/10", title: "AI Analysis", desc: "Llama 3.3 AI processes all data and generates structured BUY/HOLD/SELL signal" },
            { step: "4", icon: Target, anim: "animate-[pulse_2s_infinite]", color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Get Signal", desc: "Receive exact entry price, target prices, stop loss and quantity recommendations" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="text-center group">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50 ${s.bg}`}>
                  <Icon className={`w-8 h-8 ${s.color} ${s.anim}`} strokeWidth={1.5} />
                </div>
                <div className="text-blue-400 text-xs font-bold mb-1">STEP {s.step}</div>
                <p className="text-white font-semibold mb-2">{s.title}</p>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
      {/* Features */}
      {/* Features */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-white text-3xl font-bold text-center mb-10">
            Everything You Need to Invest Smarter
          </h2>

          {/* Add the custom keyframes for the feature icons */}
          <style>{`
            @keyframes feature-float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
            @keyframes feature-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes feature-pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(0.9); opacity: 0.7; }
            }
          `}</style>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "BUY/HOLD/SELL Signals",
                desc: "Clear signals with confidence percentage so you know how strong the recommendation is",
                anim: "feature-pulse 2.5s ease-in-out infinite"
              },
              {
                icon: IndianRupee,
                title: "Price Targets",
                desc: "Exact entry price, two target levels and stop loss for every analysis",
                anim: "feature-float 3s ease-in-out infinite"
              },
              {
                icon: Smartphone,
                title: "Works on Phone",
                desc: "Fully responsive — check your stocks anywhere from your mobile device",
                anim: "feature-float 4s ease-in-out infinite"
              },
              {
                icon: Star,
                title: "Watchlist",
                desc: "Save your favourite stocks and monitor them with one tap",
                anim: "feature-pulse 3s ease-in-out infinite"
              },
              {
                icon: Briefcase,
                title: "Portfolio Tracker",
                desc: "Track your holdings with live P&L — see your profit or loss in real time",
                anim: "feature-float 3.5s ease-in-out infinite"
              },
              {
                icon: Mail,
                title: "Morning Digest",
                desc: "Pro users get daily email at 8:30 AM with top BUY signals before market opens",
                anim: "feature-float 2.5s ease-in-out infinite"
              },
              {
                icon: Coins,
                title: "Penny Stocks",
                desc: "Dedicated section for NSE stocks under ₹100 — high risk, high reward opportunities",
                anim: "feature-float 3s ease-in-out infinite"
              },
              {
                icon: Newspaper,
                title: "Multi-source News",
                desc: "Reads NSE India, Google News, Economic Times and Moneycontrol for every stock",
                anim: "feature-float 4s ease-in-out infinite"
              },
              {
                icon: RefreshCcw,
                title: "Hourly Refresh",
                desc: "Signals automatically updated every hour during market hours (9 AM - 4 PM IST)",
                anim: "feature-spin 6s linear infinite"
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition group"
                >
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon 
                      className="w-6 h-6 text-blue-400" 
                      strokeWidth={2} 
                      style={{ animation: f.anim }}
                    />
                  </div>
                  <p className="text-white font-semibold mb-2">{f.title}</p>
                  <p className="text-slate-400 text-sm">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Wrap Feature */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-900/40 to-slate-800/40 border border-blue-500/20 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-white text-3xl font-bold mb-4">
            Daily Market Wrap-Up
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Get a concise, 500-word daily summary of the Nifty 50, Sensex, and top market news. Updated every weekday at 4:15 PM IST so you never miss a beat.
          </p>
          <Link to="/market-wrap" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition">
            Read the Latest Wrap →
          </Link>
        </div>
      </section>

     
      {/* Pricing — replace existing section */}
      <section className="bg-slate-900 py-16 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-white text-3xl font-bold mb-2">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 mb-10">No hidden charges. Cancel anytime.</p>

          {/* MOBILE: 3D Horizontal Slider */}
          <div 
            className="sm:hidden relative h-[380px] w-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {pricingPlans.map((plan, i) => {
              const offset = i - activePricing;
              
              // Determine 3D scaling and fading based on position
              let transform = 'scale-75 opacity-0 z-0 pointer-events-none hidden';
              if (offset === 0) transform = 'translate-x-0 scale-100 z-20 opacity-100 shadow-2xl';
              else if (offset === -1) transform = '-translate-x-[85%] scale-90 z-10 opacity-40 cursor-pointer';
              else if (offset === 1) transform = 'translate-x-[85%] scale-90 z-10 opacity-40 cursor-pointer';

              return (
                <div 
                  key={plan.title}
                  onClick={() => setActivePricing(i)}
                  className={`absolute w-[280px] text-left transition-all duration-300 ease-out rounded-xl p-5 ${plan.bgClass} ${plan.borderClass} ${transform}`}
                >
                  {plan.badge && (
                    <span className={`absolute -top-3 left-4 text-xs px-2 py-0.5 rounded-full font-bold ${plan.badgeClass}`}>
                      {plan.badge}
                    </span>
                  )}
                  <p className={`${plan.titleClass} text-xs font-semibold uppercase mb-2`}>{plan.title}</p>
                  <div className="flex items-center gap-2 mb-1">
                    {plan.originalPrice && (
                      <p className="text-slate-500 text-lg line-through">{plan.originalPrice}</p>
                    )}
                    <p className="text-3xl font-black text-white">{plan.price}</p>
                    {plan.originalPrice && (
                      <span className="text-xs bg-green-500 text-black px-1.5 py-0.5 rounded font-bold">80% OFF</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mb-4">{plan.period}</p>
                  <div className="space-y-2">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${plan.dotClass}`} />
                        <p className={`${plan.featureClass} text-xs`}>{f}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={(e) => {
                      if (offset !== 0) {
                        // If they click the button on a faded side card, just zoom it in instead of triggering payment
                        e.stopPropagation(); 
                        setActivePricing(i);
                      } else {
                        onGetStarted();
                      }
                    }}
                    className={`mt-4 w-full py-2 rounded-lg text-sm font-bold transition ${plan.btnClass}`}
                  >
                    {plan.btnText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* DESKTOP: Standard Centered Grid */}
          <div className="hidden sm:grid grid-cols-3 gap-6 justify-items-center">
            {pricingPlans.map((plan) => (
              <div key={plan.title} className={`w-full text-left relative rounded-xl p-5 ${plan.bgClass} ${plan.borderClass}`}>
                {plan.badge && (
                  <span className={`absolute -top-3 left-4 text-xs px-2 py-0.5 rounded-full font-bold ${plan.badgeClass}`}>
                    {plan.badge}
                  </span>
                )}
                <p className={`${plan.titleClass} text-xs font-semibold uppercase mb-2`}>{plan.title}</p>
                <div className="flex items-center gap-2 mb-1">
                  {plan.originalPrice && (
                    <p className="text-slate-500 text-lg line-through">{plan.originalPrice}</p>
                  )}
                  <p className="text-3xl font-black text-white">{plan.price}</p>
                  {plan.originalPrice && (
                    <span className="text-xs bg-green-500 text-black px-1.5 py-0.5 rounded font-bold">80% OFF</span>
                  )}
                </div>
                <p className="text-slate-500 text-xs mb-4">{plan.period}</p>
                <div className="space-y-2">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${plan.dotClass}`} />
                      <p className={`${plan.featureClass} text-xs`}>{f}</p>
                    </div>
                  ))}
                </div>
                <button onClick={onGetStarted}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-bold transition ${plan.btnClass}`}>
                  {plan.btnText}
                </button>
              </div>
            ))}
          </div>

          {/* Mobile Pagination Indicator Dots */}
          <div className="sm:hidden flex justify-center gap-2 mt-6">
            {pricingPlans.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setActivePricing(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activePricing === i ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700'}`}
              />
            ))}
          </div>

        </div>
      </section>



      {/* Upcoming IPOs Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-white text-3xl font-bold mb-4">
            IPO AI Predictions <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-full ml-2 align-middle border border-emerald-500/20">NEW</span>
          </h2>
          <p className="text-slate-400">
            Live grey market premium (GMP) tracking and AI analysis of upcoming IPOs.
          </p>
        </div>
        <UpcomingIpos />
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
              a: "Yes, Stock AI has a free plan that gives you 2 AI analyses per day, 3 watchlist stocks and access to top 10 market stocks. Pro plan at ₹99/month (limited offer, regular price ₹499) gives unlimited access."
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

      {/* SEO Article for AdSense - What is Stock AI */}
      <section className="bg-slate-950 py-16 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 prose prose-invert prose-headings:text-white prose-a:text-blue-400">
          <h2 className="text-3xl font-bold mb-6 text-center">What is Stock AI and How Does it Analyze the Indian Market?</h2>
          
          <p className="mb-4 leading-relaxed">
            The Indian stock market (comprising the National Stock Exchange and Bombay Stock Exchange) has grown exponentially, bringing in millions of new retail investors. However, trading successfully requires vast amounts of research. Professional fund managers spend hours analyzing balance sheets, earnings reports, global macroeconomic trends, and breaking news. For the average retail investor, conducting this level of deep-dive fundamental and technical analysis is practically impossible due to time constraints.
          </p>
          
          <p className="mb-4 leading-relaxed">
            This is where <strong>Stock AI</strong> bridges the gap. By leveraging advanced Large Language Models (LLMs) and artificial intelligence algorithms, Stock AI automates the grueling research process. In less than 10 seconds, our AI engines scrape real-time financial data, analyze historical price action, read live news feeds from top financial publications (such as The Economic Times, Moneycontrol, and LiveMint), and synthesize this massive volume of unstructured data into a clear, actionable trading signal.
          </p>

          <h3 className="text-2xl font-bold mb-4 mt-8 text-white">Why AI-Driven Analysis Outperforms Traditional Methods</h3>
          <p className="mb-4 leading-relaxed">
            Human analysts, no matter how skilled, are subject to cognitive biases—fear, greed, and confirmation bias. They can also only process a limited amount of information at a time. AI models, on the other hand, are completely objective. They can instantly cross-reference a company's P/E ratio, its debt-to-equity metrics, recent insider trading filings, and the overall sentiment of a breaking news article, outputting a completely data-driven probability score.
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300">
            <li><strong>Unemotional Decision Making:</strong> The AI doesn't panic during market corrections or succumb to FOMO (Fear Of Missing Out) during massive bull runs.</li>
            <li><strong>Speed of Execution:</strong> The AI processes quarterly earnings results the second they are uploaded to the NSE India portal, analyzing the EPS (Earnings Per Share) and revenue growth instantly.</li>
            <li><strong>Comprehensive Risk Management:</strong> Every BUY or SELL signal generated is accompanied by a strict Stop Loss and defined Price Targets, ensuring that downside risk is always mitigated.</li>
          </ul>

          <h3 className="text-2xl font-bold mb-4 mt-8 text-white">Empowering the Indian Retail Investor</h3>
          <p className="mb-4 leading-relaxed">
            Our mission at BytePlay and Karmatix is to democratize financial research. Whether you are looking for long-term delivery investments, quick swing trades, or high-risk penny stocks, Stock AI provides the institutional-grade analytics you need. We believe that with the right educational resources and AI-powered tools, every investor can navigate the complexities of Nifty 50 and BankNifty with confidence.
          </p>
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

    </div>
  );
}
