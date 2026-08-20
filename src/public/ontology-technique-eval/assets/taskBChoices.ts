import { STUDY_BANK, getTaskBVignette } from './studyBank';

export interface TaskBTechniqueChoice {
  label: string;
  value: string;
  position: number;
}

const TASK_B_TECHNIQUE_IDS = new Set(
  STUDY_BANK.taskBVignettes.flatMap((vignette) => vignette.techniqueIds),
);

export function getTaskBTechniqueChoices(vignetteId: string | undefined): TaskBTechniqueChoice[] {
  const vignette = vignetteId ? getTaskBVignette(vignetteId) : undefined;
  return (vignette?.techniqueIds ?? []).map((techniqueId, index) => ({
    label: `Technique ${index + 1}`,
    value: techniqueId,
    position: index + 1,
  }));
}

export function isTaskBTechniqueId(value: unknown): value is string {
  return typeof value === 'string' && TASK_B_TECHNIQUE_IDS.has(value);
}

export function vignetteIdFromParameters(parameters: Record<string, unknown> | undefined): string | undefined {
  const vignetteId = parameters?.vignetteId;
  return typeof vignetteId === 'string' ? vignetteId : undefined;
}
