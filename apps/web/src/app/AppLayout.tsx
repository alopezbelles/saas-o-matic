import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { Breadcrumbs } from './Breadcrumbs';
import styles from './AppLayout.module.css';

export function AppLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.getElementById('page-heading')?.focus();
  }, [pathname]);

  return (
    <>
      <a className={styles.skipLink} href="#main-content">
        Saltar al contenido
      </a>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link
            className={styles.brand}
            to="/customers"
            aria-label="saas-o-matic — Inicio"
          >
            SaaS-O-Matic
          </Link>
          <nav aria-label="Navegación principal">
            <NavLink className={styles.navLink!} to="/customers">
              Clientes
            </NavLink>
          </nav>
        </div>
      </header>
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Breadcrumbs />
        <Outlet />
      </main>
    </>
  );
}
