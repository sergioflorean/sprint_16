import { Route, Routes } from 'react-router-dom';

import AppLayout from '../AppLayout/AppLayout';
import { ProtectedRoute, PublicRoute } from '../ProtectedRoute/ProtectedRoute';
import NotFoundPage from '../../pages/NotFoundPage';
import NotesPage from '../../pages/NotesPage';
import SignInPage from '../../pages/SignInPage';
import SignUpPage from '../../pages/SignUpPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<NotesPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
