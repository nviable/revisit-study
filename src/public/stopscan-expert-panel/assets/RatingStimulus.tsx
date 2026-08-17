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
    body: 'Thinking about all four cases, rate how much you agree or disagree with each statement. You may explain any rating in the optional text box.',
  },
  sift: {
    title: 'Rating SIFT',
    body: 'Now consider SIFT. These questions appear before we show you our own criticisms of it. Use the reference buttons if you would like to review the SIFT summary.',
  },
  open: {
    title: 'Open critique',
    body: 'These questions are optional. They appear before we show you our own concerns about SIFT.',
  },
  critique: {
    title: 'Concerns about using SIFT with synthetic media',
    body: 'Read each concern below, then tell us where you agree, where it is overstated, and where it is wrong.',
  },
  compare: {
    title: 'Final comparison',
    body: 'Compare the two approaches. The middle of each scale means that you have no preference. You may also indicate that neither approach is adequate or that you do not feel able to compare them.',
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
