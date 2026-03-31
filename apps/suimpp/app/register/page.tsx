import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { RegisterForm } from './RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register — suimpp',
  description:
    'Register your MPP server on Sui. Validate your OpenAPI spec and start tracking payments automatically.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <RegisterForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
