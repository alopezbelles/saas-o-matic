import type { CustomerDto } from '@saas-o-matic/shared';
import { countryLabel, PLAN_LABELS } from '../customer-labels';
import styles from './CustomerCards.module.css';

export function CustomerCards({ customer }: { customer: CustomerDto }) {
  return (
    <div className={styles.cards}>
      <section className={styles.card} aria-labelledby="corporate-heading">
        <h2 id="corporate-heading">Datos corporativos</h2>
        <dl>
          <div className={styles.row}>
            <dt>Identificador fiscal</dt>
            <dd>{customer.taxId}</dd>
          </div>
          <div className={styles.row}>
            <dt>País</dt>
            <dd>{countryLabel(customer.countryCode)}</dd>
          </div>
        </dl>
      </section>
      <section className={styles.card} aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contacto</h2>
        <dl>
          <div className={styles.row}>
            <dt>Email de contacto</dt>
            <dd>{customer.contactEmail}</dd>
          </div>
          <div className={styles.row}>
            <dt>Plan</dt>
            <dd>{PLAN_LABELS[customer.planCode]}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
