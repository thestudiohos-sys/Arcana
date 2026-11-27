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

const { CARD_LIBRARY } = await importTypeScriptModule('../src/content/cardLibrary.ts');
const appCards = await readFile(new URL('../src/config/tarotCards.ts', import.meta.url), 'utf8');

test('library covers all 22 Major Arcana with unique slugs', () => {
  assert.equal(CARD_LIBRARY.length, 22);
  const slugs = CARD_LIBRARY.map((c) => c.slug);
  assert.equal(new Set(slugs).size, 22);
  for (const slug of slugs) assert.match(slug, /^[a-z]+(-[a-z]+)*$/);
});

test('KO and EN have the same complete structure for every card', () => {
  for (const card of CARD_LIBRARY) {
    for (const lang of ['en', 'ko']) {
      const t = card[lang];
      for (const field of ['name', 'summary', 'meaning', 'practice']) {
        assert.ok(t[field]?.trim(), `${card.slug}.${lang}.${field} is empty`);
      }
      assert.equal(t.keywords.length, 3, `${card.slug}.${lang} keywords`);
      assert.equal(t.questions.length, 2, `${card.slug}.${lang} questions`);
    }
  }
});

test('every in-app deck card links to a library page', () => {
  const appIds = [...appCards.matchAll(/id: '([a-z_]+)'/g)].map((m) => m[1]);
  const linked = new Set(CARD_LIBRARY.map((c) => c.appId).filter(Boolean));
  for (const id of new Set(appIds)) assert.ok(linked.has(id), `app card "${id}" has no library entry`);
});

test('copy avoids predictive or fear-based wording', () => {
  const banned = [/\byou will\b/i, /\b(is|are) guaranteed\b|\bguarantees? (you|your|that)\b/i, /\bwin the lottery\b/i, /반드시 (이루|일어)/, /액운/, /당첨/];
  for (const card of CARD_LIBRARY) {
    const text = JSON.stringify([card.en, card.ko]);
    for (const pattern of banned) assert.doesNotMatch(text, pattern, `${card.slug} matches ${pattern}`);
  }
});
