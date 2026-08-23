import { describe, expect, it } from 'vitest';
import {
  collectOpenedMaterialScreens,
  formatOpenedScreenLine,
  materialSourcesFromReliedOn,
  parseTaskComponentName,
} from './openedMaterials';

describe('opened materials follow-up', () => {
  it('keeps only AI summary, abstract, and full paper, in that option order', () => {
    expect(materialSourcesFromReliedOn([
      'Full paper',
      'Technique title',
      'AI summary',
      'Keywords or ontology tags',
    ])).toEqual(['AI summary', 'Full paper']);
  });

  it('parses Task A and Task B component names and ignores attention checks', () => {
    expect(parseTaskComponentName('task-a-3-ontology')).toEqual({
      task: 'A',
      vignetteId: 'task-a-3',
      format: 'ontology',
    });
    expect(parseTaskComponentName('task-b-2-keywords')).toEqual({
      task: 'B',
      vignetteId: 'task-b-2',
      format: 'keywords',
    });
    expect(parseTaskComponentName('attention-check-a')).toBeNull();
  });

  it('lists matching Task A and Task B screens in the order they were seen', () => {
    const screens = collectOpenedMaterialScreens({
      later: {
        componentName: 'task-b-1-keywords',
        startTime: 200,
        answer: { reliedOn: ['Abstract', 'Technique title'] },
      },
      skipped: {
        componentName: 'task-a-2-ontology',
        startTime: 50,
        answer: { reliedOn: ['Technique title'] },
      },
      earlier: {
        componentName: 'task-a-1-ontology',
        startTime: 100,
        answer: { reliedOn: ['Full paper', 'AI summary'] },
      },
      attention: {
        componentName: 'attention-check-a',
        startTime: 150,
        answer: { reliedOn: ['AI summary'] },
      },
    });

    expect(screens.map((screen) => screen.componentName)).toEqual([
      'task-a-1-ontology',
      'task-b-1-keywords',
    ]);
    expect(screens[0].sources).toEqual(['AI summary', 'Full paper']);
    expect(formatOpenedScreenLine(screens[0])).toMatch(/ontology tags/);
    expect(formatOpenedScreenLine(screens[0])).toMatch(/AI summary, Full paper/);
    expect(formatOpenedScreenLine(screens[1])).toMatch(/keywords/);
    expect(formatOpenedScreenLine(screens[1])).toMatch(/Abstract/);
  });
});
