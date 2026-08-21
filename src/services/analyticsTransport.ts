import type { AnalyticsEvent } from '../types/purchaseIntent';

export interface RemoteAnalyticsOptions {
  endpoint: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  warn?: (message: string) => void;
}

const DEFAULT_TIMEOUT_MS = 1800;

export async function sendRemoteAnalyticsEvent(
  event: AnalyticsEvent,
  options: RemoteAnalyticsOptions,
): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const fetchImpl = options.fetchImpl ?? fetch;
    const response = await fetchImpl(options.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Analytics request failed with status ${response.status}`);
    }

    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown analytics error';
    options.warn?.(`Remote tracking skipped: ${message}`);
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}
