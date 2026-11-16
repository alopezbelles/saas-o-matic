import { Link, useLocation } from 'react-router';
import styles from './AppLayout.module.css';

export function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  let current = 'Página no encontrada';
  if (pathname === '/customers') current = 'Clientes';
  else if (pathname === '/customers/new') current = 'Nuevo cliente';
  else if (/^\/customers\/[^/]+$/.test(pathname)) current = 'Ficha del cliente';

  return (
    <nav aria-label="Ruta de navegación">
      <ol className={styles.breadcrumbs}>
        {current !== 'Clientes' && (
          <li>
            <Link to="/customers">Clientes</Link>
          </li>
        )}
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
