import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from './AppLayout';
import {
  CustomerCreateRoutePage,
  CustomerDetailRoutePage,
  CustomersRoutePage,
  NotFoundPage,
} from './RoutePages';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/customers" replace />} />
        <Route path="customers" element={<CustomersRoutePage />} />
        <Route path="customers/new" element={<CustomerCreateRoutePage />} />
        <Route path="customers/:id" element={<CustomerDetailRoutePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
