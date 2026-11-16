import { Link, matchPath, useLocation } from 'react-router';
import { parseCustomerId } from '@saas-o-matic/shared';
import { simulationReturn } from '../features/simulations/simulation-location';
import styles from './AppLayout.module.css';
import { customersReturnTo } from '../features/customers/list-location';

export function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const simulation = matchPath('/customers/:id/simulations/new', pathname);
  let customerId: string | null = null;
  if (simulation) {
    try {
      customerId = parseCustomerId(simulation.params.id);
    } catch {
      /* Invalid IDs have no client breadcrumb link. */
    }
  }
  const back = customerId ? simulationReturn(customerId, location.state) : null;
  let current = 'Página no encontrada';
  if (pathname === '/customers') current = 'Clientes';
  else if (pathname === '/customers/new') current = 'Nuevo cliente';
  else if (/^\/customers\/[^/]+$/.test(pathname)) current = 'Ficha del cliente';
  else if (simulation) current = 'Nueva simulación';

  return (
    <nav aria-label="Ruta de navegación">
      <ol className={styles.breadcrumbs}>
        {current !== 'Clientes' && (
          <li>
            <Link to={customersReturnTo(location.state)}>Clientes</Link>
          </li>
        )}
        {back && (
          <li>
            <Link to={back.to} state={back.state}>
              Ficha del cliente
            </Link>
          </li>
        )}
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
