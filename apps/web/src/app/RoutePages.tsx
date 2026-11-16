import { Link, useLocation } from 'react-router';
import { customersReturnTo } from '../features/customers/list-location';
import styles from './AppLayout.module.css';

export function CustomerCreateRoutePage() {
  const { state } = useLocation();
  return (
    <section className={styles.page} aria-labelledby="page-heading">
      <h1 id="page-heading" tabIndex={-1}>
        Nuevo cliente
      </h1>
      <div className={styles.surface}>
        <p>El formulario de alta estará disponible próximamente.</p>
      </div>
      <Link to={customersReturnTo(state)}>Volver a clientes</Link>
    </section>
  );
}

export function CustomerDetailRoutePage() {
  const { state } = useLocation();
  return (
    <section className={styles.page} aria-labelledby="page-heading">
      <h1 id="page-heading" tabIndex={-1}>
        Ficha del cliente
      </h1>
      <div className={styles.surface}>
        <p>
          Los datos del cliente y su historial estarán disponibles próximamente.
        </p>
      </div>
      <Link to={customersReturnTo(state)}>Volver a clientes</Link>
    </section>
  );
}

export function NotFoundPage() {
  return (
    <section className={styles.page} aria-labelledby="page-heading">
      <h1 id="page-heading" tabIndex={-1}>
        Página no encontrada
      </h1>
      <p className={styles.description}>
        Comprueba la dirección o vuelve al listado de clientes.
      </p>
      <Link className={styles.action} to="/customers">
        Volver a clientes
      </Link>
    </section>
  );
}
