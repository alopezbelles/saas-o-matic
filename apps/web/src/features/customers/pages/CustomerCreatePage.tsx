import { useLocation, useNavigate } from 'react-router';
import { CustomerForm } from '../components/CustomerForm';
import { customersReturnTo } from '../list-location';
import layout from '../../../app/AppLayout.module.css';

export function CustomerCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = customersReturnTo(location.state);
  return (
    <section className={layout.page} aria-labelledby="page-heading">
      <div className={layout.intro}>
        <h1 id="page-heading" tabIndex={-1}>
          Nuevo cliente
        </h1>
        <p className={layout.description}>
          Registra una empresa y sus datos de contacto.
        </p>
      </div>
      <CustomerForm
        onCancel={() => navigate(returnTo)}
        onCreated={(customer) =>
          navigate('/customers/' + customer.id, {
            state: { returnTo, createdCustomerId: customer.id },
          })
        }
      />
    </section>
  );
}
