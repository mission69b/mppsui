import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'suimpp — Machine Payments on Sui';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0c',
          position: 'relative',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
          }}
        />

        {/* Protocol label */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#6366f1',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Open Protocol
        </div>

        {/* Brand */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 64,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-1px',
          }}
        >
          suimpp
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'serif',
            fontSize: 24,
            color: '#888888',
            marginTop: 16,
            fontStyle: 'italic',
          }}
        >
          Machine Payments on Sui
        </div>

        {/* Description */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#555555',
            marginTop: 24,
            letterSpacing: '0.03em',
            maxWidth: 500,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          AI agents pay for APIs with USDC. No keys. No accounts.
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontFamily: 'monospace',
            fontSize: 13,
            color: '#444444',
            letterSpacing: '0.06em',
          }}
        >
          suimpp.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
