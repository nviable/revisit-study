import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { CASES, STOPSCAN_OVERVIEW } from './content';

const iframePages = ['consent.html', 'debrief.html'] as const;

describe('STOP&SCAN participant copy', () => {
  it('uses neutral case titles that do not reveal outcomes', () => {
    expect(CASES.map(({ title }) => title)).toEqual([
      'An urgent phone call',
      'A wind forecast map',
      'A photograph of a campaign crowd',
      'A photograph shared by a senator’s office',
    ]);
  });

  it('defines the three terminal outcomes and parallel reporting judgment', () => {
    expect(STOPSCAN_OVERVIEW.outcomes.map(({ title }) => title)).toEqual([
      'Trust',
      'Decline to act or share',
      'Withhold judgment',
    ]);
    expect(STOPSCAN_OVERVIEW.reporting).toContain('separate judgment');
  });

  it('assigns each case outcome only in its Now Reflect step', () => {
    const outcomes = CASES.map(({ steps }) => steps.find(({ key }) => key === 'reflect')?.evaluation);

    expect(outcomes[0]).toContain('outcome is Withhold judgment');
    expect(outcomes[1]).toContain('outcome is Decline to act or share');
    expect(outcomes[2]).toContain('outcome is Trust');
    expect(outcomes[3]).toContain('outcome is Withhold judgment');
  });

  it('uses the app fonts on iframe HTML pages', () => {
    iframePages.forEach((name) => {
      const html = readFileSync(new URL(`../../../../public/stopscan-expert-panel/assets/${name}`, import.meta.url), 'utf8');

      expect(html).toContain('family=Inter');
      expect(html).toContain('family=Space+Grotesk');
      expect(html).toContain('"Inter"');
      expect(html).toContain('"Space Grotesk"');
      expect(html).not.toMatch(/Iowan Old Style|Palatino|Georgia, serif/);
    });
  });
});
