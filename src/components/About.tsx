export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">

        {/* Hero */}
        <div className="mb-12 max-w-2xl">
          <p className="text-accent text-sm font-medium mb-2">
            About Us
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl text-balance">
            Making stock market research accessible to every Indian investor
          </h1>
          <p className="text-base leading-relaxed text-muted">
            Stock AI is an AI-powered stock market intelligence platform built for
            retail investors in India. We believe every investor — not just
            institutional traders — deserves access to fast, data-driven analysis.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { number: "2300+",   label: "NSE/BSE Stocks Covered" },
            { number: "8 sec",  label: "Average Analysis Time" },
            { number: "6+",     label: "News Sources Per Stock" },
            { number: "Free",   label: "To Start" },
          ].map(stat => (
            <div key={stat.label}
              className="rounded-card border border-line bg-surface p-5">
              <p className="num mb-1 text-2xl font-semibold text-ink">{stat.number}</p>
              <p className="text-muted text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">Our Story</h2>
          <div className="rounded-card border border-line bg-surface p-8">
            <p className="text-ink/85 leading-relaxed mb-4">
              Stock AI was born out of a simple frustration. As retail investors in
              India, we found ourselves spending hours every day reading NSE filings,
              scrolling through Economic Times, checking Moneycontrol, and trying to
              make sense of conflicting information — only to still feel uncertain
              about what to do.
            </p>
            <p className="text-ink/85 leading-relaxed mb-4">
              Professional traders and institutional investors have entire teams of
              analysts doing this research for them. The retail investor has to do it
              alone, after work hours, with limited time and tools.
            </p>
            <p className="text-ink/85 leading-relaxed mb-4">
              We asked a simple question: what if AI could read all the relevant
              sources simultaneously and give a structured, actionable signal in
              seconds? Not a vague prediction, but a specific entry price, target
              levels, stop loss, and the reasoning behind it.
            </p>
            <p className="text-ink/85 leading-relaxed">
              That question became Stock AI. Built in India, for Indian investors,
              covering NSE and BSE markets, with a deep understanding of the Indian
              financial ecosystem.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="mb-16">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">What Stock AI Does</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "Multi-Source Data Scraping",
                desc:  "For every stock analysis, we simultaneously read the official NSE India corporate announcements, Google News, Economic Times and Moneycontrol. This gives the AI a comprehensive picture of both fundamental data and market sentiment before generating a signal."
              },
              {
                title: "AI-Generated Signals",
                desc:  "We use large language models trained on financial analysis patterns to process stock data and news. The result is a structured BUY, HOLD or SELL signal with confidence percentage, entry price, two target levels, stop loss, and the reasoning behind the recommendation."
              },
              {
                title: "Portfolio Tracking",
                desc:  "Users can enter their existing holdings — stock name, quantity and average buy price — and Stock AI shows live profit and loss in real time. The portfolio tracker updates automatically as market prices change throughout the day."
              },
              {
                title: "Watchlist Management",
                desc:  "Save stocks you are interested in to your watchlist. The app monitors these stocks and refreshes signals every hour during market hours, so you always have up-to-date analysis without having to manually request it each time."
              },
              {
                title: "Morning Digest Email",
                desc:  "Pro subscribers receive a curated email every weekday morning at 8:30 AM IST, before the Indian market opens at 9:15 AM. The digest shows the top BUY signals with prices and confidence scores, giving you a head start before trading begins."
              },
              {
                title: "Penny Stock Screening",
                desc:  "We maintain a dedicated section for NSE stocks trading under ₹150. These high-risk, high-potential stocks are screened daily and shown with live prices. Each penny stock can be analyzed using the same AI engine as large cap stocks."
              },
            ].map(item => (
              <div key={item.title}
                className="rounded-card border border-line bg-surface p-6">
                <h3 className="text-ink font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-muted leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">How Our Technology Works</h2>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Live Market Data",
                desc:  "When you request an analysis, we fetch the latest price, PE ratio, PB ratio, EPS, 52-week high/low, dividend yield, volume data and market cap directly from NSE and BSE via Yahoo Finance API. This data is always real-time, never cached."
              },
              {
                step: "02",
                title: "News & Announcement Scraping",
                desc:  "Simultaneously, our scrapers read the official NSE corporate announcements board for that company, search Google News for recent coverage, check Economic Times and Moneycontrol for financial reporting. All four sources are read in parallel, taking under 2 seconds."
              },
              {
                step: "03",
                title: "AI Analysis",
                desc:  "The combined data — price metrics, valuation ratios and news headlines — is structured into a detailed prompt for a large language model. The AI is instructed to act as an Indian market analyst and return only valid JSON with signal, confidence, price targets and reasoning."
              },
              {
                step: "04",
                title: "Signal Delivery",
                desc:  "The structured result is sent back to your screen in real time. The entire process from tap to result takes approximately 8 seconds. The signal is also saved to our database so it can be referenced in your morning digest and trending signals bar."
              },
            ].map(item => (
              <div key={item.step}
                className="flex gap-6 rounded-card border border-line bg-surface p-6">
                <div className="num grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/10">
                  <span className="text-sm font-semibold text-accent">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-ink font-bold mb-2">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important disclaimer */}
        <div className="mb-16">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">
            Important — Please Read
          </h2>
          <div className="rounded-card border border-caution/30 bg-caution/[0.06] p-6 sm:p-8">
            <h3 className="text-caution font-bold text-lg mb-4">
              Educational Platform — Not Investment Advice
            </h3>
            <p className="text-ink/85 leading-relaxed mb-4">
              Stock AI is an educational and informational platform. All signals,
              price targets, buy/hold/sell recommendations and analysis generated
              by our AI are for educational purposes only. They do not constitute
              financial advice, investment advice or trading recommendations.
            </p>
            <p className="text-ink/85 leading-relaxed mb-4">
              Stock AI and BytePlay Technologies are not registered with the
              Securities and Exchange Board of India (SEBI) as investment advisors,
              portfolio managers, or research analysts. We do not provide any
              regulated financial services.
            </p>
            <p className="text-ink/85 leading-relaxed mb-4">
              Stock market investments are subject to market risks. The value of
              investments can go up or down significantly. AI systems can make
              errors and generate inaccurate analysis. Never invest money that
              you cannot afford to lose.
            </p>
            <p className="text-ink/85 leading-relaxed">
              Always consult a SEBI-registered financial advisor before making
              investment decisions. Conduct your own research and due diligence.
              Past performance is not indicative of future results.
            </p>
          </div>
        </div>

        {/* Data sources */}
        <div className="mb-16">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">Our Data Sources</h2>
          <p className="text-muted mb-6 leading-relaxed">
            We use the following publicly available data sources to power our
            analysis. All data is sourced in real time and attributed correctly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                name: "NSE India",
                url:  "https://www.nseindia.com",
                desc: "Official corporate announcements, board meeting notices, results, regulatory filings"
              },
              {
                name: "BSE India",
                url:  "https://www.bseindia.com",
                desc: "Listed company disclosures, financial results and corporate actions"
              },
              {
                name: "Yahoo Finance",
                url:  "https://finance.yahoo.com",
                desc: "Real-time price data, PE ratio, EPS, market cap, dividend yield and historical OHLCV data"
              },
              {
                name: "Google News",
                url:  "https://news.google.com",
                desc: "Latest news coverage from multiple publications for each company"
              },
              {
                name: "Economic Times",
                url:  "https://economictimes.indiatimes.com/markets",
                desc: "Indian financial news, market analysis and company-specific reporting"
              },
              {
                name: "Moneycontrol",
                url:  "https://www.moneycontrol.com",
                desc: "Stock market news, company results and financial data for Indian markets"
              },
            ].map(source => (
              <div key={source.name}
                className="rounded-card border border-line bg-surface p-5">
                <a href={source.url} target="_blank" rel="noopener noreferrer"
                  className="text-accent font-bold hover:text-accent transition">
                  {source.name} ↗
                </a>
                <p className="text-muted text-sm mt-2 leading-relaxed">
                  {source.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Company info */}
        <div className="mb-16">
          <h2 className="mb-4 text-xl font-semibold tracking-[-0.015em] text-ink">Company Information</h2>
          <div className="rounded-card border border-line bg-surface p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-muted text-xs mb-3">
                  Organisation
                </h3>
                <p className="text-ink font-semibold">Karmatix</p>
                <p className="text-muted text-sm mt-1">
                  Parent company of BytePlay. Independent software and technology company building
                  financial tools for Indian retail investors.
                </p>
              </div>
              <div>
                <h3 className="text-muted text-xs mb-3">
                  Location & Address
                </h3>
                <p className="text-ink font-semibold">Headquarters</p>
                <p className="text-muted text-sm mt-1">
                  Bhopal, Madhya Pradesh, India<br />
                  (Operating fully remote across India)
                </p>
              </div>
              <div>
                <h3 className="text-muted text-xs mb-3">
                  Contact & Support
                </h3>
                <a href="mailto:contact@karmatix.in"
                  className="text-accent hover:text-accent transition">
                  contact@karmatix.in
                </a>
                <p className="text-muted text-sm mt-2">
                  Business Hours: Monday to Friday, 9:00 AM - 6:00 PM IST
                </p>
              </div>
              <div>
                <h3 className="text-muted text-xs mb-3">
                  Leadership
                </h3>
                <p className="text-ink font-semibold">Founded by Indian Retail Traders</p>
                <p className="text-muted text-sm mt-1">
                  Built by a dedicated team of quantitative developers and financial researchers who understand the challenges faced by everyday investors in the NSE/BSE markets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-card border border-accent/30 bg-accent/[0.06] p-6 text-center sm:p-8">
          <h2 className="mb-2 text-xl font-semibold tracking-[-0.015em] text-ink">
            Start Analyzing Indian Stocks for Free
          </h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            Join thousands of Indian retail investors using AI to make
            more informed investment decisions. No credit card required.
          </p>
          <a href="https://byteplay.org"
            className="inline-flex h-12 items-center rounded-control bg-cobalt px-6 font-semibold text-white transition hover:brightness-110">
            Get Started Free
          </a>
        </div>

      </div>
    
  );
}