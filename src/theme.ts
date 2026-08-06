import { createTheme, rem } from '@mantine/core';

// DeFake Project brand theme.
//
// Values are ported from the DeFake Project design system handoff
// (tokens/colors.css, tokens/typography.css, tokens/spacing.css, tokens/effects.css).
// Brand teal and the semantic status colors are the only literal color values in the
// app; everything else should reference `theme.colors.defakeTeal`, `primaryColor`,
// or the built-in `red`/`green`/`yellow`/`blue` shades that are overridden below.

// 10-shade ramps generated from the two brand-defined anchor colors (index 4 = secondary,
// index 6 = primary) so every Mantine component that reads `theme.colors.defakeTeal` gets a
// consistent tint/shade scale instead of an arbitrarily-generated one.
const defakeTeal = [
  '#F1FEFB',
  '#D7FCF5',
  '#AFF8EB',
  '#72F3DC',
  '#40EBCC', // secondary
  '#13DFBB',
  '#0FB194', // primary
  '#0C8F78',
  '#0A7360',
  '#075749',
] as const;

// Semantic colors are a distinct palette from the brand teal (see guidelines/colors-semantic)
// and are mapped onto Mantine's built-in `red`/`green`/`yellow`/`blue` so existing
// `color="red"` / `color="green"` usage across the app picks up the brand's exact values.
const danger = [
  '#FDF2F2',
  '#F9DADA',
  '#F3B4B4',
  '#EA7B7B',
  '#E24949',
  '#D12222',
  '#DC2626', // --color-danger
  '#B61D1D',
  '#931818',
  '#6F1212',
] as const;

const success = [
  '#F2FDF6',
  '#D9FAE5',
  '#B3F5CB',
  '#78EDA3',
  '#45E680',
  '#1DD561',
  '#16A34A', // --color-success
  '#12863D',
  '#0F6C31',
  '#0B5125',
] as const;

const warning = [
  '#FEFBF0',
  '#FEF4D5',
  '#FCE8AB',
  '#FAD76B',
  '#F8C832',
  '#EFBC0C',
  '#EAB308', // --color-warning
  '#C09307',
  '#9A7605',
  '#755A04',
] as const;

const info = [
  '#F1FAFE',
  '#D6F1FD',
  '#ADE2FA',
  '#6FCCF6',
  '#37B9F3',
  '#0EA2E5',
  '#0EA5E9', // --color-info
  '#0B87BF',
  '#096D9A',
  '#075274',
] as const;

export const theme = createTheme({
  primaryColor: 'defakeTeal',
  primaryShade: 6,
  colors: {
    defakeTeal,
    red: danger,
    green: success,
    yellow: warning,
    blue: info,
  },

  fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  fontFamilyMonospace: '"JetBrains Mono", ui-monospace, "SF Mono", Consolas, "Liberation Mono", monospace',

  headings: {
    fontFamily: '"Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: rem(36), lineHeight: '1.2' },
      h2: { fontSize: rem(30), lineHeight: '1.25' },
      h3: { fontSize: rem(24), lineHeight: '1.3' },
      h4: { fontSize: rem(20), lineHeight: '1.35' },
      h5: { fontSize: rem(18), lineHeight: '1.4' },
      h6: { fontSize: rem(16), lineHeight: '1.5' },
    },
  },

  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
  },
  lineHeights: {
    xs: '1.35',
    sm: '1.45',
    md: '1.5',
    lg: '1.55',
    xl: '1.4',
  },

  // shadcn "new-york" radius scale used across both DeFake frontends (--radius base 0.5rem).
  defaultRadius: 'md',
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(6),
    lg: rem(8),
    xl: rem(12),
  },

  // Tailwind's default shadow scale, used verbatim in both DeFake frontends.
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
  },
});
