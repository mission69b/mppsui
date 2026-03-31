import Link from 'next/link';

const NAV_LINKS = [
  { href: '/spec', label: 'Spec' },
  { href: '/discovery', label: 'Discovery' },
  { href: '/docs', label: 'Docs' },
  { href: '/servers', label: 'Servers' },
  { href: '/explorer', label: 'Explorer' },
] as const;

export function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
      <Link href="/" className="font-mono text-sm font-medium text-accent">
        suimpp.dev
      </Link>
      <div className="flex items-center gap-6 text-sm text-muted">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-text transition-colors hidden sm:block"
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
    </nav>
  );
}
