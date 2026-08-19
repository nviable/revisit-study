import { describe, expect, it } from 'vitest';
import {
  STUDY_BANK, getTaskAVignette, getTaskBVignette, getTechnique, summaryForFormat,
} from './studyBank';

describe('placeholder study bank', () => {
  it('has 8 Task A vignettes split into sets A and B', () => {
    expect(STUDY_BANK.taskAVignettes).toHaveLength(8);
    expect(STUDY_BANK.taskAVignettes.filter((vignette) => vignette.set === 'A')).toHaveLength(4);
    expect(STUDY_BANK.taskAVignettes.filter((vignette) => vignette.set === 'B')).toHaveLength(4);
  });

  it('has 4 Task B vignettes each paired with 4 techniques', () => {
    expect(STUDY_BANK.taskBVignettes).toHaveLength(4);
    STUDY_BANK.taskBVignettes.forEach((vignette) => {
      expect(vignette.techniqueIds).toHaveLength(4);
      expect(vignette.techniqueIds).toContain(vignette.correctTechniqueId);
      vignette.techniqueIds.forEach((id) => {
        expect(getTechnique(id)).toBeDefined();
      });
    });
  });

  it('gives every technique title, keywords, ontology tags, abstract, summary, and a paper path', () => {
    STUDY_BANK.techniques.forEach((technique) => {
      expect(technique.title.length).toBeGreaterThan(0);
      expect(technique.keywords.length).toBeGreaterThan(0);
      expect(technique.ontologyTags.length).toBeGreaterThan(0);
      expect(technique.abstract.length).toBeGreaterThan(0);
      expect(technique.baselineSummary.length).toBeGreaterThan(0);
      expect(technique.aiSummary.length).toBeGreaterThan(0);
      expect(technique.baselineSummary).not.toBe(technique.aiSummary);
      expect(technique.pdfPath.endsWith('.pdf')).toBe(true);
    });
  });

  it('resolves Task A and Task B placeholders by id', () => {
    expect(getTaskAVignette('task-a-1')?.techniqueId).toBe('t-a1');
    expect(getTaskBVignette('task-b-1')?.techniqueIds).toHaveLength(4);
  });

  it('selects the baseline summary for keywords and the AI summary for ontology tags', () => {
    const technique = getTechnique('t-a1');
    expect(technique).toBeDefined();
    if (!technique) {
      return;
    }
    expect(summaryForFormat(technique, 'keywords')).toBe(technique.baselineSummary);
    expect(summaryForFormat(technique, 'ontology')).toBe(technique.aiSummary);
  });
});
