'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/docs', label: 'Docs' },
  { href: '/servers', label: 'Servers' },
  { href: '/explorer', label: 'Explorer' },
  { href: '/register', label: 'Register' },
  { href: '/agent', label: 'Agent' },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm font-medium text-accent">
          suimpp.dev
        </Link>
        <div className="hidden sm:flex items-center gap-6 text-sm text-muted">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-text transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/mission69b/suimpp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors"
          >
            GitHub
          </a>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-muted hover:text-text transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
      {open && (
        <div className="sm:hidden border-t border-border px-6 py-3 flex flex-col gap-3 text-sm text-muted">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:text-text transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/mission69b/suimpp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text transition-colors"
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}
