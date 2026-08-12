import { useEffect } from 'react';
import { Box, Text, Title, Stack } from '@mantine/core';
import { StimulusParams } from '../../../store/types';
import { ReferenceHelpers } from './ReferenceHelpers';
import { useInteractionLog } from './useInteractionLog';
import { SIFT_CRITIQUE } from './content';

export type RatingStimulusParams = {
  section: 'stopscan' | 'sift' | 'open' | 'critique' | 'compare';
};

const SECTION_COPY: Record<RatingStimulusParams['section'], { title: string; body: string }> = {
  stopscan: {
    title: 'Rating STOP&SCAN',
    body: 'Seven-point agreement items about the framework you just saw applied across the four cases. Optional “why” boxes follow each item.',
  },
  sift: {
    title: 'Rating SIFT',
    body: 'Asked before we state any of our own criticisms of SIFT. Use the reference buttons if you want to re-read the SIFT card.',
  },
  open: {
    title: 'Open critique',
    body: 'All free text, all optional. Asked before we state our criticisms of SIFT.',
  },
  critique: {
    title: 'Our position on SIFT, and your response',
    body: 'Read our stated positions below, then respond in the sidebar.',
  },
  compare: {
    title: 'Comparative and recommendation',
    body: 'Seven-point bipolar items with SIFT at one end, STOP&SCAN at the other, and “no preference” as the midpoint. Two independent checkboxes are available on each item.',
  },
};

export default function RatingStimulus({
  parameters,
  setAnswer,
}: StimulusParams<RatingStimulusParams>) {
  const { section } = parameters;
  const copy = SECTION_COPY[section];
  const { logEvent, ensureSeeded } = useInteractionLog(setAnswer);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  return (
    <Box maw={860} mx="auto" p="md">
      <ReferenceHelpers onLog={logEvent} />
      <Stack gap="md">
        <div>
          <Title order={3}>{copy.title}</Title>
          <Text size="sm" mt={6}>{copy.body}</Text>
        </div>

        {section === 'critique' && (
          <Stack gap="sm">
            <Text size="sm">{SIFT_CRITIQUE.intro}</Text>
            {SIFT_CRITIQUE.positions.map((p) => (
              <Box
                key={p.id}
                p="md"
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  background: '#fff',
                }}
              >
                <Text fw={700} size="sm" mb={4}>{p.title}</Text>
                <Text size="sm">{p.body}</Text>
              </Box>
            ))}
            <Box
              p="md"
              style={{
                border: '1px solid #dbe4ee',
                borderRadius: 10,
                background: '#f8fafc',
              }}
            >
              <Text fw={700} size="sm" mb={4}>On the AI-specific extension</Text>
              <Text size="sm">{SIFT_CRITIQUE.aiExtension}</Text>
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
