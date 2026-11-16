import { useCallback, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { listSimulations } from '../api/simulations';
import { ApiRequestError } from '../api/http';
import { useApiResource } from '../useApiResource';
import {
  HISTORY_PAGE_SIZE,
  historySearch,
  nextHistoryPageAllowed,
  parseHistoryLocation,
} from '../detail-location';
import { formatCount, formatDate, formatEuro } from '../format';
import styles from './Customers.module.css';
import detail from './SimulationHistory.module.css';

export function SimulationHistory({ customerId }: { customerId: string }) {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const query = useMemo(() => {
    try {
      return parseHistoryLocation(location.search);
    } catch {
      return null;
    }
  }, [location.search]);
  const load = useCallback(
    (signal: AbortSignal) => listSimulations(customerId, query!, signal),
    [customerId, query],
  );
  const { state, retry } = useApiResource(
    JSON.stringify([customerId, query]),
    query ? load : null,
  );
  const changePage = (offset: number) =>
    setSearchParams(historySearch(offset), { state: location.state });

  return (
    <section className={detail.history} aria-labelledby="history-heading">
      <h2 id="history-heading">Historial de simulaciones</h2>
      {!query ? (
        <div className={styles.status} role="alert">
          <p>La dirección contiene parámetros de historial no válidos.</p>
          <button className={styles.button} onClick={() => changePage(0)}>
            Restablecer historial
          </button>
        </div>
      ) : state.status === 'loading' ? (
        <p role="status">Cargando historial…</p>
      ) : state.status === 'error' ? (
        <div className={styles.status} role="alert">
          <p>
            {state.error instanceof ApiRequestError &&
            state.error.status === 404
              ? 'El historial de este cliente ya no está disponible.'
              : 'No se ha podido cargar el historial. Los datos del cliente siguen disponibles.'}
          </p>
          <button className={styles.button} onClick={retry}>
            Reintentar historial
          </button>
        </div>
      ) : (
        <>
          <p role="status">
            {state.value.total}{' '}
            {state.value.total === 1 ? 'simulación' : 'simulaciones'}
          </p>
          {state.value.items.length ? (
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                Simulaciones guardadas del cliente, importes en EUR
              </caption>
              <thead>
                <tr>
                  {[
                    'Fecha',
                    'Usuarios',
                    'Almacenamiento',
                    'Llamadas API',
                    'Divisa',
                    'Total mensual',
                  ].map((label) => (
                    <th key={label} scope="col">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {state.value.items.map((simulation) => (
                  <tr key={simulation.id}>
                    <td data-label="Fecha">
                      <time dateTime={simulation.createdAt}>
                        {formatDate(simulation.createdAt)}
                      </time>
                    </td>
                    <td data-label="Usuarios">
                      {formatCount(simulation.users)}
                    </td>
                    <td data-label="Almacenamiento">
                      {formatCount(simulation.storageGb)} GB
                    </td>
                    <td data-label="Llamadas API">
                      {formatCount(simulation.apiCalls)}
                    </td>
                    <td data-label="Divisa">{simulation.currency}</td>
                    <td data-label="Total mensual" className={detail.amount}>
                      {formatEuro(simulation.totalCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.status}>
              <p>
                {query.offset > 0
                  ? 'No hay simulaciones en esta página.'
                  : 'Este cliente todavía no tiene simulaciones guardadas.'}
              </p>
              {query.offset > 0 && (
                <button className={styles.button} onClick={() => changePage(0)}>
                  Volver a la primera página
                </button>
              )}
            </div>
          )}
          <nav
            className={styles.pagination}
            aria-label="Paginación del historial"
          >
            <p>
              {state.value.items.length
                ? `Mostrando ${query.offset + 1}–${query.offset + state.value.items.length} de ${state.value.total}`
                : 'Sin resultados en esta página'}
            </p>
            <div className={styles.pageActions}>
              <button
                className={styles.button}
                disabled={query.offset === 0}
                onClick={() =>
                  changePage(Math.max(0, query.offset - HISTORY_PAGE_SIZE))
                }
              >
                Anterior
              </button>
              <button
                className={styles.button}
                disabled={
                  !nextHistoryPageAllowed(query.offset, state.value.total)
                }
                onClick={() => changePage(query.offset + HISTORY_PAGE_SIZE)}
              >
                Siguiente
              </button>
            </div>
          </nav>
        </>
      )}
    </section>
  );
}
