import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

async function importTypeScriptModule(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}

const transport = await importTypeScriptModule('../src/services/analyticsTransport.ts');
const cycleModule = await importTypeScriptModule('../src/services/readingAnalyticsCycle.ts');

const event = {
  id: 'evt_test',
  event: 'reading_started',
  language: 'ko',
  sessionId: 'session_test',
  timestamp: '2026-08-21T05:00:00.000Z',
  source: 'free_reading',
};

test('remote transport sends only the supplied minimal event', async () => {
  let body;
  const sent = await transport.sendRemoteAnalyticsEvent(event, {
    endpoint: 'https://example.test/api/analytics/events',
    fetchImpl: async (_url, options) => {
      body = JSON.parse(options.body);
      return { ok: true, status: 202 };
    },
  });

  assert.equal(sent, true);
  assert.deepEqual(body, event);
  assert.equal('storyText' in body, false);
});

test('remote analytics failure resolves without blocking the caller', async () => {
  const warnings = [];
  const sent = await transport.sendRemoteAnalyticsEvent(event, {
    endpoint: 'https://example.test/api/analytics/events',
    fetchImpl: async () => {
      throw new Error('offline');
    },
    warn: (message) => warnings.push(message),
  });

  assert.equal(sent, false);
  assert.equal(warnings.length, 1);
});

test('remote analytics request is aborted after the short timeout', async () => {
  const sent = await transport.sendRemoteAnalyticsEvent(event, {
    endpoint: 'https://example.test/api/analytics/events',
    timeoutMs: 5,
    fetchImpl: async (_url, options) =>
      new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('aborted')));
      }),
  });

  assert.equal(sent, false);
});

test('reading cycle records start and successful completion only once', () => {
  const events = [];
  const cycle = new cycleModule.ReadingAnalyticsCycle();

  cycle.start((name) => events.push(name));
  cycle.start((name) => events.push(name));
  assert.deepEqual(events, ['reading_started']);

  // A failed reading does not call complete, so no completion event exists.
  assert.deepEqual(events, ['reading_started']);

  cycle.complete((name) => events.push(name));
  cycle.complete((name) => events.push(name));
  assert.deepEqual(events, ['reading_started', 'free_reading_completed']);

  cycle.reset();
  cycle.start((name) => events.push(name));
  assert.deepEqual(events, [
    'reading_started',
    'free_reading_completed',
    'reading_started',
  ]);
});
