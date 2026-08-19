import { describe, expect, it } from 'vitest';
import { rankingToValue, valueToRanking } from './OntologyCategoryRanking';

const OPTIONS = [
  'Modality',
  'Forensic Task & Goal',
  'Search & Analysis Scope',
  'Evidentiary Features',
];

describe('ontology category ranking', () => {
  it('stores every category with its zero-based rank', () => {
    const order = [
      'Evidentiary Features',
      'Modality',
      'Forensic Task & Goal',
      'Search & Analysis Scope',
    ];

    expect(rankingToValue(order)).toEqual({
      'Evidentiary Features': '0',
      Modality: '1',
      'Forensic Task & Goal': '2',
      'Search & Analysis Scope': '3',
    });
  });

  it('restores a complete ranking in rank order', () => {
    expect(valueToRanking({
      Modality: '2',
      'Forensic Task & Goal': '0',
      'Search & Analysis Scope': '3',
      'Evidentiary Features': '1',
    }, OPTIONS)).toEqual([
      'Forensic Task & Goal',
      'Evidentiary Features',
      'Modality',
      'Search & Analysis Scope',
    ]);
  });

  it('rejects incomplete and duplicate rankings', () => {
    expect(valueToRanking({ Modality: '0' }, OPTIONS)).toBeNull();
    expect(valueToRanking({
      Modality: '0',
      'Forensic Task & Goal': '0',
      'Search & Analysis Scope': '2',
      'Evidentiary Features': '3',
    }, OPTIONS)).toBeNull();
  });
});
