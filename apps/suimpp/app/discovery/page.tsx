import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { DiscoveryContent } from './DiscoveryContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discovery Spec — suimpp',
  description:
    'How to make your MPP server discoverable. OpenAPI format, x-payment-info, 402 responses, and validation.',
};

export default function DiscoveryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <DiscoveryContent />
        </div>
      </main>

      <Footer />
    </div>
  );
}
