import { Link } from 'react-router';
import styles from './AppLayout.module.css';

export function CustomersRoutePage() {
  return (
    <section className={styles.page} aria-labelledby="page-heading">
      <div className={styles.pageHeader}>
        <div className={styles.intro}>
          <h1 id="page-heading" tabIndex={-1}>
            Clientes
          </h1>
          <p className={styles.description}>
            Consulta y gestiona tus clientes corporativos.
          </p>
        </div>
        <Link className={styles.action} to="/customers/new">
          <span className={styles.actionIcon} aria-hidden="true">
            +
          </span>
          Nuevo cliente
        </Link>
      </div>
      <div className={styles.surface}>
        <p>El listado de clientes estará disponible próximamente.</p>
      </div>
    </section>
  );
}

export function CustomerCreateRoutePage() {
  return (
    <section className={styles.page} aria-labelledby="page-heading">
      <h1 id="page-heading" tabIndex={-1}>
        Nuevo cliente
      </h1>
      <div className={styles.surface}>
        <p>El formulario de alta estará disponible próximamente.</p>
      </div>
      <Link to="/customers">Volver a clientes</Link>
    </section>
  );
}

export function CustomerDetailRoutePage() {
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
      <Link to="/customers">Volver a clientes</Link>
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
