'use client';

import { useState } from 'react';
import { CopyBlock } from '../components/CopyBlock';

type SetupTab = 'skills' | 'mcp';

const SKILLS_COMMAND = 'npx skills add mission69b/t2000-skills';

const MCP_CONFIG = `{
  "mcpServers": {
    "t2000": {
      "command": "t2000",
      "args": ["mcp"]
    }
  }
}`;

export function AgentContent() {
  const [setupTab, setSetupTab] = useState<SetupTab>('skills');

  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-2xl font-medium">Use in Your Agent</h1>
        <p className="text-sm text-muted max-w-xl leading-relaxed">
          MPP allows you to access hundreds of APIs with micropayments and no API keys
        </p>
      </header>

      {/* Option 1: t2000 Web App */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-medium">Web App</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border text-muted">
            Recommended
          </span>
        </div>
        <p className="text-sm text-muted">
          Gasless onboarding with USDC sponsorship — start using APIs immediately.
        </p>
        <a
          href="https://app.t2000.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm px-5 py-2.5 rounded-md border border-border text-text hover:border-accent/50 transition-colors"
        >
          Open t2000 Web App
        </a>
      </section>

      <hr className="border-border" />

      {/* Option 2: Terminal Install */}
      <section className="space-y-4">
        <h2 className="text-base font-medium">Terminal Install</h2>
        <p className="text-sm text-muted">
          Use the t2000 CLI to call any MPP-protected API with automatic payment
        </p>
        <CopyBlock title="Terminal" code="npx @t2000/cli init" />
      </section>

      <hr className="border-border" />

      {/* Option 3: Agent Setup */}
      <section className="space-y-4">
        <h2 className="text-base font-medium">Agent Setup</h2>
        <p className="text-sm text-muted">
          Connect t2000 to your AI agent via skills or MCP
        </p>
        <div>
          <div className="flex gap-1 mb-0">
            {([
              { id: 'skills' as const, label: 'Skills' },
              { id: 'mcp' as const, label: 'MCP' },
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSetupTab(tab.id)}
                className={`px-3 py-1.5 rounded-t text-xs font-mono transition-colors cursor-pointer ${
                  setupTab === tab.id
                    ? 'bg-surface border border-border border-b-surface text-text'
                    : 'text-muted hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {setupTab === 'skills' ? (
            <div className="space-y-3">
              <CopyBlock title="Terminal" code={SKILLS_COMMAND} />
              <p className="text-xs text-muted">
                For Claude Code, Codex, or Copilot — lets agents discover t2000 automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <CopyBlock title="claude_desktop_config.json" lang="JSON" code={MCP_CONFIG} />
              <p className="text-xs text-muted">
                For Claude Desktop, Cursor, or Windsurf — add to your MCP config.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Links */}
      <section className="border-t border-border pt-8 space-y-2">
        {[
          { href: '/servers', label: 'Browse MPP servers' },
          { href: '/docs', label: 'Developer guide' },
          { href: 'https://t2000.ai/docs', label: 't2000 documentation' },
          { href: 'https://www.npmjs.com/package/@t2000/cli', label: '@t2000/cli on npm' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith('/') ? undefined : '_blank'}
            rel={link.href.startsWith('/') ? undefined : 'noopener noreferrer'}
            className="flex items-center gap-2 text-xs text-muted hover:text-text transition-colors"
          >
            <span className="text-muted">→</span>
            {link.label}
          </a>
        ))}
      </section>
    </article>
  );
}
