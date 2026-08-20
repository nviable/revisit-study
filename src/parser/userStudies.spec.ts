import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { getSequenceFlatMap } from '../utils/getSequenceFlatMap';
import { generateSequenceArray } from '../utils/handleRandomSequences';
import { parseGlobalConfig, parseStudyConfig } from './parser';

describe('user studies from production fork', () => {
  it('registers the user studies as non-test in global.json', () => {
    const globalConfig = parseGlobalConfig(readFileSync('public/global.json', 'utf8'));
    expect(globalConfig.configsList).toContain('ontology-technique-eval');
    expect(globalConfig.configsList).toContain('varuna-sme-eval-ontology');
    expect(globalConfig.configsList).toContain('dndf-scenario-evaluation');
    expect(globalConfig.configs['ontology-technique-eval']?.test).toBeUndefined();
    expect(globalConfig.configs['varuna-sme-eval-ontology']?.test).toBeUndefined();
    expect(globalConfig.configs['dndf-scenario-evaluation']?.test).toBeUndefined();
    expect(globalConfig.configs.tutorial?.test).toBeUndefined();
    expect(globalConfig.configs['demo-html']?.test).toBe(true);
  });

  it.each([
    'ontology-technique-eval',
    'varuna-sme-eval-ontology',
    'dndf-scenario-evaluation',
  ])('parses %s without errors', async (studyId) => {
    const text = readFileSync(`public/${studyId}/config.json`, 'utf8');
    const parsed = await parseStudyConfig(text);
    expect(parsed.errors, JSON.stringify(parsed.errors, null, 2)).toEqual([]);
  });

  it('accepts the ontology-technique-eval Part C questionnaire', async () => {
    const text = readFileSync('public/ontology-technique-eval/config.json', 'utf8');
    const parsed = await parseStudyConfig(text);
    const partC = parsed.components['part-c'];

    expect(parsed.errors).toEqual([]);
    expect(partC).toMatchObject({
      type: 'questionnaire',
      response: [
        { id: 'partCIntro', type: 'textOnly' },
        { id: 'noticedFormatDifference', type: 'radio' },
        {
          id: 'ontologyCategoryRank',
          type: 'custom',
          path: 'ontology-technique-eval/assets/OntologyCategoryRanking.tsx',
        },
        { id: 'ontologyTagGaps', type: 'longText' },
        { id: 'formatPreference', type: 'radio' },
        { id: 'formatPreferenceWhy', type: 'longText' },
        { id: 'ontologyApplications', type: 'matrix-radio' },
      ],
    });
  });

  it('interleaves complementary keyword/ontology groups without repeating scenarios', async () => {
    const text = readFileSync('public/ontology-technique-eval/config.json', 'utf8');
    const parsed = await parseStudyConfig(text);
    expect(parsed.errors).toEqual([]);

    const sequences = generateSequenceArray(parsed);
    expect(sequences).toHaveLength(200);

    const taskAGroup1 = [1, 2, 3, 5];
    const taskAGroup2 = [4, 6, 7, 8];
    const taskBGroup1 = [1, 3];
    const taskBGroup2 = [2, 4];
    const armCounts = {
      1: 0, 2: 0, 3: 0, 4: 0,
    };

    sequences.forEach((sequence) => {
      const flat = getSequenceFlatMap(sequence);
      const taskA = flat.filter((id) => /^task-a-\d+-(keywords|ontology)$/.test(id));
      const taskB = flat.filter((id) => /^task-b-\d+-(keywords|ontology)$/.test(id));

      expect(taskA).toHaveLength(8);
      expect(taskB).toHaveLength(4);

      const parsedA = taskA.map((id) => {
        const match = id.match(/^task-a-(\d+)-(keywords|ontology)$/);
        return { vignette: Number(match?.[1]), format: match?.[2] };
      });
      const parsedB = taskB.map((id) => {
        const match = id.match(/^task-b-(\d+)-(keywords|ontology)$/);
        return { vignette: Number(match?.[1]), format: match?.[2] };
      });

      expect(new Set(parsedA.map((trial) => trial.vignette))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8]));
      expect(new Set(parsedB.map((trial) => trial.vignette))).toEqual(new Set([1, 2, 3, 4]));
      expect(parsedA.filter((trial) => trial.format === 'keywords')).toHaveLength(4);
      expect(parsedA.filter((trial) => trial.format === 'ontology')).toHaveLength(4);
      expect(parsedB.filter((trial) => trial.format === 'keywords')).toHaveLength(2);
      expect(parsedB.filter((trial) => trial.format === 'ontology')).toHaveLength(2);

      const a1IsKeywords = taskAGroup1.every((vignette) => (
        parsedA.find((trial) => trial.vignette === vignette)?.format === 'keywords'
      ));
      const a1IsOntology = taskAGroup1.every((vignette) => (
        parsedA.find((trial) => trial.vignette === vignette)?.format === 'ontology'
      ));
      const b1IsKeywords = taskBGroup1.every((vignette) => (
        parsedB.find((trial) => trial.vignette === vignette)?.format === 'keywords'
      ));
      const b1IsOntology = taskBGroup1.every((vignette) => (
        parsedB.find((trial) => trial.vignette === vignette)?.format === 'ontology'
      ));

      expect(a1IsKeywords || a1IsOntology).toBe(true);
      expect(b1IsKeywords || b1IsOntology).toBe(true);

      const aKeywords = parsedA.filter((trial) => trial.format === 'keywords').map((trial) => trial.vignette).sort((left, right) => left - right);
      const aOntology = parsedA.filter((trial) => trial.format === 'ontology').map((trial) => trial.vignette).sort((left, right) => left - right);
      const bKeywords = parsedB.filter((trial) => trial.format === 'keywords').map((trial) => trial.vignette).sort((left, right) => left - right);
      const bOntology = parsedB.filter((trial) => trial.format === 'ontology').map((trial) => trial.vignette).sort((left, right) => left - right);

      if (a1IsKeywords) {
        expect(aKeywords).toEqual([...taskAGroup1].sort((left, right) => left - right));
        expect(aOntology).toEqual([...taskAGroup2].sort((left, right) => left - right));
      } else {
        expect(aOntology).toEqual([...taskAGroup1].sort((left, right) => left - right));
        expect(aKeywords).toEqual([...taskAGroup2].sort((left, right) => left - right));
      }

      if (b1IsKeywords) {
        expect(bKeywords).toEqual([...taskBGroup1].sort((left, right) => left - right));
        expect(bOntology).toEqual([...taskBGroup2].sort((left, right) => left - right));
      } else {
        expect(bOntology).toEqual([...taskBGroup1].sort((left, right) => left - right));
        expect(bKeywords).toEqual([...taskBGroup2].sort((left, right) => left - right));
      }

      expect(flat[flat.indexOf(taskA[0]) + 4]).toBe('attention-check-a');
      expect(flat[flat.indexOf(taskB[0]) + 2]).toBe('attention-check-b');

      let arm = 4;
      if (a1IsKeywords && b1IsKeywords) {
        arm = 1;
      } else if (a1IsOntology && b1IsOntology) {
        arm = 2;
      } else if (a1IsKeywords && b1IsOntology) {
        arm = 3;
      }
      armCounts[arm] += 1;
    });

    expect(armCounts).toEqual({
      1: 50, 2: 50, 3: 50, 4: 50,
    });
  });

  it('captures Prolific IDs and keeps explicit test sessions available', async () => {
    const text = readFileSync('public/ontology-technique-eval/config.json', 'utf8');
    const parsed = await parseStudyConfig(text);
    const consent = parsed.components.consent;

    expect(parsed.uiConfig.urlParticipantIdParam).toBe('PROLIFIC_PID');
    expect(consent.response?.[0]).toMatchObject({
      id: 'prolificId',
      type: 'custom',
      path: 'ontology-technique-eval/assets/ParticipantIdCollector.tsx',
      paramCapture: 'PROLIFIC_PID',
    });
  });
});
