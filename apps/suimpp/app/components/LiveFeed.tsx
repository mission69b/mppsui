'use client';

import { useEffect, useState } from 'react';

interface Payment {
  id: number;
  service: string;
  endpoint: string;
  amount: string;
  digest: string | null;
  createdAt: string;
  server: { name: string };
}

function timeAgo(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  );
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function endpointShorthand(endpoint: string) {
  const parts = endpoint.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? endpoint;
  return last.replace(/_/g, ' ');
}

function formatUSDC(amount: string) {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return `$${num < 0.01 ? num.toFixed(4) : num.toFixed(2)}`;
}

function suiscanUrl(digest: string) {
  return `https://suiscan.xyz/mainnet/tx/${digest}`;
}

export function LiveFeed() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch('/api/payments?limit=10');
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch {
        // silently fail — empty state handles it
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
    const interval = setInterval(fetchPayments, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium">Live</span>
          <span className="w-2 h-2 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-border/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="text-sm font-medium">Live</span>
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
      </div>

      {payments.length === 0 ? (
        <div className="p-6 text-center text-muted text-sm">
          No payments yet — be the first.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 px-4 py-2.5 text-xs hover:bg-border/20 transition-colors"
            >
              <span className="font-mono text-muted w-8 shrink-0 text-right">
                {timeAgo(p.createdAt)}
              </span>
              <span className="text-text w-24 truncate">{p.service}</span>
              <span className="font-mono text-muted flex-1 truncate">
                {endpointShorthand(p.endpoint)}
              </span>
              <span className="font-mono text-accent w-16 text-right shrink-0">
                {formatUSDC(p.amount)}
              </span>
              {p.digest && (
                <a
                  href={suiscanUrl(p.digest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition-colors shrink-0"
                  title="View on Suiscan"
                >
                  ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
