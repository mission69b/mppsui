import { Method, Receipt } from 'mppx';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { suiCharge } from './method.js';
import { parseAmountToRaw, withRetry } from './utils.js';
import { InMemoryDigestStore } from './in-memory-digest-store.js';

export { suiCharge } from './method.js';
export { SUI_USDC_TYPE } from './constants.js';

export interface DigestStore {
  has(digest: string): Promise<boolean>;
  set(digest: string, ttlMs?: number): Promise<void>;
}

export interface PaymentReport {
  digest: string;
  sender?: string;
  recipient: string;
  amount: string;
  currency: string;
  network: string;
}

export interface SuiServerOptions {
  currency: string;
  recipient: string;
  /** Number of decimal places for the currency (default: 6, e.g. USDC). */
  decimals?: number;
  rpcUrl?: string;
  network?: 'mainnet' | 'testnet' | 'devnet';
  /** Digest store for replay protection. Required in production. Falls back to in-memory in dev. */
  store?: DigestStore;
  /** How long to remember used digests (default: 24h). Only applies to the default in-memory store. */
  digestTtlMs?: number;
  /**
   * Called after successful on-chain verification with payment data.
   * Use to report payments with full request context (e.g., endpoint, service).
   * When provided, replaces the built-in registryUrl reporting.
   */
  onPayment?: (report: PaymentReport) => void;
  /** @deprecated Use `onPayment` instead. URL to report verified payments to. */
  registryUrl?: string;
  /** @deprecated Use `onPayment` instead. Public URL of the server. */
  serverUrl?: string;
}

let _defaultStore: DigestStore | undefined;

function resolveStore(options: SuiServerOptions): DigestStore {
  if (options.store) return options.store;

  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
    throw new Error(
      '[suimpp] DigestStore is required in production. ' +
      'Provide a Redis or DB-backed store via SuiServerOptions.store. ' +
      'The default in-memory store is single-instance only and unsafe for multi-instance deployments.',
    );
  }

  if (!_defaultStore) {
    _defaultStore = new InMemoryDigestStore(options.digestTtlMs);
    console.warn(
      '[suimpp] No DigestStore provided. Using in-memory store. ' +
      'This is NOT safe for production or multi-instance deployments.',
    );
  }
  return _defaultStore;
}

export function sui(options: SuiServerOptions) {
  const network = options.network ?? 'mainnet';
  const decimals = options.decimals ?? 6;
  const client = new SuiGrpcClient({
    baseUrl: options.rpcUrl ?? `https://fullnode.${network}.sui.io:443`,
    network,
  });

  const normalizedRecipient = normalizeSuiAddress(options.recipient);
  const digestStore = resolveStore(options);

  return Method.toServer(suiCharge, {
    defaults: {
      currency: options.currency,
      recipient: options.recipient,
    },

    async verify({ credential }) {
      const digest = credential.payload.digest;

      const alreadyUsed = await digestStore.has(digest);
      if (alreadyUsed) {
        throw new Error(
          `Digest already used: ${digest}. Each transaction can only pay for one API call.`,
        );
      }

      const tx = await withRetry(
        () => client.core.getTransaction({ digest, include: { balanceChanges: true } }),
      ).catch(() => {
        throw new Error(`Could not find the referenced transaction [${digest}]`);
      });

      const resolved = tx.Transaction ?? tx.FailedTransaction;
      if (!resolved?.status.success) {
        throw new Error('Transaction failed on-chain');
      }

      const payment = resolved.balanceChanges.find(
        (bc) =>
          bc.coinType === options.currency &&
          normalizeSuiAddress(bc.address) === normalizedRecipient &&
          BigInt(bc.amount) > 0n,
      );

      if (!payment) {
        throw new Error(
          'Payment not found in transaction balance changes',
        );
      }

      const transferredRaw = BigInt(payment.amount);
      const requestedRaw = parseAmountToRaw(credential.challenge.request.amount, decimals);
      if (transferredRaw < requestedRaw) {
        throw new Error(
          `Transferred ${transferredRaw} < requested ${requestedRaw} (raw units)`,
        );
      }

      await digestStore.set(digest);

      const receipt = Receipt.from({
        method: 'sui',
        reference: credential.payload.digest,
        status: 'success',
        timestamp: new Date().toISOString(),
      });

      const report: PaymentReport = {
        digest,
        sender: resolved.balanceChanges.find(
          (bc) => bc.coinType === options.currency && BigInt(bc.amount) < 0n,
        )?.address,
        recipient: options.recipient,
        amount: credential.challenge.request.amount,
        currency: options.currency,
        network,
      };

      if (options.onPayment) {
        try { options.onPayment(report); } catch {}
      } else if (options.registryUrl) {
        fetch(options.registryUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ ...report, serverUrl: options.serverUrl }),
        }).catch(() => {});
      }

      return receipt;
    },
  });
}
