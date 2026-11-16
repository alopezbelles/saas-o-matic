import { useCallback, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { parseCustomerId } from '@saas-o-matic/shared';
import { getCustomer } from '../../customers/api/customers';
import {
  getBillingConfiguration,
  isBillingConfigurationCompatible,
} from '../../customers/api/billing-configuration';
import { ApiRequestError } from '../../customers/api/http';
import { useApiResource } from '../../customers/useApiResource';
import { useConsumptionDraft } from '../useConsumptionDraft';
import { ConsumptionInputs } from '../components/ConsumptionInputs';
import { simulationReturn } from '../simulation-location';
import { customersReturnTo } from '../../customers/list-location';
import { countryLabel, PLAN_LABELS } from '../../customers/customer-labels';
import styles from '../../customers/components/Customers.module.css';
import layout from '../../../app/AppLayout.module.css';

export function SimulationCreatePage() {
  const { id } = useParams();
  return <SimulationSetup key={id ?? ''} />;
}

function SimulationSetup() {
  const { id: rawId } = useParams();
  const location = useLocation();
  const id = useMemo(() => {
    try {
      return parseCustomerId(rawId);
    } catch {
      return null;
    }
  }, [rawId]);
  const loadCustomer = useCallback(
    (signal: AbortSignal) => getCustomer(id!, signal),
    [id],
  );
  const loadConfig = useCallback(
    (signal: AbortSignal) => getBillingConfiguration(signal),
    [],
  );
  const customer = useApiResource(id ?? '', id ? loadCustomer : null);
  const config = useApiResource(id ?? '', id ? loadConfig : null);
  const { draft, sliderValue, setField } = useConsumptionDraft();
  const compatible =
    config.state.status === 'success' &&
    isBillingConfigurationCompatible(config.state.value);
  const supported =
    customer.state.status === 'success' &&
    config.state.status === 'success' &&
    Object.hasOwn(
      config.state.value.ratesByCountry,
      customer.state.value.countryCode,
    );
  const ready =
    id !== null &&
    customer.state.status === 'success' &&
    compatible &&
    supported;
  const back = id ? simulationReturn(id, location.state) : null;

  return (
    <section className={layout.page} aria-labelledby="page-heading">
      <div className={layout.intro}>
        <h1 id="page-heading" tabIndex={-1}>
          Simular suscripción
        </h1>
        <p className={layout.description}>
          Introduce el consumo estimado de tu cliente.
        </p>
        {customer.state.status === 'success' && (
          <p>
            {customer.state.value.companyName} ·{' '}
            {countryLabel(customer.state.value.countryCode)} ·{' '}
            {PLAN_LABELS[customer.state.value.planCode]}
          </p>
        )}
      </div>
      {!id ? (
        <p className={styles.status} role="alert">
          El identificador del cliente no es válido.
        </p>
      ) : customer.state.status === 'loading' ? (
        <p className={styles.status} role="status">
          Cargando cliente…
        </p>
      ) : customer.state.status === 'error' ? (
        <div className={styles.status} role="alert">
          <p>
            {customer.state.error instanceof ApiRequestError &&
            customer.state.error.status === 404
              ? 'No se ha encontrado el cliente.'
              : 'No se han podido cargar los datos del cliente.'}
          </p>
          {!(
            customer.state.error instanceof ApiRequestError &&
            customer.state.error.status === 404
          ) && (
            <button className={styles.button} onClick={customer.retry}>
              Reintentar cliente
            </button>
          )}
        </div>
      ) : null}
      {id &&
        customer.state.status !== 'error' &&
        (config.state.status === 'loading' ? (
          <p className={styles.status} role="status">
            Cargando configuración…
          </p>
        ) : config.state.status === 'error' ? (
          <div className={styles.status} role="alert">
            <p>
              No se ha podido cargar una configuración válida. Tus consumos se
              conservan.
            </p>
            <button className={styles.button} onClick={config.retry}>
              Reintentar configuración
            </button>
          </div>
        ) : !compatible ? (
          <div className={styles.status} role="alert">
            <p>
              La configuración del servidor no es compatible con esta versión de
              la aplicación. Recarga la aplicación para obtener la versión
              actualizada.
            </p>
            <button
              className={styles.button}
              onClick={() => globalThis.location.reload()}
            >
              Recargar aplicación
            </button>
            <button className={styles.button} onClick={config.retry}>
              Reintentar configuración
            </button>
          </div>
        ) : customer.state.status === 'success' && !supported ? (
          <p className={styles.status} role="alert">
            El país de este cliente no tiene una tarifa configurada. Puedes
            consultar su ficha e historial, pero no simular con la configuración
            actual.
          </p>
        ) : null)}
      <ConsumptionInputs
        draft={draft}
        sliderValue={sliderValue}
        disabled={!ready}
        onChange={setField}
      />
      {back ? (
        <Link to={back.to} state={back.state}>
          Volver al cliente
        </Link>
      ) : (
        <Link to={customersReturnTo(location.state)}>Volver a clientes</Link>
      )}
    </section>
  );
}
