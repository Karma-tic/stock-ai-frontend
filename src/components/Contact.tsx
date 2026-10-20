
import { Mail, CreditCard, Shield, Wrench } from "lucide-react";

export default function Contact() {
  return (
    
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-bold tracking-[-0.025em] text-ink sm:text-4xl mb-2">Contact Us</h1>
        <p className="text-muted text-sm mb-8">BytePlay Technologies — Stock AI</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
  {[
    { icon: Mail, title: "General Enquiries", value: "contact@karmatix.in" },
    { icon: CreditCard, title: "Payment & Billing", value: "contact@karmatix.in" },
    { icon: Shield, title: "Privacy Concerns", value: "hr@karmatix.in" },
    { icon: Wrench, title: "Technical Support", value: "sujeetsingh@karmatix.in" },
  ].map(({ icon: Icon, title, value }) => (
    <div
      key={title}
      className="rounded-card border border-line bg-surface p-4"
    >
      <Icon className="w-6 h-6 text-accent mb-2" />
      <p className="text-ink font-semibold">{title}</p>
      <a
        href={`mailto:${value}`}
        className="text-accent hover:text-accent text-sm transition"
      >
        {value}
      </a>
    </div>
  ))}
</div>

      <div className="rounded-card border border-line bg-surface p-6">
        <h2 className="text-ink font-bold text-lg mb-4">Response Times</h2>
        <div className="space-y-3">
          {[
            { type: 'General queries', time: 'Within 48 hours' },
            { type: 'Payment & refund requests', time: 'Within 24 hours' },
            { type: 'Technical issues', time: 'Within 24 hours' },
            { type: 'Privacy requests', time: 'Within 48 hours' },
          ].map(item => (
            <div key={item.type} className="flex justify-between items-center border-b border-line pb-3 last:border-0 last:pb-0">
              <span className="text-ink/85 text-sm">{item.type}</span>
              <span className="text-sm font-medium text-ink">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-card border border-line bg-surface p-4">
        <p className="text-ink/85 text-sm mb-2">
          <strong>Corporate Headquarters:</strong><br />
          Bhopal, Madhya Pradesh, India<br />
          (Operating fully remote across India)
        </p>
        <p className="text-ink/85 text-sm">
          <strong>Business Hours:</strong> Monday to Friday, 9:00 AM – 6:00 PM IST.
          We are closed on Indian public holidays.
        </p>
      </div>
    </div>
   
  );
}