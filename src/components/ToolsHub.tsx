import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, PieChart, Activity, Scale } from 'lucide-react';
import SEO from './SEO';

export default function ToolsHub() {
  const tools = [
    {
      title: "SIP Calculator",
      description: "Calculate the future value of your monthly SIP investments with the power of compounding.",
      path: "/tools/sip-calculator",
      icon: <Calculator className="w-8 h-8 text-lavender-primary" />,
      color: "border-white/50 bg-blue-500/10",
      isNew: true
    },
    // Placeholders for future tools to show the user what else is possible
    {
      title: "Stock Comparison",
      description: "Compare NSE stocks side by side by price, PE, dividend yield, 52-week range, and market cap.",
      path: "/tools/stock-comparison",
      icon: <Scale className="w-8 h-8 text-green-600" />,
      color: "border-green-500/30 bg-green-500/10",
      isNew: true
    },
    {
      title: "Lumpsum Calculator",
      description: "Estimate returns on your one-time investments over a long period.",
      path: "/tools/lumpsum-calculator",
      icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
      isNew: true
    },
    {
      title: "F&O Calculator",
      description: "Calculate your exact P&L, Margin, Brokerage, and STT for Futures and Options.",
      path: "/tools/fno-calculator",
      icon: <Activity className="w-8 h-8 text-indigo-400" />,
      color: "border-indigo-500/30 bg-indigo-500/10",
      isNew: true
    },
    {
      title: "Brokerage Calculator",
      description: "Calculate exactly how much you'll pay in taxes, STT, and brokerage per trade.",
      path: "/tools/brokerage-calculator",
      icon: <PieChart className="w-8 h-8 text-purple-400" />,
      color: "border-white/50 bg-purple-500/10",
      isNew: true
    }
  ];

  return (
    <div className="min-h-screen bg-lavender-surface py-16 px-6">
      <SEO
        title="Free Financial Calculators for Indian Investors | Stock AI"
        description="Use free SIP, lumpsum, brokerage, F&O, and stock comparison tools built for Indian stock market investors."
        canonicalPath="/tools"
      />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-lavender-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Financial Tools
          </p>
          <h1 className="text-lavender-text text-4xl font-bold mb-4">
            Smart Calculators for Smart Investors
          </h1>
          <p className="text-lavender-text/70 max-w-2xl mx-auto text-lg">
            Plan your financial future with our suite of free, interactive tools designed specifically for the Indian market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            tool.path !== "#" ? (
              <Link key={tool.title} to={tool.path} className={`block p-6 rounded-2xl border ${tool.color} hover:scale-105 transition duration-300 relative overflow-hidden group`}>
                {tool.isNew && (
                  <div className="absolute top-4 right-4 bg-gradient-lavender text-white text-xs font-bold px-2 py-1 rounded-full shadow-lavender">
                    NEW
                  </div>
                )}
                <div className="mb-4">
                  {tool.icon}
                </div>
                <h3 className="text-lavender-text text-xl font-bold mb-2">{tool.title}</h3>
                <p className="text-lavender-text/70 text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>
                <div className="text-lavender-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Calculate Now <span>→</span>
                </div>
              </Link>
            ) : (
              <div key={tool.title} className={`p-6 rounded-2xl border ${tool.color} opacity-60 relative overflow-hidden`}>
                <div className="absolute top-4 right-4 bg-lavender-surface text-lavender-text/70 text-xs font-bold px-2 py-1 rounded-full">
                  COMING SOON
                </div>
                <div className="mb-4 grayscale">
                  {tool.icon}
                </div>
                <h3 className="text-lavender-text text-xl font-bold mb-2">{tool.title}</h3>
                <p className="text-lavender-text/70 text-sm leading-relaxed mb-6">
                  {tool.description}
                </p>
                <div className="text-lavender-text/60 text-sm font-semibold flex items-center gap-1">
                  Available Soon
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
