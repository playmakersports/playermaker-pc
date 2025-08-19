import { createBrowserRouter } from 'react-router';
import HomeIndex from '../pages/home/HomeIndex.tsx';

export const router = createBrowserRouter([
  { path: '/', element: <HomeIndex /> },
  { path: '/introduce', element: <HomeIndex /> },
  { path: '/s', element: <HomeIndex /> },
  {
    path: '/account',
    children: [
      { path: 'join', element: <div>home</div> },
      { path: 'login', element: <div>login</div> },
    ],
  },
  {
    path: '/admin',
    children: [
      { path: '', element: <div>dashboard</div> },
      { path: 'match', element: <div>match</div> },
      { path: 'playing', element: <div>경기운영</div> },
    ],
  },
]);
