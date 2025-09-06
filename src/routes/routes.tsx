import { createBrowserRouter } from 'react-router';
import HomeIndex from '../pages/home/HomeIndex.tsx';
import AdminLayout from '@/share/layout/AdminLayout.tsx';
import AdminIndex from '@/pages/admin/AdminIndex.tsx';
import MatchIndex from '@/pages/admin/match/MatchIndex.tsx';
import PlayingIdIndex from '@/pages/admin/playing/PlayingIdIndex.tsx';
import MatchCreateIndex from '@/pages/admin/match/MatchCreateIndex.tsx';

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
    element: <AdminLayout />,
    children: [
      { path: '', element: <AdminIndex /> },
      { path: 'match', element: <MatchIndex /> },
      { path: 'match/create', element: <MatchCreateIndex /> },
      { path: 'playing', element: <div>경기운영</div> },
    ],
  },
  { path: '/admin/playing/:matchId', element: <PlayingIdIndex /> },
]);
