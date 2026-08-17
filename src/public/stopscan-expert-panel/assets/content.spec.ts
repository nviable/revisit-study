import { describe, expect, it } from 'vitest';
import { CASES, STOPSCAN_OVERVIEW } from './content';

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
});
