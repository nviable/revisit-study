import { describe, expect, it } from 'vitest';
import {
  getAncestorChain,
  getCategoryColor,
  getOntologyTerm,
  groupOntologyTags,
  highlightTerms,
  resolveTagPath,
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

  it('attaches the ontology definition and category color to highlighted titles', () => {
    const segments = highlightTerms('This detects Face Swap in Video footage.', ['Face Swap', 'Video']);
    const faceSwap = segments.find((segment) => segment.matchedTitle === 'Face Swap');
    const video = segments.find((segment) => segment.matchedTitle === 'Video');

    expect(faceSwap?.description).toMatch(/face has been superimposed/i);
    expect(faceSwap?.termSlug).toBe('face-swap');
    expect(faceSwap?.color).toBe('green');
    expect(video?.description).toMatch(/sequence of images/i);
    expect(video?.termSlug).toBe('video');
    expect(video?.color).toBe('gray');
  });

  it('maps each ontology branch to the study color scheme', () => {
    expect(getCategoryColor('video')).toBe('gray');
    expect(getCategoryColor('face-swap')).toBe('green');
    expect(getCategoryColor('spatial-scope')).toBe('yellow');
    expect(getCategoryColor('prnu-noise')).toBe('blue');
  });

  it('groups independent tags into compact root-category rows', () => {
    const groups = groupOntologyTags([
      ['spatial-features'],
      ['video'],
      ['face-swap'],
      ['audio'],
      ['segment'],
    ]);

    expect(groups.map((group) => group.root.slug)).toEqual([
      'media-modality',
      'forensic-goal-task',
      'search-analysis-scope',
      'evidentiary-features',
    ]);
    expect(groups[0].terms.map((term) => term.slug)).toEqual(['video', 'audio']);
    expect(groups[2].terms.map((term) => term.slug)).toEqual(['segment']);
  });
});
