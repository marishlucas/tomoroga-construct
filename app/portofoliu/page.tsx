import type { Metadata } from 'next';
import Portfolio from '@/components/portfolio';
export const metadata: Metadata = { title: 'Portofoliu — Tomoroga Construct' };
export default function PortfolioPage() {
  return (
    <>
      <a className="skip-link" href="#continut">
        Sari la conținut
      </a>
      <main id="continut">
        <Portfolio />
      </main>
    </>
  );
}
