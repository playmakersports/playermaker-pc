import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';

export default function Router() {
  return <RouterProvider router={router} />;
}
