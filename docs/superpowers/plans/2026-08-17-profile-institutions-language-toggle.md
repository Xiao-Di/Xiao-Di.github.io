# Profile Institutions and Language Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render bilingual institutions one per line and replace the language dropdown with the reference site's compact segmented switch.

**Architecture:** Normalize `author.institution` as `string[]` at the configuration boundary, then render the array explicitly in `Profile`. Keep locale state and persistence untouched while simplifying `LanguageToggle` to two direct-action segments. Use a dependency-free Node contract test for configuration and source-level UI invariants, followed by a production build and browser verification.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Zustand, Node.js built-in test runner, TOML content.

---

## File Structure

- `src/lib/config.ts`: defines the shared `SiteConfig` contract and normalizes legacy scalar institutions to arrays.
- `content/config.toml`: provides one English institution per array element.
- `content_zh/config.toml`: provides one Chinese institution per array element.
- `src/components/home/Profile.tsx`: renders each institution as an individual line.
- `src/components/ui/LanguageToggle.tsx`: renders the segmented direct-switch control.
- `src/components/layout/Navigation.tsx`: groups language/theme utilities behind the desktop divider.
- `tests/profile-language-ui.test.mjs`: verifies bilingual configuration and source-level rendering/switch contracts without adding dependencies.

### Task 1: Institution Data Contract and Rendering

**Files:**
- Create: `tests/profile-language-ui.test.mjs`
- Modify: `src/lib/config.ts`
- Modify: `content/config.toml`
- Modify: `content_zh/config.toml`
- Modify: `src/components/home/Profile.tsx`

- [ ] **Step 1: Write the failing institution contract tests**

Create `tests/profile-language-ui.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from 'smol-toml';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('both locales configure institutions as non-empty arrays', async () => {
  for (const path of ['content/config.toml', 'content_zh/config.toml']) {
    const config = parse(await read(path));
    assert.ok(Array.isArray(config.author.institution), `${path} institution must be an array`);
    assert.ok(config.author.institution.length > 0, `${path} institution must not be empty`);
    assert.ok(config.author.institution.every((item) => typeof item === 'string' && item.trim()));
  }
});

test('profile renders one block element for each institution', async () => {
  const profile = await read('src/components/home/Profile.tsx');
  assert.match(profile, /author\.institution\.map/);
  assert.match(profile, /key=\{institution\}/);
});
```

- [ ] **Step 2: Run the tests and verify the expected failure**

Run: `node --test tests/profile-language-ui.test.mjs`

Expected: FAIL because the Chinese institution is a multiline scalar and `Profile` does not map institution entries.

- [ ] **Step 3: Normalize the configuration type**

In `src/lib/config.ts`, change the author contract to:

```ts
author: {
  name: string;
  title: string;
  institution: string[];
  avatar: string;
};
```

Add a normalization helper next to `readConfigFromPath`:

```ts
function normalizeInstitutions(value: unknown): string[] {
  const institutions = Array.isArray(value) ? value : String(value || '').split('\n');
  return institutions.map((item) => String(item).trim()).filter(Boolean);
}

function normalizeConfig(config: SiteConfig): SiteConfig {
  return {
    ...config,
    author: {
      ...config.author,
      institution: normalizeInstitutions(config.author.institution),
    },
  };
}
```

Return `normalizeConfig(parsed as SiteConfig)` from `getDefaultConfig`. In `mergeConfig`, assign the merged object to `const merged`, then return `normalizeConfig(merged)` so both default and localized values use the same boundary contract.

- [ ] **Step 4: Convert Chinese institutions to array data**

Replace `content_zh/config.toml`'s multiline value with:

```toml
institution = [
  "上海卫星互联网研究院有限公司",
  "卫星互联网全国重点实验室",
  "中国星网雄安智能技术研究中心",
  "北京邮电大学"
]
```

Keep `content/config.toml` as an array and remove trailing punctuation that exists only to join inline prose:

```toml
institution = [
  "State Key Laboratory of Satellite Network",
  "Shanghai Satellite Network Research Institute Company Ltd.",
  "Beijing University of Posts and Telecommunications"
]
```

- [ ] **Step 5: Render one line per institution**

Replace the institution paragraph in `Profile.tsx` with:

```tsx
<div className="text-neutral-600 mb-2 space-y-0.5">
  {author.institution.map((institution) => (
    <p key={institution}>{institution}</p>
  ))}
</div>
```

- [ ] **Step 6: Run the institution tests**

Run: `node --test tests/profile-language-ui.test.mjs`

Expected: PASS for both institution tests.

### Task 2: Segmented Language Switch and Navigation Group

**Files:**
- Modify: `tests/profile-language-ui.test.mjs`
- Modify: `src/components/ui/LanguageToggle.tsx`
- Modify: `src/components/layout/Navigation.tsx`

