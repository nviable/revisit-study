import {
  Alert, SimpleGrid, Stack, Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect } from 'react';
import type { StimulusParams } from '../../../store/types';
import { ScenarioPanel } from './ScenarioPanel';
import { getTaskBVignette, getTechnique } from './studyBank';
import { TechniqueCard } from './TechniqueCard';
import type { ProvenanceState, TaskBStimulusParams } from './types';
import { useInteractionProvenance } from './useInteractionProvenance';

export default function TaskBStimulus({
  parameters,
  setAnswer,
}: StimulusParams<TaskBStimulusParams, ProvenanceState>) {
  const { record } = useInteractionProvenance(setAnswer);
  const vignette = getTaskBVignette(parameters.vignetteId);
  const techniques = vignette
    ? vignette.techniqueIds
      .map((id) => getTechnique(id))
      .filter((technique): technique is NonNullable<typeof technique> => technique != null)
    : [];

  useEffect(() => {
    setAnswer({
      status: true,
      answers: {
        clickLog: [],
        elementDwellTimes: {},
        openedElements: [],
        techniqueOrder: vignette?.techniqueIds ?? [],
      },
    });
  }, [setAnswer, vignette?.techniqueIds]);

  if (!vignette || techniques.length !== 4) {
    return (
      <Alert color="red" icon={<IconAlertCircle />}>
        Missing placeholder vignette or techniques for
        {' '}
        {parameters.vignetteId}
        .
      </Alert>
    );
  }

  return (
    <Stack gap="md" p="md">
      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Task B</Text>
      <ScenarioPanel title={vignette.title} scenario={vignette.scenario} />
      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="sm">
        {techniques.map((technique, index) => (
          <TechniqueCard
            key={technique.id}
            technique={technique}
            format={parameters.format}
            compact
            index={index + 1}
            onInteract={record}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
