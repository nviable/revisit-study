import {
  Badge,
  Grid,
  Group,
  Paper,
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

export default function FormatIntroduction({
  setAnswer,
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
    <Stack gap="md" p="md">
      <div>
        <Title order={3}>How technique descriptions will look</Title>
        <Text size="sm" mt="xs">
          You will see forensic techniques in one of two description formats. Both formats can
          include the same optional materials: the paper abstract, a plain-language summary, and
          the full paper. Try opening those sections on the sample cards below. When structured
          tags are shown, hover a tag to read its definition.
        </Text>
      </div>

      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="sm" radius="md" h="100%">
            <Group gap="xs" mb="sm">
              <IconTags size={18} />
              <Title order={4}>Keyword supported</Title>
              <Badge variant="outline" color="gray">Format A</Badge>
            </Group>
            <Text size="sm" mb="sm" c="dimmed">
              The paper title is followed by author or publisher keywords. There is no hierarchy
              and no built-in definition for each keyword.
            </Text>
            <TechniqueCard technique={technique} format="keywords" idPrefix="intro-keywords" onInteract={record} />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="sm" radius="md" h="100%">
            <Group gap="xs" mb="sm">
              <IconSchema size={18} />
              <Title order={4}>Ontology supported</Title>
              <Badge color="defakeTeal" variant="light">Format B</Badge>
            </Group>
            <Text size="sm" mb="sm" c="dimmed">
              The same title is followed by structured tags. Chains such as parent → leaf show
              how a term sits in the vocabulary. Hover a tag for its definition. Matching terms
              are highlighted in the plain-language summary.
            </Text>
            <TechniqueCard technique={technique} format="ontology" idPrefix="intro-ontology" onInteract={record} />
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
