import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router';
import {
  PLAN_CODES,
  type CreateCustomer,
  type CustomerDto,
} from '@saas-o-matic/shared';
import { CUSTOMER_FIELD_LABELS, PLAN_LABELS } from '../customer-labels';
import { useCustomerCountries } from '../useCustomerCountries';
import { useCustomerCreation } from '../useCustomerCreation';
import { listSearch } from '../list-location';
import styles from './CustomerForm.module.css';
import shared from './Customers.module.css';
import layout from '../../../app/AppLayout.module.css';

const textFields = [
  {
    name: 'companyName',
    type: 'text',
    autoComplete: 'organization',
    maxLength: 200,
  },
  { name: 'taxId', type: 'text', autoComplete: 'off', maxLength: 64 },
  {
    name: 'contactEmail',
    type: 'email',
    autoComplete: 'email',
    maxLength: 254,
  },
] as const;

export function CustomerForm({
  onCreated,
  onCancel,
}: {
  onCreated: (customer: CustomerDto) => void;
  onCancel: () => void;
}) {
  const countries = useCustomerCountries();
  const { values, failure, pending, submit, setField } = useCustomerCreation(
    countries.countries,
    onCreated,
  );
  const prefix = useId();
  const summary = useRef<HTMLDivElement>(null);
  const fieldId = (name: keyof CreateCustomer) => prefix + '-' + name;

  useEffect(() => {
    if (failure) summary.current?.focus();
  }, [failure]);

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        void submit(event);
      }}
      aria-label="Alta de cliente"
    >
      {failure && (
        <div
          className={styles.summary}
          role="alert"
          tabIndex={-1}
          ref={summary}
        >
          <p>{failure.message}</p>
          {Object.entries(failure.fields).length > 0 && (
            <ul>
              {Object.entries(failure.fields).map(([field, message]) => (
                <li key={field}>
                  <a href={'#' + fieldId(field as keyof CreateCustomer)}>
                    {CUSTOMER_FIELD_LABELS[field as keyof CreateCustomer]}:{' '}
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {failure.lookupTaxId && (
            <Link
              to={'/customers' + listSearch(failure.lookupTaxId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Comprobar clientes en una nueva pestaña
            </Link>
          )}
        </div>
      )}
      <fieldset className={styles.fields} disabled={pending}>
        <legend className={shared.srOnly}>Datos del nuevo cliente</legend>
        <h2 className={styles.sectionTitle}>Datos de empresa</h2>
        {textFields.map((field) => (
          <div key={field.name} className={styles.field}>
            <label htmlFor={fieldId(field.name)}>
              {CUSTOMER_FIELD_LABELS[field.name]}{' '}
              <span aria-hidden="true">*</span>
            </label>
            <input
              className={styles.control}
              id={fieldId(field.name)}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              required
              value={values[field.name]}
              aria-invalid={Boolean(failure?.fields[field.name])}
              aria-describedby={
                failure?.fields[field.name]
                  ? fieldId(field.name) + '-error'
                  : undefined
              }
              onChange={(event) => setField(field.name, event.target.value)}
            />
            {failure?.fields[field.name] && (
              <p className={styles.error} id={fieldId(field.name) + '-error'}>
                {failure.fields[field.name]}
              </p>
            )}
          </div>
        ))}
        <div className={styles.field}>
          <label htmlFor={fieldId('countryCode')}>
            País <span aria-hidden="true">*</span>
          </label>
          <select
            className={styles.control}
            id={fieldId('countryCode')}
            name="countryCode"
            required
            disabled={countries.status !== 'ready'}
            value={values.countryCode}
            aria-invalid={Boolean(failure?.fields.countryCode)}
            aria-describedby={
              failure?.fields.countryCode
                ? fieldId('countryCode') + '-error'
                : undefined
            }
            onChange={(event) => setField('countryCode', event.target.value)}
          >
            <option value="">
              {countries.status === 'loading'
                ? 'Cargando países…'
                : 'Selecciona un país'}
            </option>
            {countries.countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
          {failure?.fields.countryCode && (
            <p className={styles.error} id={fieldId('countryCode') + '-error'}>
              {failure.fields.countryCode}
            </p>
          )}
        </div>
        <h2 className={styles.sectionTitle + ' ' + styles.subscription}>
          Suscripción
        </h2>
        <div className={styles.field}>
          <label htmlFor={fieldId('planCode')}>
            Plan elegido <span aria-hidden="true">*</span>
          </label>
          <select
            className={styles.control}
            id={fieldId('planCode')}
            name="planCode"
            required
            value={values.planCode}
            aria-invalid={Boolean(failure?.fields.planCode)}
            aria-describedby={
              failure?.fields.planCode
                ? fieldId('planCode') + '-error'
                : 'plan-hint'
            }
            onChange={(event) => setField('planCode', event.target.value)}
          >
            <option value="">Selecciona un plan</option>
            {PLAN_CODES.map((plan) => (
              <option key={plan} value={plan}>
                {PLAN_LABELS[plan]}
              </option>
            ))}
          </select>
          <p className={styles.hint} id="plan-hint">
            Planes de demostración. Actualmente ambos aplican la misma tarifa.
          </p>
          {failure?.fields.planCode && (
            <p className={styles.error} id={fieldId('planCode') + '-error'}>
              {failure.fields.planCode}
            </p>
          )}
        </div>
      </fieldset>
      {countries.status === 'error' && (
        <div className={styles.summary} role="alert">
          <p>
            No se han podido cargar los países disponibles. Tus datos se
            conservan.
          </p>
          <button
            type="button"
            className={shared.button}
            onClick={countries.retry}
          >
            Reintentar países
          </button>
        </div>
      )}
      <div className={styles.actions}>
        <button
          className={shared.button}
          type="button"
          disabled={pending}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          className={layout.action + ' ' + styles.submit}
          type="submit"
          disabled={pending || countries.status !== 'ready'}
        >
          {pending ? 'Creando cliente…' : 'Crear cliente'}
        </button>
      </div>
      <p className={shared.srOnly} role="status">
        {pending ? 'Creando cliente…' : ''}
      </p>
    </form>
  );
}
