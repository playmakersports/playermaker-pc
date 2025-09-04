import { Outlet } from 'react-router';
import Navigation from '@/share/layout/Navigation.tsx';
import { layoutStyle as style } from '@/share/layout/layout.css.ts';

function AdminLayout() {
  return (
    <div className={style.adminRoot}>
      <header>
        <Navigation />
      </header>
      <main className={style.main}>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  );
}

export default AdminLayout;
