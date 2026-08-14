import { describe, expect, it } from 'vitest';
import {
  getAncestorChain, getOntologyTerm, highlightTerms, resolveTagPath,
} from './ontology';

describe('ontology helpers', () => {
  it('looks up a term by slug', () => {
    const term = getOntologyTerm('face-swap');
    expect(term?.title).toBe('Face Swap');
    expect(term?.parent_slug).toBe('deepfakes');
  });

  it('walks a leaf to its root chain', () => {
    const chain = getAncestorChain('face-swap').map((term) => term.slug);
    expect(chain[0]).toBe('forensic-goal-task');
    expect(chain).toContain('deepfakes');
    expect(chain[chain.length - 1]).toBe('face-swap');
  });

  it('resolves an explicit tag path and skips unknown slugs', () => {
    const terms = resolveTagPath(['video', 'does-not-exist', 'face-swap']);
    expect(terms.map((term) => term.slug)).toEqual(['video', 'face-swap']);
  });

  it('highlights ontology titles without splitting unmatched text', () => {
    const segments = highlightTerms(
      'This detects Face Swap Deepfakes in Video footage.',
      ['Face Swap', 'Deepfakes', 'Video'],
    );
    const matched = segments.filter((segment) => segment.matchedTitle);
    expect(matched.map((segment) => segment.matchedTitle)).toEqual(['Face Swap', 'Deepfakes', 'Video']);
    expect(segments[0].text).toBe('This detects ');
  });

  it('prefers the longer title when titles overlap', () => {
    const segments = highlightTerms('Mel-frequency Cepstral Coefficients (MFCC) work.', [
      'Mel-frequency Cepstral Coefficients (MFCC)',
      'MFCC',
    ]);
    expect(segments.some((segment) => segment.matchedTitle === 'Mel-frequency Cepstral Coefficients (MFCC)')).toBe(true);
  });
});