- [ ] **Step 1: Add failing language-switch contract tests**

Append to `tests/profile-language-ui.test.mjs`:

```js
test('language switch is segmented and has no dropdown state', async () => {
  const toggle = await read('src/components/ui/LanguageToggle.tsx');
  assert.doesNotMatch(toggle, /isOpen|ChevronDownIcon|LanguageIcon/);
  assert.match(toggle, /aria-current=\{isActive \? 'true' : undefined\}/);
  assert.match(toggle, /localeOption === 'en' \? 'EN'/);
  assert.match(toggle, /setLocale\(localeOption\)/);
});

test('desktop utilities have a separator and mobile utilities stay compact', async () => {
  const navigation = await read('src/components/layout/Navigation.tsx');
  assert.match(navigation, /border-l border-neutral-200\/80 pl-6/);
  assert.match(navigation, /lg:hidden flex items-center space-x-2/);
});
```

- [ ] **Step 2: Run the tests and verify the expected failure**

Run: `node --test tests/profile-language-ui.test.mjs`

Expected: FAIL because the current control uses dropdown state and icons, and desktop utilities have no separator.

- [ ] **Step 3: Replace the dropdown with segmented buttons**

Replace `LanguageToggle.tsx` with a client component that keeps the mounted guard and renders:

```tsx
<div
  className={cn(
    'flex overflow-hidden rounded-md border border-neutral-200/80',
    'bg-neutral-50/80 text-xs font-semibold',
    'dark:border-neutral-600 dark:bg-neutral-800/60'
  )}
  role="group"
  aria-label="Language"
>
  {i18n.locales.map((localeOption, index) => {
    const isActive = currentLocale === localeOption;
    const label = localeOption === 'en'
      ? 'EN'
      : i18n.labels[localeOption] || localeOption.toUpperCase();

    return (
      <button
        key={localeOption}
        type="button"
        aria-current={isActive ? 'true' : undefined}
        title={i18n.labels[localeOption] || localeOption}
        disabled={isActive}
        onClick={() => setLocale(localeOption)}
        className={cn(
          'px-2 py-1 transition-colors focus:outline-none focus-visible:ring-2',
          'focus-visible:ring-inset focus-visible:ring-accent',
          index > 0 && 'border-l border-neutral-200/80 dark:border-neutral-600',
          isActive
            ? 'bg-accent text-white'
            : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
        )}
      >
        {label}
      </button>
    );
  })}
</div>
```

Use a mounted placeholder with `w-[76px] h-[26px]` and matching border/radius classes.

- [ ] **Step 4: Add the desktop utility separator**

In the desktop section of `Navigation.tsx`, wrap the two controls:

```tsx
<div className="flex items-center gap-2 border-l border-neutral-200/80 pl-6 dark:border-neutral-700/80">
  <LanguageToggle i18n={i18n} />
  <ThemeToggle />
</div>
```

Keep the mobile `LanguageToggle`, `ThemeToggle`, and menu button directly inside the existing `lg:hidden flex items-center space-x-2` container.

- [ ] **Step 5: Run the complete contract tests**

Run: `node --test tests/profile-language-ui.test.mjs`

Expected: all four tests PASS.

### Task 3: Production and Visual Verification

**Files:**
- Modify only if verification exposes a defect in the files above.

- [ ] **Step 1: Run formatting and type/build verification**

Run: `npm run build`

Expected: Next.js production build exits successfully with no TypeScript errors.

- [ ] **Step 2: Start the requested local server**

Run: `npm run dev -- --hostname 0.0.0.0 --port 3000`

Expected: Next.js reports the site is available locally and on the network at port 3000.

- [ ] **Step 3: Verify English desktop behavior**

Open `http://172.20.10.3:3000/` at a desktop viewport. Confirm:

- each English institution occupies one line;
- `EN` has the accent background;
- `中文` is inactive;
- the utility group has a left divider;
- no dropdown opens.

- [ ] **Step 4: Verify Chinese and persistence behavior**

Select `中文`, confirm the four supplied institutions appear on four lines, refresh, and confirm Chinese remains active. Select `EN` and confirm English content returns.

- [ ] **Step 5: Verify mobile and dark themes**

At a mobile viewport, confirm the switch fits beside theme/menu controls and has no desktop divider. In dark mode, confirm border, active, hover, and text contrast remain readable.

- [ ] **Step 6: Review the final diff**

Run: `git diff --check` and `git diff -- src/lib/config.ts content/config.toml content_zh/config.toml src/components/home/Profile.tsx src/components/ui/LanguageToggle.tsx src/components/layout/Navigation.tsx tests/profile-language-ui.test.mjs`

Expected: no whitespace errors and only the scoped implementation changes are present.
