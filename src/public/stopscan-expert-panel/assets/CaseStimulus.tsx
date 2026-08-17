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
            Example reasoning: Step {step.stepIndex} of 4 — {step.label}
          </Text>
        </Group>
        {!current && (
          <Badge size="xs" variant="outline" color="gray">Earlier step</Badge>
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
        {mode === 'step' && stepKey === 'source' && caseId === 'case1' && (
          <Box
            p="md"
            style={{
              background: '#f0f7ff',
              border: '1px solid #cfe0f2',
              borderRadius: 12,
            }}
          >
            <Text fw={700} mb={6}>Your first case</Text>
            <Text size="sm">
              You will now review the first of four real cases. We will show how someone
              might use STOP&SCAN, one step at a time. After each step, tell us whether
              the reasoning seems fair and useful. You are reviewing our example—not
              solving the case yourself.
            </Text>
          </Box>
        )}
        {mode === 'step' && stepKey === 'source' && caseId !== 'case1' && (
          <Box
            p="sm"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
            }}
          >
            <Text size="sm">
              This is the next real case. As before, review the example reasoning rather
              than solving the case yourself.
            </Text>
          </Box>
        )}
        <div>
          <Group gap="xs" mb={4}>
            <Badge color="teal" variant="light">{caseContent.shortLabel}</Badge>
            {mode === 'step' && stepKey && (
              <Badge color="gray" variant="outline">
                Reviewing: {caseContent.steps.find((s) => s.key === stepKey)?.label}
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
            <Text fw={600} size="sm">What happened</Text>
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
            <Text fw={600} mb={6}>What if someone had stopped earlier?</Text>
            <Text size="sm" c="dimmed">
              Now think about what might have happened if the person had stopped earlier
              or relied on only one kind of check. Please answer the questions in the sidebar.
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
