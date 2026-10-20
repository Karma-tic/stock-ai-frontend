
import { Mail, CreditCard, Shield, Wrench } from "lucide-react";

export default function Contact() {
  return (
    
      <div className="min-h-screen bg-lavender-surface p-8 max-w-3xl mx-auto">
        <h1 className="text-lavender-text text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-lavender-text/70 text-sm mb-8">BytePlay Technologies — Stock AI</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
  {[
    { icon: Mail, title: "General Enquiries", value: "contact@karmatix.in" },
    { icon: CreditCard, title: "Payment & Billing", value: "contact@karmatix.in" },
    { icon: Shield, title: "Privacy Concerns", value: "hr@karmatix.in" },
    { icon: Wrench, title: "Technical Support", value: "sujeetsingh@karmatix.in" },
  ].map(({ icon: Icon, title, value }) => (
    <div
      key={title}
      className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-4"
    >
      <Icon className="w-6 h-6 text-lavender-primary mb-2" />
      <p className="text-lavender-text font-semibold">{title}</p>
      <a
        href={`mailto:${value}`}
        className="text-lavender-primary hover:text-accent text-sm transition"
      >
        {value}
      </a>
    </div>
  ))}
</div>

      <div className="bg-surface border border-lavender-text/10 shadow-sm rounded-2xl p-6">
        <h2 className="text-lavender-text font-bold text-lg mb-4">Response Times</h2>
        <div className="space-y-3">
          {[
            { type: 'General queries', time: 'Within 48 hours' },
            { type: 'Payment & refund requests', time: 'Within 24 hours' },
            { type: 'Technical issues', time: 'Within 24 hours' },
            { type: 'Privacy requests', time: 'Within 48 hours' },
          ].map(item => (
            <div key={item.type} className="flex justify-between items-center border-b border-white/50 pb-3">
              <span className="text-lavender-text/80 text-sm">{item.type}</span>
              <span className="text-up text-sm font-semibold">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-accent/10 border border-white/50 rounded-2xl p-4">
        <p className="text-lavender-primary text-sm mb-2">
          <strong>Corporate Headquarters:</strong><br />
          Bhopal, Madhya Pradesh, India<br />
          (Operating fully remote across India)
        </p>
        <p className="text-lavender-primary text-sm">
          <strong>Business Hours:</strong> Monday to Friday, 9:00 AM – 6:00 PM IST.
          We are closed on Indian public holidays.
        </p>
      </div>
    </div>
   
  );
}