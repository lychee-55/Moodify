// src/pages/MyPage.tsx
import { Outlet } from 'react-router-dom';
import MyProfile from '../components/myPageComp/MyProfile';

export default function MyPage() {
  return (
    <>
      <MyProfile />
      <Outlet />
    </>
  );
}
