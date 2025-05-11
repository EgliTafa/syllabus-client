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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <SyllabusList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'syllabus',
        element: (
          <ProtectedRoute>
            <SyllabusList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'syllabus/:syllabusId',
        element: (
          <ProtectedRoute>
            <SyllabusDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'syllabus/create',
        element: (
          <ProtectedRoute>
            <CreateSyllabus />
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses',
        element: (
          <ProtectedRoute>
            <CourseList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses/:courseId',
        element: (
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses/create',
        element: (
          <ProtectedRoute>
            <CreateCourse />
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
    ],
  },
]); 