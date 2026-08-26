import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { CASES_IN_ORDER, STOPSCAN_OVERVIEW } from './content';

const iframePages = ['consent.html', 'debrief.html'] as const;

describe('STOP&SCAN participant copy', () => {
  it('presents cases in the participant order with stable ids', () => {
    expect(CASES_IN_ORDER.map(({ id, title, shortLabel }) => ({ id, title, shortLabel }))).toEqual([
      { id: 'case2', title: 'A wind forecast map', shortLabel: 'Case 1' },
      { id: 'case3', title: 'A photograph of a campaign crowd', shortLabel: 'Case 2' },
      { id: 'case4', title: 'A photograph shared by a senator’s office', shortLabel: 'Case 3' },
      { id: 'case1', title: 'An urgent phone call', shortLabel: 'Case 4' },
    ]);
  });

  it('defines the two-level outcome model', () => {
    expect(STOPSCAN_OVERVIEW.evidenceStates.map(({ title }) => title)).toEqual([
      'Confirmed',
      'Contradicted',
      'Unresolved',
    ]);
    expect(STOPSCAN_OVERVIEW.encounterTypes.map(({ id }) => id)).toEqual([
      'information',
      'request',
      'alert',
    ]);
    expect(STOPSCAN_OVERVIEW.actionRule).toContain('Unresolved never means do nothing');
  });

  it('assigns each case an evidence state only after the walkthrough', () => {
    expect(CASES_IN_ORDER.map(({ outcome }) => outcome.state)).toEqual([
      'contradicted',
      'confirmed',
      'unresolved',
      'contradicted',
    ]);
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
