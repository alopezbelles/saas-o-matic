import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import type { SaveState } from '../useSimulationSave';
import { formatDate, formatEuro } from '../../customers/format';
import styles from '../../customers/components/Customers.module.css';

const labels = {
  users: 'Usuarios activos',
  storageGb: 'Almacenamiento contratado (GB)',
  apiCalls: 'Llamadas API estimadas',
};
export function SimulationSaveFeedback({
  state,
  customerId,
  inputPrefix,
}: {
  state: SaveState;
  customerId: string | null;
  inputPrefix: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === 'success' || state.status === 'error')
      ref.current?.focus();
  }, [state]);
  if (state.status === 'pending')
    return <p role="status">Guardando simulación…</p>;
  if (state.status === 'idle') return null;
  if (state.status === 'success')
    return (
      <div className={styles.status} role="status" tabIndex={-1} ref={ref}>
        <p>
          <strong>Simulación guardada correctamente.</strong>
        </p>
        <p>
          Guardada para {state.result.customerSnapshot.companyName} el{' '}
          <time dateTime={state.result.createdAt}>
            {formatDate(state.result.createdAt)}
          </time>
          .
        </p>
        {state.changed && (
          <p>
            El servidor ha actualizado el presupuesto. Total previo:{' '}
            {formatEuro(state.previous.totalCents)}. Total guardado:{' '}
            {formatEuro(state.result.totalCents)}. Se muestra el cálculo
            definitivo guardado.
          </p>
        )}
      </div>
    );
  return (
    <div className={styles.status} role="alert" tabIndex={-1} ref={ref}>
      <p>{state.failure.message}</p>
      {Object.keys(state.failure.fields).length > 0 && (
        <ul>
          {Object.entries(state.failure.fields).map(([field, message]) => (
            <li key={field}>
              <a href={'#' + inputPrefix + '-' + field}>
                {labels[field as keyof typeof labels]}: {message}
              </a>
            </li>
          ))}
        </ul>
      )}
      {state.failure.uncertain && customerId && (
        <Link
          to={'/customers/' + customerId}
          target="_blank"
          rel="noopener noreferrer"
        >
          Comprobar historial en una nueva pestaña
        </Link>
      )}
    </div>
  );
}
