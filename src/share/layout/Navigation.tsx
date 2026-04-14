import { Link, useLocation } from 'react-router';

function Navigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const MENUS = [
    { name: '경기', path: '/admin/match' },
    // { name: '경기운영', path: '/admin/playing' },
  ];

  return (
    <nav className="w-full h-[60px] border-b border-gray-100">
      <div className="mx-auto px-4 flex justify-between min-w-[1280px] max-w-[1280px] w-full h-full">
        <ul className="flex gap-4">
          {MENUS.map(menu => (
            <li key={menu.path}>
              <Link
                to={menu.path}
                className="text-sm font-normal flex items-center px-2.5 pt-1 h-full border-b-[3px] border-transparent active:bg-gray-100 data-[active=true]:font-semibold data-[active=true]:text-primary-600 data-[active=true]:border-primary-600"
                data-active={pathname.includes(menu.path)}
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-1.5 items-center">
          <p className="text-sm font-normal">SPABA(매니저)</p>
          <p className="text-sm font-medium">유저명</p>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
