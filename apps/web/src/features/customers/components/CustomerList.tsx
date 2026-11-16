import { Link } from 'react-router';
import type { CustomerDto } from '@saas-o-matic/shared';
import styles from './Customers.module.css';

import { countryLabel, PLAN_LABELS } from '../customer-labels';

export function CustomerList({
  items,
  returnTo,
}: {
  items: CustomerDto[];
  returnTo: string;
}) {
  return (
    <table className={styles.table}>
      <caption className={styles.srOnly}>
        Listado de clientes corporativos
      </caption>
      <thead>
        <tr>
          <th scope="col">Empresa</th>
          <th scope="col">Identificador fiscal</th>
          <th scope="col">País</th>
          <th scope="col">Plan</th>
          <th scope="col">Acción</th>
        </tr>
      </thead>
      <tbody>
        {items.map((customer) => (
          <tr key={customer.id}>
            <td data-label="Empresa" className={styles.company}>
              {customer.companyName}
            </td>
            <td data-label="Identificador fiscal">{customer.taxId}</td>
            <td data-label="País">{countryLabel(customer.countryCode)}</td>
            <td data-label="Plan">{PLAN_LABELS[customer.planCode]}</td>
            <td data-label="Acción">
              <Link
                to={'/customers/' + customer.id}
                state={{ returnTo }}
                aria-label={'Ver cliente ' + customer.companyName}
              >
                Ver cliente <span aria-hidden="true">→</span>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
