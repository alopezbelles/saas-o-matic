import { useState } from 'react';
import {
  parseConsumptionDraft,
  parseConsumptionField,
  type ConsumptionDraft,
  type ConsumptionField,
} from './consumption';

export function useConsumptionDraft() {
  const [draft, setDraft] = useState<ConsumptionDraft>({
    users: '0',
    storageGb: '0',
    apiCalls: '0',
  });
  const [sliderValue, setSliderValue] = useState(0);
  return {
    draft,
    sliderValue,
    consumption: parseConsumptionDraft(draft),
    reset() {
      setDraft({ users: '0', storageGb: '0', apiCalls: '0' });
      setSliderValue(0);
    },
    setField(field: ConsumptionField, value: string) {
      setDraft((previous) => ({ ...previous, [field]: value }));
      const parsed = parseConsumptionField(value, field);
      if (field === 'users' && parsed !== null) setSliderValue(parsed);
    },
  };
}
