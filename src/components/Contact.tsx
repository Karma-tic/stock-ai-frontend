export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 max-w-3xl mx-auto">
      <h1 className="text-white text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-slate-400 text-sm mb-8">BytePlay Technologies — Stock AI</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { icon: '📧', title: 'General Enquiries', value: 'contact@karmatix.in' },
          { icon: '💳', title: 'Payment & Billing', value: 'contact@karmatix.in' },
          { icon: '🔒', title: 'Privacy Concerns', value: 'contact@karmatix.in' },
          { icon: '🛠️', title: 'Technical Support', value: 'contact@karmatix.in' },
        ].map(item => (
          <div key={item.title} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-white font-semibold">{item.title}</p>
            <a href={`mailto:${item.value}`}
              className="text-blue-400 hover:text-blue-300 text-sm transition">
              {item.value}
            </a>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-white font-bold text-lg mb-4">Response Times</h2>
        <div className="space-y-3">
          {[
            { type: 'General queries', time: 'Within 48 hours' },
            { type: 'Payment & refund requests', time: 'Within 24 hours' },
            { type: 'Technical issues', time: 'Within 24 hours' },
            { type: 'Privacy requests', time: 'Within 48 hours' },
          ].map(item => (
            <div key={item.type} className="flex justify-between items-center border-b border-slate-700 pb-3">
              <span className="text-slate-300 text-sm">{item.type}</span>
              <span className="text-green-400 text-sm font-semibold">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-blue-400 text-sm">
          <strong>Business Hours:</strong> Monday to Friday, 10:00 AM – 6:00 PM IST.
          We are closed on Indian public holidays.
        </p>
      </div>
    </div>
  );
}