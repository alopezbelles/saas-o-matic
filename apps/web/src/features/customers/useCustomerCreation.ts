import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  InputError,
  parseCreateCustomer,
  type CreateCustomer,
  type CustomerDto,
} from '@saas-o-matic/shared';
import { createCustomer } from './api/customers';
import { ApiRequestError } from './api/http';
import { CUSTOMER_FIELD_LABELS } from './customer-labels';
import type { CustomerCountry } from './api/billing-config';

export type CustomerDraft = Record<keyof CreateCustomer, string>;
export type CustomerFieldErrors = Partial<Record<keyof CreateCustomer, string>>;
export interface CreationFailure {
  message: string;
  fields: CustomerFieldErrors;
  lookupTaxId?: string;
}

function knownFields(fields: Record<string, string> = {}): CustomerFieldErrors {
  return Object.fromEntries(
    Object.entries(fields).filter(([name]) =>
      Object.hasOwn(CUSTOMER_FIELD_LABELS, name),
    ),
  );
}

function submissionFailure(error: unknown, taxId: string): CreationFailure {
  if (error instanceof InputError) {
    return {
      message: 'Revisa los campos indicados.',
      fields: knownFields(error.fields),
    };
  }
  if (error instanceof ApiRequestError && error.kind === 'http') {
    if (error.status === 409) {
      const message =
        'Ya existe un cliente con ese identificador fiscal en el país seleccionado.';
      return { message, fields: { taxId: message } };
    }
    if (error.status === 422) {
      return {
        message: 'Revisa los campos indicados.',
        fields: knownFields(error.envelope?.fields),
      };
    }
    return {
      message:
        error.status === 503
          ? 'El servicio no está disponible. Tus datos se conservan. Inténtalo de nuevo.'
          : 'No se ha podido crear el cliente. Inténtalo de nuevo.',
      fields: {},
    };
  }
  return {
    message:
      'No podemos confirmar si el cliente se ha creado. Comprueba el listado antes de volver a enviarlo.',
    fields: {},
    lookupTaxId: taxId,
  };
}

export function useCustomerCreation(
  countries: CustomerCountry[],
  onCreated: (customer: CustomerDto) => void,
) {
  const [values, setValues] = useState<CustomerDraft>({
    companyName: '',
    taxId: '',
    contactEmail: '',
    countryCode: '',
    planCode: '',
  });
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<CreationFailure | null>(null);
  const busy = useRef(false);
  const active = useRef(true);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      controller.current?.abort();
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    let input: CreateCustomer;
    try {
      input = parseCreateCustomer(values);
      if (!countries.some((country) => country.code === input.countryCode)) {
        throw new InputError('VALIDATION_ERROR', {
          countryCode: 'Selecciona un país disponible.',
        });
      }
    } catch (error) {
      setFailure(submissionFailure(error, values.taxId));
      return;
    }
    busy.current = true;
    setPending(true);
    setFailure(null);
    controller.current = new AbortController();
    try {
      const customer = await createCustomer(input, controller.current.signal);
      if (active.current) onCreated(customer);
    } catch (error) {
      if (active.current) setFailure(submissionFailure(error, input.taxId));
    } finally {
      busy.current = false;
      if (active.current) setPending(false);
    }
  }

  return {
    values,
    pending,
    failure,
    submit,
    setField(name: keyof CreateCustomer, value: string) {
      setValues((previous) => ({ ...previous, [name]: value }));
    },
  };
}
