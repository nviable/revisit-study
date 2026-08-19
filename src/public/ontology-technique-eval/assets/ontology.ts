import ontologyTerms from './data/ontology_terms_flat.json';
import type { OntologyTerm } from './types';

const TERMS = ontologyTerms as OntologyTerm[];

const TERMS_BY_SLUG: Record<string, OntologyTerm> = TERMS.reduce((acc, term) => {
  acc[term.slug] = term;
  return acc;
}, {} as Record<string, OntologyTerm>);

const TERMS_BY_TITLE: Record<string, OntologyTerm> = TERMS.reduce((acc, term) => {
  acc[term.title.toLowerCase()] = term;
  return acc;
}, {} as Record<string, OntologyTerm>);

/** Mantine color names for the four top-level ontology branches. */
export const ONTOLOGY_CATEGORY_COLORS: Record<string, string> = {
  'media-modality': 'blue',
  'forensic-goal-task': 'defakeTeal',
  'evidentiary-features': 'orange',
  'search-analysis-scope': 'violet',
};

export function getOntologyTerm(slug: string): OntologyTerm | undefined {
  return TERMS_BY_SLUG[slug];
}

export function getOntologyTermByTitle(title: string): OntologyTerm | undefined {
  return TERMS_BY_TITLE[title.toLowerCase()];
}

export function getRootCategorySlug(slug: string): string | undefined {
  const chain = getAncestorChain(slug);
  return chain[0]?.slug;
}

export function getCategoryColor(slug: string): string {
  const root = getRootCategorySlug(slug);
  return (root && ONTOLOGY_CATEGORY_COLORS[root]) || 'gray';
}

/** Walk parent_slug links from a leaf up to (and including) the root. */
export function getAncestorChain(slug: string): OntologyTerm[] {
  const chain: OntologyTerm[] = [];
  const seen = new Set<string>();
  let current: OntologyTerm | undefined = TERMS_BY_SLUG[slug];

  while (current && !seen.has(current.slug)) {
    seen.add(current.slug);
    chain.push(current);
    current = current.parent_slug ? TERMS_BY_SLUG[current.parent_slug] : undefined;
  }

  return chain.reverse();
}

export function resolveTagPath(path: string[]): OntologyTerm[] {
  return path
    .map((slug) => TERMS_BY_SLUG[slug])
    .filter((term): term is OntologyTerm => Boolean(term));
}

export interface HighlightSegment {
  text: string;
  matchedTitle?: string;
  termSlug?: string;
  description?: string;
  color?: string;
}

/**
 * Split `text` so that ontology tag titles can be highlighted.
 * Longer titles are matched first to avoid partial overlaps.
 */
export function highlightTerms(text: string, titles: string[]): HighlightSegment[] {
  const uniqueTitles = Array.from(new Set(titles.filter((title) => title.trim().length > 0)))
    .sort((a, b) => b.length - a.length);

  if (uniqueTitles.length === 0 || text.length === 0) {
    return [{ text }];
  }

  const escaped = uniqueTitles.map((title) => title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }
    const matchedText = match[0];
    const canonical = uniqueTitles.find((title) => title.toLowerCase() === matchedText.toLowerCase());
    const matchedTerm = canonical ? getOntologyTermByTitle(canonical) : undefined;
    segments.push({
      text: matchedText,
      matchedTitle: canonical,
      termSlug: matchedTerm?.slug,
      description: matchedTerm?.description,
      color: matchedTerm ? getCategoryColor(matchedTerm.slug) : undefined,
    });
    lastIndex = match.index + matchedText.length;
    match = pattern.exec(text);
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ text }];
}

export function titlesForTechniqueTags(paths: string[][]): string[] {
  return paths.flatMap((path) => resolveTagPath(path).map((term) => term.title));
}
