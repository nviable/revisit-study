import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
import { parseGlobalConfig, parseStudyConfig } from './parser';

describe('user studies from production fork', () => {
  it('registers the user studies as non-test in global.json', () => {
    const globalConfig = parseGlobalConfig(readFileSync('public/global.json', 'utf8'));
    expect(globalConfig.configsList).toContain('varuna-sme-eval-ontology');
    expect(globalConfig.configsList).toContain('dndf-scenario-evaluation');
    expect(globalConfig.configsList).toContain('stopscan-expert-panel');
    expect(globalConfig.configs['varuna-sme-eval-ontology']?.test).toBeUndefined();
    expect(globalConfig.configs['dndf-scenario-evaluation']?.test).toBeUndefined();
    expect(globalConfig.configs['stopscan-expert-panel']?.test).toBeUndefined();
    expect(globalConfig.configs.tutorial?.test).toBeUndefined();
    expect(globalConfig.configs['demo-html']?.test).toBe(true);
  });

  it.each([
    'varuna-sme-eval-ontology',
    'dndf-scenario-evaluation',
    'stopscan-expert-panel',
  ])('parses %s without errors', async (studyId) => {
    const text = readFileSync(`public/${studyId}/config.json`, 'utf8');
    const parsed = await parseStudyConfig(text);
    expect(parsed.errors, JSON.stringify(parsed.errors, null, 2)).toEqual([]);
  });
});
