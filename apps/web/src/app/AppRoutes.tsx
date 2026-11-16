import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from './AppLayout';
import { NotFoundPage } from './RoutePages';
import { CustomerDetailPage } from '../features/customers/pages/CustomerDetailPage';
import { CustomersPage } from '../features/customers/pages/CustomersPage';
import { CustomerCreatePage } from '../features/customers/pages/CustomerCreatePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/customers" replace />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/new" element={<CustomerCreatePage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
