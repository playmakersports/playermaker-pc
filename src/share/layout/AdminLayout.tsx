import { Outlet } from 'react-router';
import Navigation from '@/share/layout/Navigation.tsx';

function AdminLayout() {
  return (
    <div className="mx-auto h-max">
      <header>
        <Navigation />
      </header>
      <main className="mx-auto px-4 min-w-[1280px] max-w-[1280px] w-full h-full min-h-[calc(100vh-60px)]">
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}

export default AdminLayout;
