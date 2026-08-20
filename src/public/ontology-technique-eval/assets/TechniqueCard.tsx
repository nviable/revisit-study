import {
  Accordion,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconFileText,
  IconFileTypePdf,
  IconInfoCircle,
  IconSparkles,
  IconTags,
} from '@tabler/icons-react';
import {
  useEffect, useMemo, useState,
} from 'react';
import type { MouseEvent } from 'react';
import { PREFIX } from '../../../utils/Prefix';
import {
  getCategoryColor, highlightTerms, resolveTagPath, titlesForTechniqueTags,
} from './ontology';
import { getCardDisclosureState } from './provenance';
import { resolvePaperPath, summaryForFormat } from './studyBank';
import type {
  DescriptionFormat,
  InteractionEvent,
  InteractionRegion,
  ProvenanceState,
  Technique,
} from './types';

interface TechniqueCardProps {
  technique: Technique;
  format: DescriptionFormat;
  compact?: boolean;
  index?: number;
  idPrefix?: string;
  provenanceState?: ProvenanceState;
  onInteract: (event: Omit<InteractionEvent, 'timestamp'>) => void;
}

const tagBadgeStyles = {
  root: {
    textTransform: 'none' as const,
    height: 'auto',
    padding: '6px 12px',
    lineHeight: 1.35,
    whiteSpace: 'normal' as const,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'normal' as const,
  },
};

function OntologyTagChain({
  path,
  technique,
  format,
  cardIndex,
  techniqueId,
  onInteract,
}: {
  path: string[];
  technique: Technique;
  format: DescriptionFormat;
  cardIndex?: number;
  techniqueId: string;
  onInteract: TechniqueCardProps['onInteract'];
}) {
  const terms = resolveTagPath(path);
  if (terms.length === 0) {
    return null;
  }

  return (
    <Group gap={6} wrap="wrap">
      {terms.map((term, index) => (
        <Group key={term.slug} gap={6} wrap="wrap">
          {index > 0 && (
            <Text size="sm" c="dimmed" aria-hidden="true">→</Text>
          )}
          <Tooltip
            label={term.description}
            multiline
            w={280}
            withArrow
            events={{ hover: true, focus: true, touch: true }}
          >
            <Badge
              variant="light"
              color={getCategoryColor(term.slug)}
              size="md"
              styles={tagBadgeStyles}
              style={{ cursor: 'help' }}
              leftSection={<IconInfoCircle size={14} />}
              data-interaction-region="ontology-tag"
              data-interaction-element={`${techniqueId}:tag:${term.slug}`}
              onMouseEnter={() => onInteract({
                type: 'hover',
                elementId: `${techniqueId}:tag:${term.slug}`,
                label: `Hover tag: ${term.title}`,
                techniqueId: technique.id,
                cardId: techniqueId,
                format,
                cardIndex,
                region: 'ontology-tag',
              })}
            >
              {term.title}
            </Badge>
          </Tooltip>
        </Group>
      ))}
    </Group>
  );
}

