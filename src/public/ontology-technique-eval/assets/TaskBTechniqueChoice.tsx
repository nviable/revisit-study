import {
  Radio, Stack, Text,
} from '@mantine/core';
import { useMemo } from 'react';
import { useCurrentComponent } from '../../../routes/utils';
import { useStudyConfig } from '../../../store/hooks/useStudyConfig';
import type { CustomResponseParams, CustomResponseValidate } from '../../../store/types';
import { getComponent } from '../../../utils/handleComponentInheritance';
import {
  getTaskBTechniqueChoices,
  isTaskBTechniqueId,
  vignetteIdFromParameters,
} from './taskBChoices';

export const validate: CustomResponseValidate = (value) => (
  isTaskBTechniqueId(value)
    ? null
    : 'Select the technique that fits this case.'
);

export default function TaskBTechniqueChoice({
  response,
  value,
  error,
  disabled,
  index,
  enumerateQuestions,
  field,
}: CustomResponseParams<Record<string, never>, string>) {
  const currentComponent = useCurrentComponent();
  const studyConfig = useStudyConfig();
  const choices = useMemo(() => {
    const component = getComponent(currentComponent, studyConfig);
    const parameters = component && 'parameters' in component ? component.parameters : undefined;
    return getTaskBTechniqueChoices(vignetteIdFromParameters(parameters));
  }, [currentComponent, studyConfig]);
  const selected = typeof value === 'string' ? value : '';

  return (
    <Stack gap="xs">
      <div>
        <Text fw={600}>
          {enumerateQuestions && `${index}. `}
          {response.prompt}
          {response.required !== false && <Text span c="red"> *</Text>}
        </Text>
        <Text size="sm" c="dimmed" mt={4}>
          {response.secondaryText || 'The numbers match the numbered cards in the main area.'}
        </Text>
      </div>

      <Radio.Group
        name={`taskBTechniqueChoice-${response.id}`}
        value={selected}
        onChange={(nextValue) => {
          field.setValue(nextValue);
          field.onBlur();
        }}
        error={error}
        errorProps={{ c: 'red' }}
      >
        <Stack gap="xs" mt={4}>
          {choices.map((choice) => (
            <Radio
              key={choice.value}
              value={choice.value}
              label={choice.label}
              disabled={disabled}
            />
          ))}
        </Stack>
      </Radio.Group>
    </Stack>
  );
}
