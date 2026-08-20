import {
  Badge,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconSchema, IconTags } from '@tabler/icons-react';
import { useEffect } from 'react';
import type { StimulusParams } from '../../../store/types';
import { getDemoTechnique } from './studyBank';
import { TechniqueCard } from './TechniqueCard';
import type { ProvenanceState } from './types';
import { useInteractionProvenance } from './useInteractionProvenance';

const columnStyle = {
  minWidth: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column' as const,
};

export default function FormatIntroduction({
  setAnswer,
  provenanceState,
}: StimulusParams<Record<string, never>, ProvenanceState>) {
  const { record } = useInteractionProvenance(setAnswer);
  const technique = getDemoTechnique();

  useEffect(() => {
    setAnswer({
      status: true,
      answers: {
        clickLog: [],
        elementDwellTimes: {},
        openedElements: [],
      },
    });
  }, [setAnswer]);

  return (
    <Stack gap="md" p="md" style={{ minWidth: 0, overflow: 'hidden' }}>
      <div>
        <Title order={3}>How technique descriptions will look</Title>
        <Text size="sm" mt="xs">
          You will see forensic techniques in one of two description formats per scenario. Both
          formats can include the same optional materials: an AI summary, the paper abstract, and
          the full paper. Try opening those sections on the sample cards below. When structured
          tags are shown, hover a tag to read its definition.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" style={{ minWidth: 0 }}>
        <Paper withBorder p="md" radius="md" style={columnStyle}>
          <Group gap="xs" mb="sm" wrap="wrap">
            <IconTags size={18} />
            <Title order={4}>Keyword supported</Title>
            <Badge variant="outline" color="gray">Format A</Badge>
          </Group>
          <Text size="sm" mb="sm" c="dimmed">
            The paper title is followed by author or publisher keywords. There is no hierarchy
            and no built-in definition for each keyword.
          </Text>
          <TechniqueCard
            technique={technique}
            format="keywords"
            idPrefix="intro-keywords"
            provenanceState={provenanceState}
            onInteract={record}
          />
        </Paper>
        <Paper withBorder p="md" radius="md" style={columnStyle}>
          <Group gap="xs" mb="sm" wrap="wrap">
            <IconSchema size={18} />
            <Title order={4}>Ontology supported</Title>
            <Badge color="defakeTeal" variant="light">Format B</Badge>
          </Group>
          <Text size="sm" mb="sm" c="dimmed">
            The same title is followed by structured tags grouped under the ontology&apos;s four
            root branches. Hover a tag for its definition and full ontology path. Matching terms
            are highlighted in the AI summary.
          </Text>
          <TechniqueCard
            technique={technique}
            format="ontology"
            idPrefix="intro-ontology"
            provenanceState={provenanceState}
            onInteract={record}
          />
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