export function TechniqueCard({
  technique,
  format,
  compact = false,
  index,
  idPrefix,
  provenanceState,
  onInteract,
}: TechniqueCardProps) {
  const [openPanels, setOpenPanels] = useState<string[]>([]);
  const [pdfOpen, setPdfOpen] = useState(false);

  const highlightTitles = useMemo(
    () => titlesForTechniqueTags(technique.ontologyTags.map((tag) => tag.path)),
    [technique.ontologyTags],
  );

  const summaryText = summaryForFormat(technique, format);
  const summarySegments = useMemo(
    () => (format === 'ontology'
      ? highlightTerms(summaryText, highlightTitles)
      : [{ text: summaryText }]),
    [format, highlightTitles, summaryText],
  );

  const cardId = `${idPrefix ? `${idPrefix}:` : ''}${technique.id}${index != null ? `-${index}` : ''}`;

  useEffect(() => {
    if (provenanceState) {
      const replayState = getCardDisclosureState(provenanceState, cardId);
      setOpenPanels(replayState.openPanels);
      setPdfOpen(replayState.pdfOpen);
    }
  }, [cardId, provenanceState]);

  const eventMetadata = (region: InteractionRegion) => ({
    techniqueId: technique.id,
    cardId,
    format,
    cardIndex: index,
    region,
  });

  const recordCardClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target instanceof HTMLElement
      ? event.target.closest<HTMLElement>('[data-interaction-region]')
      : null;
    const region = (target?.dataset.interactionRegion as InteractionRegion | undefined) ?? 'card';
    const elementId = target?.dataset.interactionElement ?? `${cardId}:${region}`;
    onInteract({
      type: 'click',
      elementId,
      label: `Click ${region}: ${technique.title}`,
      ...eventMetadata(region),
    });
  };

  const togglePanel = (nextValue: string | string[] | null) => {
    const next = Array.isArray(nextValue) ? nextValue : (nextValue ? [nextValue] : []);
    const closed = openPanels.filter((value) => !next.includes(value));
    const opened = next.filter((value) => !openPanels.includes(value));

    closed.forEach((value) => {
      onInteract({
        type: 'close',
        elementId: `${cardId}:${value}`,
        label: `Close ${value} (${technique.title})`,
        ...eventMetadata(value as 'abstract' | 'summary'),
      });
    });
    opened.forEach((value) => {
      onInteract({
        type: 'open',
        elementId: `${cardId}:${value}`,
        label: `Open ${value} (${technique.title})`,
        ...eventMetadata(value as 'abstract' | 'summary'),
      });
    });
    if (opened.length === 0 && closed.length === 0) {
      onInteract({
        type: 'click',
        elementId: `${cardId}:accordion`,
        label: `Accordion click (${technique.title})`,
        ...eventMetadata('card'),
      });
    }
    setOpenPanels(next);
  };

  const openPdf = () => {
    if (!pdfOpen) {
      onInteract({
        type: 'open',
        elementId: `${cardId}:full-paper`,
        label: `Open full paper (${technique.title})`,
        ...eventMetadata('full-paper'),
      });
    }
    setPdfOpen(true);
  };

  const closePdf = () => {
    if (pdfOpen) {
      onInteract({
        type: 'close',
        elementId: `${cardId}:full-paper`,
        label: `Close full paper (${technique.title})`,
        ...eventMetadata('full-paper'),
      });
    }
    setPdfOpen(false);
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      p={compact ? 'sm' : 'md'}
      radius="md"
      w="100%"
      style={{ minWidth: 0, overflow: 'hidden' }}
      onClickCapture={recordCardClick}
    >
      <Stack gap={compact ? 'xs' : 'sm'}>
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
          <Title
            order={compact ? 5 : 4}
            data-interaction-region="title"
            data-interaction-element={`${cardId}:title`}
            style={{ lineHeight: 1.3, overflowWrap: 'anywhere' }}
          >
            {technique.title}
          </Title>
          {index != null && (
            <Badge circle color="defakeTeal" variant="filled" size="lg">{index}</Badge>
          )}
        </Group>

        {format === 'keywords' ? (
          <Box>
            <Group gap={6} mb={6}>
              <IconTags size={16} />
              <Text size="sm" fw={600} tt="uppercase" c="dimmed">Keywords</Text>
            </Group>
            <Group gap={8}>
              {technique.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  color="gray"
                  size="md"
                  styles={tagBadgeStyles}
                  data-interaction-region="keyword"
                  data-interaction-element={`${cardId}:keyword:${keyword}`}
                >
                  {keyword}
                </Badge>
              ))}
            </Group>
          </Box>
        ) : (
          <Box>
            <Group gap={6} mb={6}>
              <IconInfoCircle size={16} />
              <Text size="sm" fw={600} tt="uppercase" c="dimmed">Structured tags</Text>
            </Group>
            <Stack gap={8}>
              {technique.ontologyTags.map((tag) => (
                <OntologyTagChain
                  key={tag.path.join('>')}
                  path={tag.path}
                  technique={technique}
                  format={format}
                  cardIndex={index}
                  techniqueId={cardId}
                  onInteract={onInteract}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Accordion
          multiple
          variant="separated"
          chevronPosition="right"
          value={openPanels}
          onChange={togglePanel}
          styles={{
            item: { overflow: 'hidden' },
            control: { paddingTop: compact ? 8 : 12, paddingBottom: compact ? 8 : 12 },
            content: { fontSize: compact ? 13 : 14 },
            panel: { overflowWrap: 'anywhere' },
          }}
        >
          <Accordion.Item value="abstract">
            <Accordion.Control
              icon={<IconFileText size={16} />}
              data-interaction-region="abstract"
              data-interaction-element={`${cardId}:abstract`}
            >
              Abstract
            </Accordion.Control>
            <Accordion.Panel
              data-interaction-region="abstract"
              data-interaction-element={`${cardId}:abstract`}
            >
              <Text size="sm">{technique.abstract}</Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="summary">
            <Accordion.Control
              icon={<IconSparkles size={16} />}
              data-interaction-region="summary"
              data-interaction-element={`${cardId}:summary`}
            >
              Plain-language summary
            </Accordion.Control>
            <Accordion.Panel
              data-interaction-region="summary"
              data-interaction-element={`${cardId}:summary`}
            >
              <Text size="sm">
                {summarySegments.map((segment, segmentIndex) => (
                  segment.matchedTitle ? (
                    <Tooltip
                      key={`hl-${segmentIndex}`}
                      label={segment.description || segment.matchedTitle}
                      multiline
                      w={280}
                      withArrow
                    >
                      <Text
                        span
                        fw={600}
                        c={`${segment.color ?? 'defakeTeal'}.8`}
                        data-interaction-region="summary-tag"
                        data-interaction-element={`${cardId}:summary-tag:${segment.termSlug ?? segmentIndex}`}
                        onMouseEnter={() => onInteract({
                          type: 'hover',
                          elementId: `${cardId}:summary-tag:${segment.termSlug ?? segmentIndex}`,
                          label: `Hover summary tag: ${segment.matchedTitle}`,
                          ...eventMetadata('summary-tag'),
                        })}
                        style={{
                          background: `var(--mantine-color-${segment.color ?? 'defakeTeal'}-1)`,
                          cursor: 'help',
                        }}
                      >
                        {segment.text}
                      </Text>
                    </Tooltip>
                  ) : (
                    <Text span key={`txt-${segmentIndex}`}>{segment.text}</Text>
                  )
                ))}
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Button
          variant="light"
          color="defakeTeal"
          leftSection={<IconFileTypePdf size={16} />}
          data-interaction-region="full-paper"
          data-interaction-element={`${cardId}:full-paper`}
          onClick={openPdf}
          fullWidth
        >
          Full paper
        </Button>
      </Stack>

      <Modal
        opened={pdfOpen}
        onClose={closePdf}
        title={technique.title}
        size="90%"
        centered
      >
        <Box h="75vh">
          <iframe
            title={`Full paper: ${technique.title}`}
            src={resolvePaperPath(technique.pdfPath, PREFIX)}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </Box>
      </Modal>
    </Paper>
  );
}
