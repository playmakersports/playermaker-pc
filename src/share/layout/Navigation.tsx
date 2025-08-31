import { layoutStyle as style } from './layout.css.ts';
import { fonts } from '@/style/typo.css.ts';
import { Link, useLocation } from 'react-router';

function Navigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const MENUS = [
    { name: '경기', path: '/admin/match' },
    { name: '경기운영', path: '/admin/playing' },
  ];

  return (
    <nav className={style.navContainer}>
      <div className={style.navInner}>
        <ul className={style.navMenu}>
          {MENUS.map(menu => (
            <li key={menu.path}>
              <Link to={menu.path} className={style.navItems} data-active={pathname.includes(menu.path)}>
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className={style.navUser}>
          <p className={fonts.body4.regular}>SPABA(매니저)</p>
          <p className={fonts.body4.medium}>유저명</p>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
