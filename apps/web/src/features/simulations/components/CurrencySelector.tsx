import { useId } from 'react';
import { CURRENCY_EXPONENTS, type CurrencyCode } from '@saas-o-matic/shared';
import styles from './ConsumptionInputs.module.css';

export function CurrencySelector({
  currency,
  onChange,
  disabled,
}: {
  currency: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  disabled: boolean;
}) {
  const id = useId();
  return (
    <div className={styles.currency}>
      <label htmlFor={id}>Divisa de visualización</label>
      <select
        className={styles.control}
        id={id}
        value={currency}
        disabled={disabled}
        onChange={(event) => {
          const value = event.target.value;
          if (Object.hasOwn(CURRENCY_EXPONENTS, value))
            onChange(value as CurrencyCode);
        }}
      >
        {Object.keys(CURRENCY_EXPONENTS).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
