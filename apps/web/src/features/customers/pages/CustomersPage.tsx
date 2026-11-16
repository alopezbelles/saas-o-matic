import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router';
import {
  CUSTOMER_PAGE_SIZE,
  listSearch,
  nextPageAllowed,
  parseListLocation,
} from '../list-location';
import { useCustomers } from '../useCustomers';
import { useQueryFocus } from '../useQueryFocus';
import { CustomerList } from '../components/CustomerList';
import styles from '../components/Customers.module.css';
import layout from '../../../app/AppLayout.module.css';

export function CustomersPage() {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const query = useMemo(() => {
    try {
      return parseListLocation(location.search);
    } catch {
      return null;
    }
  }, [location.search]);
  const q = query?.q ?? '';
  const [search, setSearch] = useState({ query: q, value: q });
  // Back/forward navigation must update the field without remounting its DOM.
  if (search.query !== q) setSearch({ query: q, value: q });
  const draft = search.query === q ? search.value : q;
  const { state, retry } = useCustomers(query);
  const requestFocus = useQueryFocus(state.key, state.status, 'page-heading');
  const changePage = (offset: number) => {
    requestFocus();
    setSearchParams(listSearch(q, offset));
  };

  useEffect(() => {
    if (!query || draft === q) return;
    const timer = setTimeout(() => {
      try {
        setSearchParams(listSearch(draft), { replace: true });
      } catch {
        /* Field error is rendered below. */
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [draft, q, query, setSearchParams]);

  let validDraft = true;
  try {
    listSearch(draft);
  } catch {
    validDraft = false;
  }
  const returnTo =
    '/customers' + (query ? listSearch(query.q, query.offset) : '');

  return (
    <section className={layout.page} aria-labelledby="page-heading">
      <div className={layout.pageHeader}>
        <div className={layout.intro}>
          <h1 id="page-heading" tabIndex={-1}>
            Clientes
          </h1>
          <p className={layout.description}>
            Consulta y gestiona tus clientes corporativos.
          </p>
        </div>
        <Link
          className={layout.action}
          to="/customers/new"
          state={{ returnTo }}
        >
          <span className={layout.actionIcon} aria-hidden="true">
            +
          </span>
          Nuevo cliente
        </Link>
      </div>
      <label className={styles.searchLabel}>
        <span className={styles.srOnly}>
          Buscar por empresa o identificador fiscal
        </span>
        <input
          className={styles.search}
          type="search"
          value={draft}
          placeholder="Buscar por empresa o identificador fiscal"
          aria-invalid={!validDraft}
          aria-describedby={!validDraft ? 'search-error' : undefined}
          onChange={(event) =>
            setSearch({ query: q, value: event.target.value })
          }
        />
      </label>
      {!validDraft && (
        <p id="search-error" className={styles.error} role="alert">
          La búsqueda admite hasta 200 caracteres y no permite caracteres de
          control.
        </p>
      )}
      {!query ? (
        <div className={styles.status} role="alert">
          <p>La dirección contiene parámetros de búsqueda no válidos.</p>
          <Link to="/customers">Restablecer búsqueda</Link>
        </div>
      ) : state.status === 'loading' ? (
        <p className={styles.status} role="status">
          Cargando clientes…
        </p>
      ) : state.status === 'error' ? (
        <div className={styles.status} role="alert">
          <p>{state.message}</p>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              requestFocus();
              retry();
            }}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <p role="status">
            {state.page.total}{' '}
            {state.page.total === 1 ? 'resultado' : 'resultados'}
          </p>
          {state.page.items.length ? (
            <CustomerList items={state.page.items} returnTo={returnTo} />
          ) : (
            <div className={styles.status}>
              <p>
                {query.offset > 0
                  ? 'No hay clientes en esta página.'
                  : query.q
                    ? 'No hay clientes que coincidan con la búsqueda.'
                    : 'Todavía no hay clientes registrados.'}
              </p>
              {query.offset > 0 && (
                <Link to={'/customers' + listSearch(query.q)}>
                  Volver a la primera página
                </Link>
              )}
            </div>
          )}
          <nav
            className={styles.pagination}
            aria-label="Paginación de clientes"
          >
            <p>
              {state.page.items.length
                ? `Mostrando ${query.offset + 1}–${query.offset + state.page.items.length} de ${state.page.total}`
                : 'Sin resultados en esta página'}
            </p>
            <div className={styles.pageActions}>
              <button
                className={styles.button}
                type="button"
                disabled={query.offset === 0}
                onClick={() =>
                  changePage(Math.max(0, query.offset - CUSTOMER_PAGE_SIZE))
                }
              >
                Anterior
              </button>
              <button
                className={styles.button}
                type="button"
                disabled={!nextPageAllowed(query, state.page.total)}
                onClick={() => changePage(query.offset + CUSTOMER_PAGE_SIZE)}
              >
                Siguiente
              </button>
            </div>
          </nav>
        </>
      )}
    </section>
  );
}
