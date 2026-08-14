import {
  Alert, Paper, Stack, Text, Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export function ScenarioPanel({ title, scenario }: { title: string; scenario: string }) {
  return (
    <Paper withBorder p="md" radius="md" bg="defakeTeal.0">
      <Stack gap="xs">
        <Title order={4}>{title}</Title>
        <Text size="sm">{scenario}</Text>
        <Alert color="yellow" variant="light" icon={<IconAlertCircle size={16} />} p="xs">
          <Text size="xs">
            You do not need to open every section. Stop when you are confident enough to answer.
          </Text>
        </Alert>
      </Stack>
    </Paper>
  );
}
