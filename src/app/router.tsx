import { createBrowserRouter } from 'react-router-dom';
import { SyllabusList } from '../features/syllabus/pages/SyllabusList';
import { SyllabusDetails } from '../features/syllabus/pages/SyllabusDetails';
import { CreateSyllabus } from '../features/syllabus/pages/CreateSyllabus';
import { CourseList } from '../features/courses/pages/CourseList';
import { CourseDetails } from '../features/courses/pages/CourseDetails';
import { CreateCourse } from '../features/courses/pages/CreateCourse';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from '../features/auth/pages/Login';
import { Register } from '../features/auth/pages/Register';
import { ForgotPassword } from '../features/auth/pages/ForgotPassword';
import { ResetPassword } from '../features/auth/pages/ResetPassword';
import { RoleGuard } from '../features/auth/components/RoleGuard';
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage';
import { UserRole } from '../features/auth/core/_models';
import { RoleManagementPage } from '../features/admin/pages/RoleManagementPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={[UserRole.Student, UserRole.Professor, UserRole.Administrator]}>
              <SyllabusList />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'syllabus',
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={[UserRole.Student, UserRole.Professor, UserRole.Administrator]}>
              <SyllabusList />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'syllabus/:syllabusId',
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={[UserRole.Student, UserRole.Professor, UserRole.Administrator]}>
              <SyllabusDetails />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'syllabus/create',
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={[UserRole.Professor, UserRole.Administrator]}>
              <CreateSyllabus />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses',
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={[UserRole.Student, UserRole.Professor, UserRole.Administrator]}>
              <CourseList />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses/:courseId',
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={[UserRole.Student, UserRole.Professor, UserRole.Administrator]}>
              <CourseDetails />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses/create',
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={[UserRole.Professor, UserRole.Administrator]}>
              <CreateCourse />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'unauthorized',
        element: <UnauthorizedPage />,
      },
      {
        path: 'admin/roles',
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={[UserRole.Administrator]}>
              <RoleManagementPage />
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
    ],
  },
]); 