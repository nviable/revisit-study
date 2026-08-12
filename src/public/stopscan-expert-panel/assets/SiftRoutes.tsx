import { useEffect, useMemo, useRef } from 'react';
import {
  Accordion, Badge, Box, Group, Stack, Text, Title, ThemeIcon,
} from '@mantine/core';
import { Route, ClipboardList } from 'lucide-react';
import { StimulusParams } from '../../../store/types';
import { SIFT_BLOCKS, SIFT_INTRO } from './content';
import { ReferenceHelpers } from './ReferenceHelpers';
import { useInteractionLog } from './useInteractionLog';

export type SiftRoutesParams = {
  caseId: 'case2' | 'case4';
};

export default function SiftRoutes({
  parameters,
  setAnswer,
}: StimulusParams<SiftRoutesParams>) {
  const block = useMemo(
    () => SIFT_BLOCKS.find((b) => b.caseId === parameters.caseId),
    [parameters.caseId],
  );
  const { logEvent, ensureSeeded } = useInteractionLog(setAnswer);
  const openRef = useRef<string[]>([]);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  if (!block) {
    return <Text>Unknown SIFT case block.</Text>;
  }

  return (
    <Box maw={860} mx="auto" p="md">
      <ReferenceHelpers onLog={logEvent} />

      <Stack gap="md">
        <div>
          <Badge color="blue" variant="light" mb={6}>Block 3b — How else this could have gone</Badge>
          <Title order={3}>{block.title}</Title>
          <Text size="sm" mt="sm">{SIFT_INTRO}</Text>
        </div>

        <Box
          p="md"
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
          }}
        >
          <Group gap="xs" mb={6}>
            <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
              <ClipboardList size={14} />
            </ThemeIcon>
            <Text fw={600} size="sm">The encounter</Text>
          </Group>
          <Text size="sm">{block.encounter}</Text>
        </Box>

        <Accordion
          multiple
          variant="separated"
          radius="md"
          defaultValue={[]}
          onChange={(values) => {
            const opened = Array.isArray(values) ? values : [];
            opened.forEach((value) => {
              if (!openRef.current.includes(value)) {
                logEvent('accordion_open', `${block.caseId}_${value}`);
              }
            });
            openRef.current = opened;
          }}
        >
          {block.routes.map((route) => (
            <Accordion.Item key={route.id} value={route.id}>
              <Accordion.Control icon={<Route size={16} />}>
                <Text fw={600}>{route.label}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">{route.body}</Text>
                <Text size="xs" c="dimmed" mt="sm">
                  Moves used: {route.moves.join('; ')}
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>

        <Text size="sm" c="dimmed">
          Answer the route questions in the sidebar. Open each route above if you need to re-read it.
        </Text>
      </Stack>
    </Box>
  );
}
