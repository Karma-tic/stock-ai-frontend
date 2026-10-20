import { Rocket } from 'lucide-react';
import UpcomingIpos from './UpcomingIpos';
import SEO from './SEO';
import PageHeader from './ui/PageHeader';

export default function IPOsPage() {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SEO
        title="Upcoming IPOs India | GMP, Price Band and AI IPO View | Stock AI"
        description="Track upcoming Indian IPOs with GMP, price band, open and close dates, estimated listing price, and educational IPO analysis."
        canonicalPath="/ipos"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PageHeader
          eyebrow="IPOs"
          icon={Rocket}
          title="Upcoming and open IPOs"
          intro="Grey-market premium, issue details, key dates and subscription for current Indian IPOs. Facts with their source, not a listing prediction."
        />
        <section className="rounded-card border border-line bg-surface p-4 sm:p-5">
          <UpcomingIpos />
        </section>
      </div>
    </div>
  );
}
