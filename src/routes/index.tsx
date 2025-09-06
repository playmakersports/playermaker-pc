import { RouterProvider } from 'react-router';
import { OverlayProvider } from 'overlay-kit';
import { router } from './routes.tsx';

export default function Router() {
  return (
    <OverlayProvider>
      <RouterProvider router={router} />
    </OverlayProvider>
  );
}
