import { useId, type ReactNode } from 'react';
import { CONSUMPTION_LIMITS } from '@saas-o-matic/shared';
import { formatCount } from '../../customers/format';
import {
  parseConsumptionField,
  type ConsumptionDraft,
  type ConsumptionField,
} from '../consumption';
import styles from './ConsumptionInputs.module.css';
import shared from '../../customers/components/Customers.module.css';

const fields = [
  { key: 'users', label: 'Usuarios activos', suffix: 'usuarios' },
  { key: 'storageGb', label: 'Almacenamiento contratado (GB)', suffix: 'GB' },
  { key: 'apiCalls', label: 'Llamadas API estimadas', suffix: 'llamadas' },
] as const;

export function ConsumptionInputs({
  draft,
  sliderValue,
  disabled,
  onChange,
  children,
}: {
  draft: ConsumptionDraft;
  sliderValue: number;
  disabled: boolean;
  onChange: (field: ConsumptionField, value: string) => void;
  children?: ReactNode;
}) {
  const prefix = useId();
  return (
    <section className={styles.panel} aria-labelledby={prefix + '-heading'}>
      <h2 id={prefix + '-heading'}>Consumo estimado</h2>
      <div className={styles.body}>
        <fieldset className={styles.fields} disabled={disabled}>
          <legend className={shared.srOnly}>Consumos de la simulación</legend>
          {fields.map(({ key, label, suffix }) => {
            const invalid = parseConsumptionField(draft[key], key) === null;
            const fieldId = prefix + '-' + key;
            return (
              <div key={key} className={styles.field}>
                <label htmlFor={fieldId}>{label}</label>
                <div className={key === 'users' ? styles.usersRow : undefined}>
                  {key === 'users' && (
                    <>
                      <label
                        className={shared.srOnly}
                        htmlFor={prefix + '-slider'}
                      >
                        Usuarios activos (deslizador)
                      </label>
                      <input
                        className={styles.slider}
                        id={prefix + '-slider'}
                        type="range"
                        min={0}
                        max={CONSUMPTION_LIMITS.users}
                        step={1}
                        value={sliderValue}
                        aria-valuetext={
                          invalid
                            ? 'Último valor válido: ' +
                              sliderValue +
                              ' usuarios'
                            : sliderValue + ' usuarios'
                        }
                        aria-describedby={
                          invalid ? fieldId + '-error' : fieldId + '-hint'
                        }
                        onChange={(event) =>
                          onChange('users', event.target.value)
                        }
                      />
                    </>
                  )}
                  <input
                    className={styles.control}
                    id={fieldId}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    required
                    autoComplete="off"
                    value={draft[key]}
                    aria-invalid={invalid}
                    aria-describedby={
                      fieldId +
                      '-hint' +
                      (invalid ? ' ' + fieldId + '-error' : '')
                    }
                    onChange={(event) => onChange(key, event.target.value)}
                  />
                </div>
                <p className={styles.hint} id={fieldId + '-hint'}>
                  De 0 a {formatCount(CONSUMPTION_LIMITS[key])} {suffix}, sin
                  decimales.
                </p>
                {invalid && (
                  <p className={styles.error} id={fieldId + '-error'}>
                    Introduce un entero entre 0 y{' '}
                    {formatCount(CONSUMPTION_LIMITS[key])}.
                  </p>
                )}
              </div>
            );
          })}
        </fieldset>
        <p className={styles.hint}>
          El almacenamiento y las llamadas API se registran como consumo; no
          añaden cargos a la tarifa por usuarios.
        </p>
        {children}
      </div>
    </section>
  );
}
