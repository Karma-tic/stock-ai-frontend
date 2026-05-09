export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 max-w-3xl mx-auto">
      <h1 className="text-white text-3xl font-bold mb-6">About Stock AI</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <p className="text-slate-300 text-lg leading-relaxed">
          Stock AI is an AI-powered stock market intelligence platform for Indian investors.
          We scrape real-time data from NSE India, Economic Times, Google News and more —
          then use Large Language Models to generate structured BUY/HOLD/SELL signals
          for 500+ NSE/BSE listed stocks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: '📊', title: '500+ Stocks', desc: 'NSE & BSE coverage' },
          { icon: '🤖', title: 'AI Powered', desc: 'Groq LLM analysis' },
          { icon: '⚡', title: 'Real-time', desc: 'Live market data' },
        ].map(item => (
          <div key={item.title} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="text-white font-bold">{item.title}</p>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-sm">
        Built by Karmatix. Contact: contact@karmatix.in
      </p>
    </div>
  );
}