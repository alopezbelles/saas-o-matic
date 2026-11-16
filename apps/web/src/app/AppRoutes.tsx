import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from './AppLayout';
import {
  CustomerCreateRoutePage,
  CustomerDetailRoutePage,
  NotFoundPage,
} from './RoutePages';
import { CustomersPage } from '../features/customers/pages/CustomersPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/customers" replace />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/new" element={<CustomerCreateRoutePage />} />
        <Route path="customers/:id" element={<CustomerDetailRoutePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
