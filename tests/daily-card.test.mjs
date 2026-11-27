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

const daily = await importTypeScriptModule('../src/services/dailyCard.ts');
const CARDS = ['fool', 'star', 'moon'];

function memoryStorage(initial) {
  const map = new Map(initial ? Object.entries(initial) : []);
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
  };
}

test('local date key uses the local calendar day', () => {
  assert.equal(daily.localDateKey(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(daily.localDateKey(new Date(2026, 10, 27, 0, 1)), '2026-11-27');
});

test('first draw picks a card and counts one reflection', () => {
  const state = daily.drawDailyCard(daily.EMPTY_DAILY_CARD_STATE, '2026-11-27', CARDS, () => 0.5);
  assert.deepEqual(state, { lastDrawDate: '2026-11-27', cardId: 'star', reflectionCount: 1 });
});

test('drawing again on the same day keeps the same card and count', () => {
  const first = daily.drawDailyCard(daily.EMPTY_DAILY_CARD_STATE, '2026-11-27', CARDS, () => 0);
  const again = daily.drawDailyCard(first, '2026-11-27', CARDS, () => 0.99);
  assert.equal(again, first);
});

test('a skipped day never resets the reflection count', () => {
  const day1 = daily.drawDailyCard(daily.EMPTY_DAILY_CARD_STATE, '2026-11-01', CARDS, () => 0);
  const day5 = daily.drawDailyCard(day1, '2026-11-05', CARDS, () => 0.99);
  assert.equal(day5.reflectionCount, 2);
  assert.equal(day5.cardId, 'moon');
});

test('random value of 1 still maps to a valid card', () => {
  const state = daily.drawDailyCard(daily.EMPTY_DAILY_CARD_STATE, '2026-11-27', CARDS, () => 1);
  assert.equal(state.cardId, 'moon');
});

test('state round-trips through storage and bad data falls back safely', () => {
  const storage = memoryStorage();
  const state = { lastDrawDate: '2026-11-27', cardId: 'sun', reflectionCount: 4 };
  daily.saveDailyCardState(storage, state);
  assert.deepEqual(daily.loadDailyCardState(storage), state);

  const corrupt = memoryStorage({ [daily.DAILY_CARD_STORAGE_KEY]: '{not json' });
  assert.deepEqual(daily.loadDailyCardState(corrupt), daily.EMPTY_DAILY_CARD_STATE);

  const wrongShape = memoryStorage({ [daily.DAILY_CARD_STORAGE_KEY]: '{"reflectionCount":"9"}' });
  assert.deepEqual(daily.loadDailyCardState(wrongShape), daily.EMPTY_DAILY_CARD_STATE);

  const throwing = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
  assert.deepEqual(daily.loadDailyCardState(throwing), daily.EMPTY_DAILY_CARD_STATE);
  assert.doesNotThrow(() => daily.saveDailyCardState(throwing, state));
});
