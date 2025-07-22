import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/widgets/layout';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { CreateUserPage } from '@/pages/create-user';
import { EditUserPage } from '@/pages/edit-user';
import { ProtectedRoute } from '@/shared/ui';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path="user/create" element={<CreateUserPage />} />
        <Route path="user/edit/:id" element={<EditUserPage />} />
      </Route>
    </Routes>
  );
}
