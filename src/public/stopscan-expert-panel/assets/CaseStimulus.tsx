import { useEffect, useMemo } from 'react';
import {
  Badge, Box, Group, Stack, Text, Title, ThemeIcon,
} from '@mantine/core';
import { IconClipboardList, IconQuote } from '@tabler/icons-react';
import { StimulusParams } from '../../../store/types';
import { CaseStepContent, getCase } from './content';
import { ReferenceHelpers } from './ReferenceHelpers';
import { useInteractionLog } from './useInteractionLog';

export type CaseStimulusParams = {
  caseId: string;
  /** When set, shows that step's evaluation. When omitted, shows the after-case recap chrome. */
  stepKey?: 'source' | 'content' | 'alignment' | 'reflect';
  mode: 'step' | 'after';
};

function StepEvaluation({ step, current }: { step: CaseStepContent; current: boolean }) {
  return (
    <Box
      p="md"
      style={{
        background: current
          ? 'linear-gradient(160deg, #f3faf7 0%, #f7fbfc 100%)'
          : '#f8fafc',
        border: current ? '1px solid #d5e6df' : '1px solid #e2e8f0',
        borderRadius: 12,
        opacity: current ? 1 : 0.92,
      }}
    >
      <Group gap="xs" mb={8} justify="space-between">
        <Group gap="xs">
          <ThemeIcon size="sm" variant={current ? 'filled' : 'light'} color="teal" radius="xl">
            <IconQuote size={14} />
          </ThemeIcon>
          <Text fw={700}>
            Step {step.stepIndex} of 4 — {step.label}
          </Text>
        </Group>
        {!current && (
          <Badge size="xs" variant="outline" color="gray">Previously submitted</Badge>
        )}
        {current && (
          <Badge size="xs" variant="light" color="teal">Current step</Badge>
        )}
      </Group>
      <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{step.evaluation}</Text>
    </Box>
  );
}

export default function CaseStimulus({
  parameters,
  setAnswer,
}: StimulusParams<CaseStimulusParams>) {
  const { caseId, stepKey, mode } = parameters;
  const caseContent = useMemo(() => getCase(caseId), [caseId]);
  const visibleSteps = useMemo(() => {
    if (mode === 'after') {
      return caseContent.steps;
    }
    if (!stepKey) {
      return [];
    }
    const idx = caseContent.steps.findIndex((s) => s.key === stepKey);
    return caseContent.steps.slice(0, idx + 1);
  }, [caseContent, mode, stepKey]);

  const { logEvent, ensureSeeded } = useInteractionLog(setAnswer);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  return (
    <Box maw={860} mx="auto" p="md">
      <ReferenceHelpers onLog={logEvent} />

      <Stack gap="md">
        <div>
          <Group gap="xs" mb={4}>
            <Badge color="teal" variant="light">{caseContent.shortLabel}</Badge>
            {mode === 'step' && stepKey && (
              <Badge color="gray" variant="outline">
                Responding to {caseContent.steps.find((s) => s.key === stepKey)?.label}
              </Badge>
            )}
            {mode === 'after' && (
              <Badge color="gray" variant="outline">After the case</Badge>
            )}
          </Group>
          <Title order={3}>{caseContent.title}</Title>
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
              <IconClipboardList size={14} />
            </ThemeIcon>
            <Text fw={600} size="sm">The encounter</Text>
          </Group>
          <Text size="sm">{caseContent.encounter}</Text>
        </Box>

        {visibleSteps.map((step) => (
          <StepEvaluation
            key={step.key}
            step={step}
            current={mode === 'step' && step.key === stepKey}
          />
        ))}

        {mode === 'after' && (
          <Box
            p="md"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              background: '#fff',
            }}
          >
            <Text fw={600} mb={6}>What would have happened had someone done less?</Text>
            <Text size="sm" c="dimmed">
              Please answer the questions in the sidebar. These compare stopping early,
              checking only the source, or going straight to a detection tool.
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
