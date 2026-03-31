'use client';

import Link from 'next/link';
import { CopyBlock } from '../components/CopyBlock';

const SDK_INSTALL = `npm install @suimpp/mpp mppx`;

const SDK_USAGE = `import { Mppx } from 'mppx/client';
import { sui } from '@suimpp/mpp/client';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
const signer = Ed25519Keypair.fromSecretKey(PRIVATE_KEY);

const mpp = Mppx.create({
  methods: [sui({ client, signer })],
});

// Any MPP-protected endpoint — no API key needed
const response = await mpp.fetch(
  'https://mpp.t2000.ai/openai/v1/chat/completions',
  {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4.1-nano',
      messages: [{ role: 'user', content: 'Hello' }],
    }),
  }
);

const data = await response.json();`;

const DISCOVER_COMMAND = `npx @suimpp/discovery check mpp.t2000.ai`;

const WALLET_SETUP = `import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Generate a new keypair
const keypair = Ed25519Keypair.generate();
console.log('Address:', keypair.toSuiAddress());
console.log('Private key:', keypair.getSecretKey());

// Or import from existing key
const signer = Ed25519Keypair.fromSecretKey(process.env.SUI_PRIVATE_KEY!);`;

const FETCH_EXAMPLE = `// The SDK handles the full 402 flow automatically:
// 1. Sends request → gets 402 challenge
// 2. Parses amount, currency, recipient from WWW-Authenticate
// 3. Builds & executes Sui USDC transfer
// 4. Retries request with payment credential
// 5. Returns the API response

const res = await mpp.fetch('https://mpp.t2000.ai/anthropic/v1/messages', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Explain MPP in one sentence.' }],
  }),
});`;

export function AgentContent() {
  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-2xl font-medium">Use APIs with MPP</h1>
        <p className="text-sm text-muted max-w-xl leading-relaxed">
          Access any MPP-protected API with USDC micropayments on Sui.
          No API keys. No subscriptions. Just pay per request.
        </p>
      </header>

      {/* How it works */}
      <section className="grid sm:grid-cols-3 gap-4">
        {[
          {
            num: '1',
            title: 'Install',
            desc: 'Add the SDK and Sui payment method to your project.',
          },
          {
            num: '2',
            title: 'Fund',
            desc: 'Send USDC to your agent\'s Sui address.',
          },
          {
            num: '3',
            title: 'Call',
            desc: 'Use mpp.fetch() — payments happen automatically.',
          },
        ].map((step) => (
          <div key={step.num} className="rounded-lg border border-border bg-surface p-4 space-y-2">
            <span className="inline-flex w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-mono items-center justify-center">
              {step.num}
            </span>
            <div className="text-sm font-medium text-text">{step.title}</div>
            <div className="text-xs text-muted leading-relaxed">{step.desc}</div>
          </div>
        ))}
      </section>

      <Section id="install" title="Install">
        <CopyBlock title="Terminal" code={SDK_INSTALL} />
        <div className="mt-3 space-y-1">
          <Pkg name="mppx" desc="MPP protocol SDK — handles 402 negotiation" />
          <Pkg name="@suimpp/mpp" desc="Sui USDC payment method (client + server)" />
        </div>
      </Section>

      <Section id="wallet" title="Set Up a Wallet">
        <p>
          Your agent needs a Sui wallet with USDC. You can use any Ed25519 keypair:
        </p>
        <div className="mt-3">
          <CopyBlock title="wallet.ts" lang="TypeScript" code={WALLET_SETUP} />
        </div>
        <div className="mt-4 rounded-lg border border-border bg-surface p-4 space-y-1">
          <div className="text-xs font-medium text-text">Fund your wallet</div>
          <div className="text-xs text-muted leading-relaxed">
            Send USDC to your agent&apos;s address on Sui mainnet. You&apos;ll also need a small
            amount of SUI for gas. Typical API calls cost $0.005–$0.05 in USDC.
          </div>
        </div>
      </Section>

      <Section id="usage" title="Make API Calls">
        <p>
          Use <code>mpp.fetch()</code> like a drop-in replacement for <code>fetch()</code>.
          The SDK handles the entire 402 payment flow automatically:
        </p>
        <div className="mt-3">
          <CopyBlock title="agent.ts" lang="TypeScript" code={SDK_USAGE} />
        </div>
      </Section>

      <Section id="how" title="What Happens Under the Hood">
        <p>
          When you call <code>mpp.fetch()</code>, the SDK negotiates payment automatically:
        </p>
        <div className="mt-3">
          <CopyBlock title="Automatic flow" code={FETCH_EXAMPLE} />
        </div>
        <p className="mt-4">
          Each payment is a real Sui USDC transfer — settled in ~400ms. The transaction
          digest is included in the <code>Payment-Receipt</code> response header so you can
          verify it on-chain.
        </p>
      </Section>

      <Section id="discover" title="Discover Servers">
        <p>
          Find MPP servers to call. Browse the server catalog or validate a specific endpoint:
        </p>
        <div className="mt-3">
          <CopyBlock title="Terminal" code={DISCOVER_COMMAND} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/servers"
            className="text-xs px-4 py-2 rounded-md border border-border text-muted hover:text-text hover:border-accent/50 transition-colors"
          >
            Browse servers →
          </Link>
          <Link
            href="/explorer"
            className="text-xs px-4 py-2 rounded-md border border-border text-muted hover:text-text hover:border-accent/50 transition-colors"
          >
            Payment explorer →
          </Link>
        </div>
      </Section>

      <Section id="frameworks" title="Agent Frameworks">
        <p>
          The SDK works in any Node.js or Edge runtime. Use it directly or integrate
          with your agent framework:
        </p>
        <div className="mt-4 space-y-3">
          {[
            {
              title: 'Direct usage',
              desc: 'Call mpp.fetch() from any async context — scripts, serverless functions, background workers.',
            },
            {
              title: 'Claude Code / Codex',
              desc: 'Use the SDK in tool implementations. When the agent calls an API tool, route through mpp.fetch().',
            },
            {
              title: 'Custom agents',
              desc: 'Wrap mpp.fetch() as an HTTP tool. The 402 flow is transparent to the agent\'s reasoning layer.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-surface p-4 space-y-1">
              <div className="text-xs font-medium text-text">{item.title}</div>
              <div className="text-xs text-muted leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Links */}
      <section className="border-t border-border pt-8 space-y-2">
        {[
          { href: '/servers', label: 'Browse MPP servers' },
          { href: '/spec', label: 'Sui Charge Method Spec' },
          { href: '/docs', label: 'Developer guide' },
          { href: 'https://www.npmjs.com/package/@suimpp/mpp', label: '@suimpp/mpp on npm' },
          { href: 'https://github.com/mission69b/suimpp', label: 'GitHub' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith('/') ? undefined : '_blank'}
            rel={link.href.startsWith('/') ? undefined : 'noopener noreferrer'}
            className="flex items-center gap-2 text-xs text-muted hover:text-text transition-colors"
          >
            <span className="text-accent">→</span>
            {link.label}
          </a>
        ))}
      </section>
    </article>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="text-sm text-muted leading-relaxed [&_code]:text-text [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-border [&_code]:text-xs [&_code]:font-mono">
        {children}
      </div>
    </section>
  );
}

function Pkg({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="font-mono text-accent">{name}</span>
      <span className="text-muted/50">—</span>
      <span className="text-muted">{desc}</span>
    </div>
  );
}
