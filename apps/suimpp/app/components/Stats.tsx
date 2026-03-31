import { db } from '@/lib/db';

export async function Stats() {
  const [paymentCount, serverCount, payments] = await Promise.all([
    db.payment.count(),
    db.server.count({ where: { verified: true } }),
    db.payment.findMany({ select: { amount: true } }),
  ]);

  const totalEndpoints = await db.server.aggregate({
    _sum: { endpoints: true },
  });

  const volume = payments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
  const formattedVolume = volume < 1000
    ? `$${volume.toFixed(2)}`
    : `$${(volume / 1000).toFixed(1)}K`;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-muted">
      <span>
        <span className="text-text">{serverCount}</span>{' '}
        {serverCount === 1 ? 'server' : 'servers'}
      </span>
      <span>
        <span className="text-text">{totalEndpoints._sum.endpoints ?? 0}</span>{' '}
        endpoints
      </span>
      <span>
        <span className="text-text">{paymentCount.toLocaleString()}</span>{' '}
        payments
      </span>
      <span>
        <span className="text-text">{formattedVolume}</span> volume
      </span>
      <span>
        <span className="text-text">~400ms</span> settle
      </span>
    </div>
  );
}
