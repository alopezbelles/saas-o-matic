import { Link } from 'react-router';
import styles from './AppLayout.module.css';

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
