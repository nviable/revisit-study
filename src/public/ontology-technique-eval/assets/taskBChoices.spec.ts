import { describe, expect, it } from 'vitest';
import { STUDY_BANK } from './studyBank';
import {
  getTaskBTechniqueChoices,
  isTaskBTechniqueId,
  vignetteIdFromParameters,
} from './taskBChoices';

describe('task B technique choices', () => {
  it('labels cards 1-4 and stores the technique ids in that same order', () => {
    STUDY_BANK.taskBVignettes.forEach((vignette) => {
      const choices = getTaskBTechniqueChoices(vignette.id);
      expect(choices.map((choice) => choice.label)).toEqual([
        'Technique 1',
        'Technique 2',
        'Technique 3',
        'Technique 4',
      ]);
      expect(choices.map((choice) => choice.value)).toEqual(vignette.techniqueIds);
      expect(choices.map((choice) => choice.position)).toEqual([1, 2, 3, 4]);
    });
  });

  it('records ice-house distractor 1 as t-b2-d1 when Technique 2 is selected', () => {
    const choices = getTaskBTechniqueChoices('task-b-2');
    expect(choices[1]).toEqual({
      label: 'Technique 2',
      value: 't-b2-d1',
      position: 2,
    });
  });

  it('accepts known technique ids and rejects position numbers', () => {
    expect(isTaskBTechniqueId('t-b2-d1')).toBe(true);
    expect(isTaskBTechniqueId('t-b1-target')).toBe(true);
    expect(isTaskBTechniqueId('2')).toBe(false);
    expect(isTaskBTechniqueId('Technique 2')).toBe(false);
    expect(isTaskBTechniqueId(null)).toBe(false);
  });

  it('reads the vignette id from component parameters', () => {
    expect(vignetteIdFromParameters({ vignetteId: 'task-b-3', format: 'ontology' })).toBe('task-b-3');
    expect(vignetteIdFromParameters({ format: 'keywords' })).toBeUndefined();
  });
});
