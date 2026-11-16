import { useCallback, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { parseCustomerId } from '@saas-o-matic/shared';
import { getCustomer } from '../api/customers';
import { ApiRequestError } from '../api/http';
import { useApiResource } from '../useApiResource';
import { customersReturnTo } from '../list-location';
import { countryLabel, PLAN_LABELS } from '../customer-labels';
import { CustomerCards } from '../components/CustomerCards';
import { SimulationHistory } from '../components/SimulationHistory';
import styles from '../components/Customers.module.css';
import layout from '../../../app/AppLayout.module.css';

export function CustomerDetailPage() {
  const { id: rawId } = useParams();
  const location = useLocation();
  const id = useMemo(() => {
    try {
      return parseCustomerId(rawId);
    } catch {
      return null;
    }
  }, [rawId]);
  const load = useCallback(
    (signal: AbortSignal) => getCustomer(id!, signal),
    [id],
  );
  const { state, retry } = useApiResource(id ?? '', id ? load : null);
  const created =
    location.state &&
    typeof location.state === 'object' &&
    'createdCustomerId' in location.state &&
    location.state.createdCustomerId === id;
  return (
    <section className={layout.page} aria-labelledby="page-heading">
      <div className={layout.pageHeader}>
        <div className={layout.intro}>
          <h1 id="page-heading" tabIndex={-1}>
            {state.status === 'success'
              ? state.value.companyName
              : 'Ficha del cliente'}
          </h1>
          {state.status === 'success' && (
            <p className={layout.description}>
              {countryLabel(state.value.countryCode)} ·{' '}
              {PLAN_LABELS[state.value.planCode]}
            </p>
          )}
        </div>
        {state.status === 'success' && (
          <Link
            className={layout.action}
            to={'/customers/' + state.value.id + '/simulations/new'}
            state={{
              returnTo: customersReturnTo(location.state),
              customerSearch: location.search,
            }}
          >
            <span className={layout.actionIcon} aria-hidden="true">
              +
            </span>{' '}
            Nueva simulación
          </Link>
        )}
      </div>
      {created && <p role="status">Cliente creado correctamente.</p>}
      {!id ? (
        <div className={styles.status} role="alert">
          <p>El identificador del cliente no es válido.</p>
        </div>
      ) : state.status === 'loading' ? (
        <p className={styles.status} role="status">
          Cargando cliente…
        </p>
      ) : state.status === 'error' ? (
        <div className={styles.status} role="alert">
          <p>
            {state.error instanceof ApiRequestError &&
            state.error.status === 404
              ? 'No se ha encontrado el cliente.'
              : 'No se han podido cargar los datos del cliente. Inténtalo de nuevo.'}
          </p>
          {!(
            state.error instanceof ApiRequestError && state.error.status === 404
          ) && (
            <button className={styles.button} onClick={retry}>
              Reintentar cliente
            </button>
          )}
        </div>
      ) : (
        <>
          <CustomerCards customer={state.value} />
          <SimulationHistory customerId={state.value.id} />
        </>
      )}
      <Link to={customersReturnTo(location.state)}>Volver a clientes</Link>
    </section>
  );
}
