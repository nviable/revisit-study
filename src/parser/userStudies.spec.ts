import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
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

  it('captures Prolific IDs and keeps explicit test sessions available', async () => {
    const text = readFileSync('public/ontology-technique-eval/config.json', 'utf8');
    const parsed = await parseStudyConfig(text);
    const consent = parsed.components.consent;

    expect(parsed.uiConfig.urlParticipantIdParam).toBe('PROLIFIC_PID');
    expect(consent.response[0]).toMatchObject({
      id: 'prolificId',
      type: 'custom',
      path: 'ontology-technique-eval/assets/ParticipantIdCollector.tsx',
      paramCapture: 'PROLIFIC_PID',
    });
  });
});
