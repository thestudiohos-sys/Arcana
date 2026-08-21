import type { ProductFunnelEventName } from '../types/purchaseIntent';

type TrackReadingEvent = (event: ProductFunnelEventName) => void;

export class ReadingAnalyticsCycle {
  private started = false;
  private completed = false;

  start(track: TrackReadingEvent): void {
    if (this.started) return;
    this.started = true;
    this.completed = false;
    track('reading_started');
  }

  complete(track: TrackReadingEvent): void {
    if (!this.started || this.completed) return;
    this.completed = true;
    track('free_reading_completed');
  }

  reset(): void {
    this.started = false;
    this.completed = false;
  }
}
