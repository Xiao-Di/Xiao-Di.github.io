# Profile Institutions and Language Toggle Design

## Goal

Improve the bilingual profile sidebar and navigation without changing the site's content architecture or visual identity.

## Scope

1. Render every institution on its own line in both English and Chinese.
2. Replace the current language dropdown with the segmented language switch used by the reference site at `https://ntdxyg.github.io/en/`.
3. Preserve the existing locale store, persistence behavior, dark theme, responsive navigation, and page routes.

## Institution Data and Rendering

The `author.institution` configuration field will use `string[]` consistently for every locale. The English and Chinese `config.toml` files will each contain one institution per array element.

The profile component will render the array as a compact vertical list. Each item will be a separate block-level line inside the existing centered institution area. This guarantees line separation independently of text length and avoids relying on embedded newline characters or automatic wrapping.

The English institution order will remain the order currently defined in the English configuration. The Chinese institution order will remain the order shown in the supplied screenshot:

1. 上海卫星互联网研究院有限公司
2. 卫星互联网全国重点实验室
3. 中国星网雄安智能技术研究中心
4. 北京邮电大学

## Language Switch

The existing icon-and-dropdown control will be replaced with a two-segment control modeled on the reference site:

- English segment label: `EN`
- Chinese segment label: `中文`
- Active segment: accent-colored background with white text
- Inactive segment: neutral text on a subtle neutral background, with a hover state
- Shared rounded border around the two segments
- A divider between the segments
- Visible keyboard focus styling
- Each inactive segment behaves as a button and switches directly to that locale
- The active segment is marked with `aria-current` and does not trigger a redundant locale update

The control will continue to respect `i18n.enabled`, `i18n.switcher`, configured locales, the default locale, and stored locale preferences. If only one locale is available, it will remain hidden.

## Navigation Integration

On desktop, the language switch and theme control will form a utility group separated from the navigation links by a subtle left border and additional left padding, matching the reference layout.

On mobile, the language switch will appear before the theme and menu controls without the desktop separator. Its compact segmented shape will fit the existing navigation height.

## Compatibility and Edge Cases

- Light and dark themes will use the existing design tokens.
- The mounted-state placeholder will match the new switch footprint closely to avoid layout movement during hydration.
- Locale codes not present in the configured labels will still use the configured locale code as a fallback.
- The profile component will receive institutions as an array through the shared `SiteConfig` type, preventing locale-specific rendering differences.

## Verification

Automated checks will cover institution normalization/rendering and language-switch state where the existing test setup permits it. The implementation will also be verified by:

1. Running the production build.
2. Opening the site at the requested local address.
3. Confirming four distinct Chinese institution lines and the configured English institution lines.
4. Switching from English to Chinese and back.
5. Refreshing to confirm locale persistence.
6. Checking desktop and mobile navigation in light and dark themes.

## Non-goals

- Changing institution names, profile content, navigation destinations, theme behavior, or locale persistence.
- Reworking the rest of the header or profile layout.
- Introducing route-based locale prefixes.
