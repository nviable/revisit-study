import { useEffect, useState } from 'react';
import {
  Button, Group, Modal, Stack, Text, Title, List, ThemeIcon, Divider, Box,
} from '@mantine/core';
import {
  BookOpenCheck, ScanSearch, ShieldAlert, PauseCircle, Link2, FileSearch, Scale, RefreshCw,
} from 'lucide-react';
import { STOPSCAN_OVERVIEW, REFERENCE_CARDS } from './content';

type ModalId = 'stopscan' | 'sift' | 'detector';

type ReferenceHelpersProps = {
  onLog: (type: 'modal_open' | 'modal_close', id: string) => void;
  onReady?: () => void;
  compact?: boolean;
};

const ELEMENT_ICONS = {
  stop: PauseCircle,
  source: Link2,
  content: FileSearch,
  alignment: Scale,
  reflect: RefreshCw,
} as const;

export function ReferenceHelpers({ onLog, onReady, compact = false }: ReferenceHelpersProps) {
  const [opened, setOpened] = useState<ModalId | null>(null);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  const openModal = (id: ModalId) => {
    setOpened(id);
    onLog('modal_open', id);
  };

  const closeModal = () => {
    if (opened) {
      onLog('modal_close', opened);
    }
    setOpened(null);
  };

  return (
    <>
      <Box
        mb="md"
        p={compact ? 'sm' : 'md'}
        style={{
          background: 'linear-gradient(135deg, #f7fafc 0%, #eef5f8 100%)',
          border: '1px solid #d7e2ea',
          borderRadius: 10,
        }}
      >
        <Text size="sm" c="dimmed" mb={8}>
          Reference
        </Text>
        <Group gap="xs" wrap="wrap">
          <Button
            variant="light"
            color="teal"
            size="xs"
            leftSection={<BookOpenCheck size={14} />}
            onClick={() => openModal('stopscan')}
          >
            STOP&SCAN
          </Button>
          <Button
            variant="light"
            color="blue"
            size="xs"
            leftSection={<ScanSearch size={14} />}
            onClick={() => openModal('sift')}
          >
            SIFT / Four Moves
          </Button>
          <Button
            variant="light"
            color="orange"
            size="xs"
            leftSection={<ShieldAlert size={14} />}
            onClick={() => openModal('detector')}
          >
            Detector / provenance
          </Button>
        </Group>
      </Box>

      <Modal
        opened={opened === 'stopscan'}
        onClose={closeModal}
        title="STOP&SCAN"
        size="lg"
        centered
      >
        <Stack gap="md">
          <Text size="sm">{STOPSCAN_OVERVIEW.intro}</Text>
          <Stack gap="sm">
            {STOPSCAN_OVERVIEW.elements.map((el) => {
              const Icon = ELEMENT_ICONS[el.id as keyof typeof ELEMENT_ICONS];
              return (
                <Group key={el.id} align="flex-start" wrap="nowrap" gap="sm">
                  <ThemeIcon variant="light" color="teal" radius="xl">
                    <Icon size={16} />
                  </ThemeIcon>
                  <Box>
                    <Text fw={600} size="sm">{el.title}</Text>
                    <Text size="sm">{el.body}</Text>
                  </Box>
                </Group>
              );
            })}
          </Stack>
          <Divider />
          <div>
            <Text fw={600} size="sm" mb={4}>Outcomes</Text>
            <List size="sm" spacing={4}>
              {STOPSCAN_OVERVIEW.outcomes.map((o) => (
                <List.Item key={o}>{o}</List.Item>
              ))}
            </List>
          </div>
          <div>
            <Title order={5}>{STOPSCAN_OVERVIEW.coverageRule.title}</Title>
            {STOPSCAN_OVERVIEW.coverageRule.paragraphs.map((p) => (
              <Text key={p.slice(0, 24)} size="sm" mt="xs">{p}</Text>
            ))}
          </div>
        </Stack>
      </Modal>

      <Modal
        opened={opened === 'sift'}
        onClose={closeModal}
        title={REFERENCE_CARDS.sift.title}
        size="lg"
        centered
      >
        <Text size="sm">{REFERENCE_CARDS.sift.body}</Text>
      </Modal>

      <Modal
        opened={opened === 'detector'}
        onClose={closeModal}
        title={REFERENCE_CARDS.detector.title}
        size="lg"
        centered
      >
        <Text size="sm">{REFERENCE_CARDS.detector.body}</Text>
      </Modal>
    </>
  );
}
