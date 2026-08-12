import { useEffect, useRef } from 'react';
import {
  Accordion, Box, Group, List, Stack, Text, ThemeIcon, Title,
} from '@mantine/core';
import {
  IconBook2,
  IconLink,
  IconFileSearch,
  IconScale,
  IconRefresh,
  IconPlayerPause,
  IconSearch,
  IconShieldExclamation,
} from '@tabler/icons-react';
import { StimulusParams } from '../../../store/types';
import {
  STOPSCAN_OVERVIEW, WHAT_YOU_WILL_DO, REFERENCE_CARDS,
} from './content';
import { useInteractionLog } from './useInteractionLog';

const ELEMENT_ICONS = {
  stop: IconPlayerPause,
  source: IconLink,
  content: IconFileSearch,
  alignment: IconScale,
  reflect: IconRefresh,
} as const;

export default function Orientation({ setAnswer }: StimulusParams<Record<string, never>>) {
  const { logEvent, ensureSeeded } = useInteractionLog(setAnswer);
  const openRef = useRef<string[]>([]);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  return (
    <Box maw={820} mx="auto" p="md">
      <Stack gap="lg">
        <div>
          <Group gap="xs" mb={6}>
            <ThemeIcon color="teal" variant="light" radius="xl">
              <IconBook2 size={18} />
            </ThemeIcon>
            <Title order={2}>Orientation</Title>
          </Group>
          <Text c="dimmed" size="sm">
            Read the framework below. Open the reference cards only if you want them.
          </Text>
        </div>

        <Box
          p="md"
          style={{
            background: 'linear-gradient(160deg, #f4fbf8 0%, #eef6f9 100%)',
            border: '1px solid #d5e6df',
            borderRadius: 12,
          }}
        >
          <Title order={3} mb="sm">The framework being evaluated</Title>
          <Text mb="md">{STOPSCAN_OVERVIEW.intro}</Text>
          <Stack gap="sm">
            {STOPSCAN_OVERVIEW.elements.map((el) => {
              const Icon = ELEMENT_ICONS[el.id as keyof typeof ELEMENT_ICONS];
              return (
                <Group key={el.id} align="flex-start" wrap="nowrap" gap="sm">
                  <ThemeIcon variant="filled" color="teal" radius="xl">
                    <Icon size={16} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={700}>{el.title}</Text>
                    <Text size="sm">{el.body}</Text>
                  </Box>
                </Group>
              );
            })}
          </Stack>
          <Text fw={600} mt="md" mb={4}>Three outcomes are available, and all three are legitimate endpoints:</Text>
          <List size="sm" spacing={4}>
            {STOPSCAN_OVERVIEW.outcomes.map((o) => (
              <List.Item key={o}>{o}</List.Item>
            ))}
          </List>
        </Box>

        <Box
          p="md"
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            background: '#fff',
          }}
        >
          <Title order={4} mb="xs">{STOPSCAN_OVERVIEW.coverageRule.title}</Title>
          {STOPSCAN_OVERVIEW.coverageRule.paragraphs.map((p) => (
            <Text key={p.slice(0, 32)} size="sm" mb="sm">{p}</Text>
          ))}
        </Box>

        <Box
          p="md"
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            background: '#fff',
          }}
        >
          <Title order={4} mb="sm">What you will be doing</Title>
          <Stack gap="sm">
            {WHAT_YOU_WILL_DO.map((p) => (
              <Text key={p.slice(0, 40)} size="sm">{p}</Text>
            ))}
          </Stack>
        </Box>

        <div>
          <Title order={4} mb="xs">Reference cards</Title>
          <Text size="sm" c="dimmed" mb="sm">
            Collapsed by default. Open them if you want them; most participants will not need to.
          </Text>
          <Accordion
            multiple
            variant="separated"
            radius="md"
            defaultValue={[]}
            onChange={(values) => {
              const opened = Array.isArray(values) ? values : [];
              opened.forEach((value) => {
                if (!openRef.current.includes(value)) {
                  logEvent('accordion_open', value === 'sift' ? 'card_sift' : 'card_detector');
                }
              });
              openRef.current = opened;
            }}
          >
            <Accordion.Item value="sift">
              <Accordion.Control icon={<IconSearch size={16} />}>
                Card 1 — {REFERENCE_CARDS.sift.title}
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">{REFERENCE_CARDS.sift.body}</Text>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="detector">
              <Accordion.Control icon={<IconShieldExclamation size={16} />}>
                Card 2 — {REFERENCE_CARDS.detector.title}
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">{REFERENCE_CARDS.detector.body}</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      </Stack>
    </Box>
  );
}
