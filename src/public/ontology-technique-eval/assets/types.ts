export type DescriptionFormat = 'keywords' | 'ontology';

export interface OntologyTerm {
  slug: string;
  title: string;
  description: string;
  parent_slug: string | null;
}

/** One visible ontology tag. `path` is a slug chain from ancestor to leaf. */
export interface OntologyTagPath {
  path: string[];
}

export interface Technique {
  id: string;
  title: string;
  keywords: string[];
  ontologyTags: OntologyTagPath[];
  abstract: string;
  /** Plain-language summary shown with keyword-supported descriptions. */
  baselineSummary: string;
  /** Plain-language summary shown with ontology-supported descriptions; tag titles are highlighted. */
  aiSummary: string;
  pdfPath: string;
}

export interface TaskAVignette {
  id: string;
  set: 'A' | 'B';
  title: string;
  scenario: string;
  techniqueId: string;
}

export interface TaskBVignette {
  id: string;
  set: 'A' | 'B';
  title: string;
  scenario: string;
  techniqueIds: string[];
  /** Placeholder ground truth for later analysis; not shown to participants. */
  correctTechniqueId: string;
}

export interface StudyBank {
  techniques: Technique[];
  taskAVignettes: TaskAVignette[];
  taskBVignettes: TaskBVignette[];
}

export interface TaskAStimulusParams {
  vignetteId: string;
  format: DescriptionFormat;
}

export interface TaskBStimulusParams {
  vignetteId: string;
  format: DescriptionFormat;
}

export type InteractionEventType = 'click' | 'open' | 'close' | 'hover';

export type InteractionRegion =
  | 'card'
  | 'title'
  | 'keyword'
  | 'ontology-tag'
  | 'abstract'
  | 'summary'
  | 'summary-tag'
  | 'full-paper';

export interface InteractionEvent {
  timestamp: number;
  type: InteractionEventType;
  elementId: string;
  label: string;
  techniqueId?: string;
  cardId?: string;
  format?: DescriptionFormat;
  cardIndex?: number;
  region?: InteractionRegion;
}

export interface ProvenanceState {
  events: InteractionEvent[];
  openSince: Record<string, number>;
  dwellMs: Record<string, number>;
}
