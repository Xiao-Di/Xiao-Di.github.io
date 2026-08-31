import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('config normalizes scalar and array institutions to a string array', async () => {
  const config = await read('src/lib/config.ts');
  assert.match(config, /institution: string\[\]/);
  assert.match(config, /function normalizeInstitutions\(value: unknown\): string\[\]/);
  assert.match(config, /Array\.isArray\(value\)/);
  assert.match(config, /split\('\\n'\)/);
});

test('profile renders one block element for each institution', async () => {
  const profile = await read('src/components/home/Profile.tsx');
  assert.match(profile, /author\.institution\.map/);
  assert.match(profile, /key=\{institution\}/);
});

test('metadata expands institutions into individual keywords', async () => {
  const layout = await read('src/app/layout.tsx');
  assert.match(layout, /\.\.\.config\.author\.institution/);
});

test('language switch is segmented and has no dropdown state', async () => {
  const toggle = await read('src/components/ui/LanguageToggle.tsx');
  assert.doesNotMatch(toggle, /isOpen|ChevronDownIcon|LanguageIcon/);
  assert.match(toggle, /localeOptions/);
  assert.match(toggle, /locale === 'en'/);
  assert.match(toggle, /aria-current=\{isActive \? 'true' : undefined\}/);
  assert.match(toggle, /localeOption === 'en' \? 'EN'/);
  assert.match(toggle, /setLocale\(localeOption\)/);
});

test('desktop utilities have a separator and mobile utilities stay compact', async () => {
  const navigation = await read('src/components/layout/Navigation.tsx');
  assert.match(navigation, /border-l border-neutral-200\/80 pl-6/);
  assert.match(navigation, /lg:hidden flex items-center space-x-2/);
});
